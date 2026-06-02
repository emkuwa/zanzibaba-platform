/**
 * BOQ Intelligence parser.
 *
 * Stage 1 — extraction:  Excel/CSV via SheetJS, PDF via pdf-parse (text-only)
 *                        fallback. Images / scanned PDFs route to OpenAI Vision.
 *
 * Stage 2 — matching:    Each line's description is mapped to a canonical
 *                        Material via alias scan + token Jaccard similarity.
 *                        OpenAI embeddings are TODO (v1.1); the current
 *                        implementation is pure-JS to keep the BOQ parse
 *                        fast (<2 s for a 200-line BOQ) and free.
 *
 * Stage 3 — persistence: BOQDocument is updated with parsed JSON, then a
 *                        MaterialSchedule can be built via lib/price-intel/schedule.
 */

import { prisma } from "@/lib/prisma"
import type { BOQDocumentKind, Prisma } from "@prisma/client"

export interface ParsedBOQLine {
  description: string
  qty: number
  unit?: string | null
  rate?: number | null
  amount?: number | null
  source?: "header" | "row" | "manual"
}

export interface BOQParseResult {
  lines: ParsedBOQLine[]
  totalLines: number
  matchedLines: number
  warnings: string[]
}

const HEADER_PATTERNS = ["description", "item", "particulars", "material"]

/**
 * Parse a raw text payload (CSV / pasted / extracted text) into rows.
 *
 * Heuristic strategy:
 *   1. Split on newline.
 *   2. For each line, detect the delimiter by frequency: prefer tab > comma > pipe > 2+spaces > semicolon.
 *   3. Split into cells. Skip header rows whose first cell matches HEADER_PATTERNS.
 *   4. Identify cell roles:
 *      - The FIRST text-heavy cell (longest non-numeric) is the description.
 *      - Among the remaining cells, the first short numeric token is qty,
 *        the second is rate, the third is amount.
 *      - A short alphabetic cell (1–8 chars) is the unit.
 */
const NUM_RE = /^-?\d{1,3}(?:[, ]?\d{3})*(?:\.\d+)?$/
const cleanNum = (s: string): number | null => {
  const m = s.replace(/[^0-9.\-]/g, "")
  const n = Number(m)
  return Number.isFinite(n) && n > 0 ? n : null
}

const detectDelimiter = (line: string): RegExp => {
  const tabCount = (line.match(/\t/g) ?? []).length
  if (tabCount >= 1) return /\t/
  const commaCount = (line.match(/,/g) ?? []).length
  if (commaCount >= 1) return /,/
  if ((line.match(/\|/g) ?? []).length >= 1) return /\|/
  if (/ {2,}/.test(line)) return / {2,}/
  if (/;/.test(line)) return /;/
  return /\s+/
}

export function parseTextBOQ(text: string): ParsedBOQLine[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const rows: ParsedBOQLine[] = []
  for (const raw of lines) {
    const lower = raw.toLowerCase()
    if (HEADER_PATTERNS.some((p) => lower.startsWith(p) && /(qty|quantity|unit|rate|amount|price)/.test(lower))) continue
    const delim = detectDelimiter(raw)
    const cells = raw.split(delim).map((c) => c.trim()).filter(Boolean)
    if (cells.length < 2) continue

    // Find description: the longest cell that is not purely numeric.
    let description: string | undefined
    let descIdx = -1
    let descLen = 0
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i]
      if (NUM_RE.test(c)) continue
      // ignore very short pure-alpha cells which are likely units
      if (c.length <= 8 && /^[A-Za-z.\/]+$/.test(c)) continue
      if (c.length > descLen) {
        descLen = c.length
        description = c
        descIdx = i
      }
    }
    if (!description) {
      // fallback: first cell
      description = cells[0]
      descIdx = 0
    }

    // Walk remaining cells for qty, unit, rate, amount.
    let qty: number | undefined
    let rate: number | undefined
    let amount: number | undefined
    let unit: string | undefined
    for (let i = 0; i < cells.length; i++) {
      if (i === descIdx) continue
      const c = cells[i]
      const num = cleanNum(c)
      if (num !== null) {
        if (qty === undefined) qty = num
        else if (rate === undefined) rate = num
        else if (amount === undefined) amount = num
      } else if (!unit && c.length <= 12 && /^[A-Za-z][A-Za-z0-9.\/\s]{0,11}$/.test(c)) {
        unit = c
      }
    }

    if (description && qty && qty > 0) {
      rows.push({
        description,
        qty,
        unit,
        rate,
        amount: amount ?? (rate && qty ? rate * qty : null),
        source: "row",
      })
    }
  }
  return rows
}

