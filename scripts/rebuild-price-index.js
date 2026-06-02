/**
 * Standalone price index rollup — does the index step from the seed
 * separately so it can be re-run quickly.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL + (process.env.DATABASE_URL.includes("?") ? "&" : "?") + "connection_limit=10&pool_timeout=30",
})

async function main() {
  const observedAt = new Date()
  const periodStart = new Date(observedAt.getTime() - 2 * 86400000)
  const mats = await prisma.material.findMany({ where: { isActive: true }, select: { id: true } })
  const regions = await prisma.region.findMany({ where: { isActive: true }, select: { id: true } })
  console.log(`Indexing ${mats.length} × ${regions.length} = ${mats.length * regions.length} pairs …`)

  // 1) Batch-read all observations in one big query (much faster than N×R queries)
  const allObs = await prisma.priceObservation.findMany({
    where: { status: "ACTIVE", observedAt: { gte: periodStart, lte: observedAt } },
    select: { materialId: true, regionId: true, unitPrice: true, confidence: true, currency: true },
  })
  console.log(`  observations: ${allObs.length}`)

  // 2) Group in memory
  const byKey = new Map()
  for (const o of allObs) {
    const k = o.materialId + "|" + o.regionId
    const list = byKey.get(k) ?? []
    list.push(o)
    byKey.set(k, list)
  }

  // 3) Upsert in concurrency-limited parallel batches
  const entries = [...byKey.entries()]
  let done = 0
  const BATCH = 4
  for (let i = 0; i < entries.length; i += BATCH) {
    const chunk = entries.slice(i, i + BATCH)
    await Promise.all(
      chunk.map(async ([key, obs]) => {
        const [materialId, regionId] = key.split("|")
        const values = obs.map((o) => Number(o.unitPrice)).sort((a, b) => a - b)
        const median = values[Math.floor(values.length / 2)]
        const p25 = values[Math.max(0, Math.floor(values.length * 0.25))]
        const p75 = values[Math.min(values.length - 1, Math.floor(values.length * 0.75))]
        const mean = values.reduce((s, v) => s + v, 0) / values.length
        const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
        const conf = Math.round(obs.reduce((s, o) => s + (o.confidence ?? 0), 0) / obs.length)
        await prisma.materialPriceIndex.upsert({
          where: { materialId_regionId_periodStart_granularity: { materialId, regionId, periodStart, granularity: "daily" } },
          create: { materialId, regionId, periodStart, periodEnd: observedAt, granularity: "daily", currency: obs[0]?.currency ?? "TZS", p25, median, p75, mean, stddev: Math.sqrt(variance), sampleSize: values.length, confidence: conf },
          update: { periodEnd: observedAt, p25, median, p75, mean, stddev: Math.sqrt(variance), sampleSize: values.length, confidence: conf },
        })
      })
    )
    done = Math.min(i + BATCH, entries.length)
    process.stdout.write(`   ${done}/${entries.length}\r`)
  }
  process.stdout.write("\n")
  console.log(`indices: ${await prisma.materialPriceIndex.count()}`)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
