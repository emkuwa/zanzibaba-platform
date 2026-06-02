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
 * Heuristic: lines with at least one numeric token are candidate rows.
 */
export function parseTextBOQ(text: string): ParsedBOQLine[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const rows: ParsedBOQLine[] = []
  for (const raw of lines) {
    if (HEADER_PATTERNS.some((p) => raw.toLowerCase().startsWith(p))) continue
    const cells = raw.split(/\t|,| {2,}|;|\|/).map((c) => c.trim()).filter(Boolean)
    if (cells.length < 2) continue
    let qty: number | undefined
    let rate: number | undefined
    let amount: number | undefined
    let unit: string | undefined
    let description: string | undefined
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i]
      const num = Number(c.replace(/[^0-9.\-]/g, ""))
      if (Number.isFinite(num) && num > 0) {
        if (qty === undefined) qty = num
        else if (rate === undefined) rate = num
        else if (amount === undefined) amount = num
      } else if (!description) {
        description = c
      } else if (!unit && /^[A-Za-z]{1,8}\.?$/.test(c)) {
        unit = c
      }
    }
    if (description && qty && qty > 0) {
      rows.push({ description, qty, unit, rate, amount: amount ?? (rate && qty ? rate * qty : null), source: "row" })
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