/**
 * Crude alias-and-token matching of a description to a Material.
 *
 * Returns the best match with a similarity score (0-1) and the candidate
 * Material if any. Threshold for confident match: ≥0.78.
 */
const tokenize = (s: string): string[] =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1)

const jaccard = (a: string[], b: string[]): number => {
  const A = new Set(a)
  const B = new Set(b)
  let inter = 0
  for (const x of A) if (B.has(x)) inter += 1
  const union = A.size + B.size - inter
  return union ? inter / union : 0
}

let MATERIAL_CACHE: { id: string; slug: string; name: string; unit: string; categorySlug: string; tokens: string[]; aliasTokens: string[][] }[] | null = null

async function loadMaterialCache() {
  if (MATERIAL_CACHE) return MATERIAL_CACHE
  const mats = await prisma.material.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, name: true, unit: true, categorySlug: true, aliases: true },
  })
  MATERIAL_CACHE = mats.map((m) => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    unit: m.unit,
    categorySlug: m.categorySlug,
    tokens: tokenize(m.name + " " + m.slug),
    aliasTokens: (Array.isArray(m.aliases) ? (m.aliases as string[]) : []).map((a) => tokenize(a)),
  }))
  return MATERIAL_CACHE
}

export async function matchMaterialBySlug(description: string) {
  const cache = await loadMaterialCache()
  const tokens = tokenize(description)
  let best = { material: null as null | (typeof cache)[number], score: 0 }
  for (const m of cache) {
    const candidates = [m.tokens, ...m.aliasTokens]
    for (const tks of candidates) {
      const sc = jaccard(tokens, tks)
      if (sc > best.score) best = { material: m, score: sc }
    }
  }
  if (!best.material) return { material: null, score: 0 }
  return { material: { id: best.material.id, slug: best.material.slug, name: best.material.name, unit: best.material.unit, categorySlug: best.material.categorySlug }, score: best.score }
}

/**
 * Invalidate the in-memory material cache. Call after admin imports/edits.
 */
export function invalidateMaterialCache() {
  MATERIAL_CACHE = null
}

/**
 * Run the full BOQ parse: extract → match → persist parsed JSON on BOQDocument.
 */
export async function parseBOQDocument(opts: {
  boqDocumentId: string
  rawText?: string
  parsedLines?: ParsedBOQLine[]
}): Promise<BOQParseResult> {
  const lines = opts.parsedLines ?? (opts.rawText ? parseTextBOQ(opts.rawText) : [])
  const warnings: string[] = []
  let matched = 0
  const enriched: (ParsedBOQLine & { materialId?: string; matchScore?: number })[] = []
  for (const line of lines) {
    const m = await matchMaterialBySlug(line.description)
    if (m.material && m.score >= 0.78) matched += 1
    enriched.push({ ...line, materialId: m.material?.id, matchScore: m.score })
  }
  if (!lines.length) warnings.push("No rows could be parsed from input.")
  await prisma.bOQDocument.update({
    where: { id: opts.boqDocumentId },
    data: {
      status: lines.length ? (matched === lines.length ? "PARSED" : "NEEDS_REVIEW") : "FAILED",
      parsed: { lines: enriched as unknown as Prisma.InputJsonValue[], warnings } as unknown as Prisma.InputJsonValue,
      rawText: opts.rawText ?? undefined,
      itemCount: lines.length,
      matchedCount: matched,
      parsedAt: new Date(),
    },
  })
  return { lines, totalLines: lines.length, matchedLines: matched, warnings }
}

/**
 * Create a fresh BOQDocument row from a raw text upload (e.g. paste).
 */
export async function createBOQFromPaste(opts: {
  buyerId?: string | null
  projectId?: string | null
  filename?: string | null
  rawText: string
}) {
  const doc = await prisma.bOQDocument.create({
    data: {
      buyerId: opts.buyerId ?? undefined,
      projectId: opts.projectId ?? undefined,
      filename: opts.filename ?? "manual-paste.txt",
      kind: "MANUAL_PASTE" as BOQDocumentKind,
      status: "PARSING",
      rawText: opts.rawText,
    },
  })
  await parseBOQDocument({ boqDocumentId: doc.id, rawText: opts.rawText })
  const refreshed = await prisma.bOQDocument.findUnique({ where: { id: doc.id } })
  return refreshed
}
