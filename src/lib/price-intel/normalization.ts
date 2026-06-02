/**
 * Price observation normalisation.
 *
 * - convertToBaseUnit: unify quantities (e.g. all rebar → per piece, all
 *   aggregates → per tonne) so that observations from different sources
 *   can be aggregated.
 * - isOutlier: tag observations that deviate >2.5 × MAD from the current
 *   median for the same (material, region) cohort.
 * - scoreConfidence: derive a 0–100 confidence from source + freshness.
 */

import type { PriceSource } from "@prisma/client"

export interface RawObservation {
  unitPrice: number
  quantity?: number | null
  unit?: string | null
  currency?: string | null
  source: PriceSource
  observedAt?: Date | null
}

/** Source weights (0-1) used in confidence scoring. */
export const SOURCE_WEIGHT: Record<PriceSource, number> = {
  ADMIN_SEED: 0.55,
  APIFY_SCRAPER: 0.45,
  AI_EXTRACTION: 0.50,
  SUPPLIER_SUBMISSION: 0.85,
  PARTNER_FEED: 0.80,
  MANUAL: 0.65,
}

/**
 * Convert an observation's `unitPrice` to a canonical per-unit price.
 *
 * Returns NaN if input is unparseable; caller should reject in that case.
 */
export function normalizeToUnit(obs: RawObservation, targetUnit: string): number {
  const qty = Number(obs.quantity ?? 1)
  const price = Number(obs.unitPrice)
  if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(price) || price <= 0) return NaN

  const from = (obs.unit ?? targetUnit).toLowerCase().trim()
  const to = targetUnit.toLowerCase().trim()
  if (from === to) return price / qty

  // simple mass conversions
  const massFactors: Record<string, number> = {
    "kg": 1,
    "kgs": 1,
    "tonne": 1000,
    "tonnes": 1000,
    "ton": 1000,
    "tons": 1000,
    "t": 1000,
  }
  if (massFactors[from] && massFactors[to]) {
    return (price / qty) * (massFactors[from] / massFactors[to])
  }

  // length conversions
  const lengthFactors: Record<string, number> = {
    "m": 1,
    "meter": 1,
    "meters": 1,
    "metre": 1,
    "metres": 1,
    "ft": 0.3048,
    "feet": 0.3048,
    "foot": 0.3048,
  }
  if (lengthFactors[from] && lengthFactors[to]) {
    return (price / qty) * (lengthFactors[from] / lengthFactors[to])
  }

  // bags ↔ kg of cement (50 kg standard bag)
  if (from === "bag" && to === "kg") return (price / qty) / 50
  if (from === "kg" && to === "bag") return (price / qty) * 50
  if (from === "bag" && to === "tonne") return (price / qty) / 20
  if (from === "tonne" && to === "bag") return (price / qty) * 20

  // square metre fallback
  if (from === to.replace(/\s+/g, "")) return price / qty

  // last resort — assume the source's per-unit price is already correct
  return price / qty
}

/**
 * Median absolute deviation outlier filter.
 *
 * Returns true if `value` is more than `threshold` MADs from the median of
 * the supplied reference distribution.
 */
export function isOutlier(value: number, reference: number[], threshold = 2.5): boolean {
  if (!reference.length || !Number.isFinite(value)) return false
  const sorted = [...reference].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  const deviations = sorted.map((x) => Math.abs(x - median))
  deviations.sort((a, b) => a - b)
  const mad = deviations[Math.floor(deviations.length / 2)]
  if (mad === 0) return Math.abs(value - median) / Math.max(median, 1) > 0.5
  return Math.abs(value - median) / mad > threshold
}

/**
 * Compute a confidence score (0–100) for an observation.
 *
 * Heuristic:
 *   confidence = round(100 × sourceWeight × freshnessFactor × corroborationFactor)
 *   freshnessFactor decays linearly from 1.0 (today) to 0.0 (>60 days)
 *   corroborationFactor: 1.0 if ≥3 samples within the same period & region, else 0.7
 */
export function scoreConfidence(opts: {
  source: PriceSource
  observedAt: Date
  cohortSampleSize?: number
}): number {
  const sw = SOURCE_WEIGHT[opts.source] ?? 0.5
  const ageDays = (Date.now() - opts.observedAt.getTime()) / 86400000
  const fresh = Math.max(0, 1 - ageDays / 60)
  const corr = (opts.cohortSampleSize ?? 0) >= 3 ? 1.0 : 0.7
  return Math.round(100 * sw * fresh * corr)
}

/**
 * Compute simple statistical aggregates for a price cohort.
 */
export function summariseCohort(values: number[]): {
  p25: number | null
  median: number | null
  p75: number | null
  mean: number | null
  stddev: number | null
  n: number
} {
  const clean = values.filter((v) => Number.isFinite(v) && v > 0).sort((a, b) => a - b)
  const n = clean.length
  if (!n) return { p25: null, median: null, p75: null, mean: null, stddev: null, n: 0 }
  const pct = (p: number) => clean[Math.max(0, Math.min(n - 1, Math.floor(p * (n - 1))))]
  const mean = clean.reduce((s, v) => s + v, 0) / n
  const variance = clean.reduce((s, v) => s + (v - mean) ** 2, 0) / n
  return {
    p25: pct(0.25),
    median: pct(0.5),
    p75: pct(0.75),
    mean,
    stddev: Math.sqrt(variance),
    n,
  }
}
