/**
 * Seed Price Intelligence Engine reference data:
 *  - 5 regions (ZNZ, DSM, ARU, DOD, MWZ)
 *  - 16 material categories with share-by-project-type metadata
 *  - ~70 base materials with regional baseline TZS prices
 *  - PriceObservation rows (ADMIN_SEED source) for each material × region
 *  - Initial MaterialPriceIndex rollups
 *  - CostBenchmark rows for each (region × project × tier)
 *
 * Idempotent: safe to re-run; uses upsert / dedupe checks.
 *
 * Usage:
 *   node scripts/seed-price-intel.js
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client")
const path = require("node:path")
// Use ts-node like behavior: this file imports from the compiled output if
// available, otherwise the source ts modules need transpiling. To keep the
// script runnable without ts-node we duplicate the seed catalog as JSON
// inline. But the canonical source is src/lib/price-intel/constants.ts
// and src/lib/price-intel/seed-data.ts; we re-export the JSON below from
// scripts/price-intel-seed.json (generated alongside).

const seed = require("./price-intel-seed.json")

const prisma = new PrismaClient()

async function runInBatches(promises, batchSize = 20) {
  for (let i = 0; i < promises.length; i += batchSize) {
    await Promise.all(promises.slice(i, i + batchSize))
    process.stdout.write(`   ${Math.min(i + batchSize, promises.length)}/${promises.length}\r`)
  }
  process.stdout.write("\n")
}

async function main() {
  console.log("Seeding Price Intelligence Engine …")

  // 1. Regions
  console.log("→ regions")
  const regionIdByCode = {}
  for (const r of seed.regions) {
    const row = await prisma.region.upsert({
      where: { code: r.code },
      create: r,
      update: { name: r.name, centerLat: r.centerLat, centerLng: r.centerLng, displayOrder: r.displayOrder },
    })
    regionIdByCode[r.code] = row.id
  }

  // 2. Material categories
  console.log("→ material categories")
  for (const c of seed.categories) {
    await prisma.materialCategoryRef.upsert({
      where: { slug: c.slug },
      create: c,
      update: {
        name: c.name,
        description: c.description,
        icon: c.icon,
        isHospitality: c.isHospitality,
        displayOrder: c.displayOrder,
        shareByProjectType: c.shareByProjectType,
      },
    })
  }

  // 3. Materials
  console.log(`→ materials (${seed.materials.length})`)
  for (const m of seed.materials) {
    await prisma.material.upsert({
      where: { slug: m.slug },
      create: {
        slug: m.slug,
        name: m.name,
        categorySlug: m.categorySlug,
        spec: m.spec,
        unit: m.unit,
        aliases: m.aliases,
      },
      update: {
        name: m.name,
        spec: m.spec,
        unit: m.unit,
        aliases: m.aliases,
      },
    })
  }

  // 4. Seed price observations (one per material per region with a price)
  console.log("→ price observations")
  const observedAt = new Date()
  for (const m of seed.materials) {
    const mat = await prisma.material.findUnique({ where: { slug: m.slug } })
    if (!mat) continue
    for (const [regionCode, price] of Object.entries(m.basePriceTzs)) {
      const regionId = regionIdByCode[regionCode]
      if (!regionId || !price) continue
      // dedupe: skip if an ADMIN_SEED observation already exists today
      const existing = await prisma.priceObservation.findFirst({
        where: {
          materialId: mat.id,
          regionId,
          source: "ADMIN_SEED",
          observedAt: { gte: new Date(observedAt.getFullYear(), observedAt.getMonth(), observedAt.getDate()) },
        },
        select: { id: true },
      })
      if (existing) continue
      await prisma.priceObservation.create({
        data: {
          materialId: mat.id,
          regionId,
          source: "ADMIN_SEED",
          observedAt,
          unitPrice: price,
          currency: "TZS",
          quantity: 1,
          unit: m.unit,
          confidence: 75,
          status: "ACTIVE",
          notes: "Seeded from 2024-25 regional price survey",
        },
      })
    }
  }

  // 5. Cost benchmarks (region × project × tier)
  console.log("→ cost benchmarks")
  const effectiveFrom = new Date(Date.UTC(observedAt.getUTCFullYear(), 0, 1))
  const tierMul = { BASIC: 0.75, MID: 1.0, PREMIUM: 1.65 }
  const benchTasks = []
  for (const [regionCode, projects] of Object.entries(seed.costBenchmarks)) {
    const regionId = regionIdByCode[regionCode]
    if (!regionId) continue
    for (const [projectType, midCost] of Object.entries(projects)) {
      for (const [tier, mul] of Object.entries(tierMul)) {
        const median = Math.round(midCost * mul)
        benchTasks.push(
          prisma.costBenchmark.upsert({
            where: {
              regionId_projectType_qualityTier_effectiveFrom: {
                regionId,
                projectType,
                qualityTier: tier,
                effectiveFrom,
              },
            },
            create: {
              regionId,
              projectType,
              qualityTier: tier,
              effectiveFrom,
              sqmCostMedian: median,
              sqmCostP25: Math.round(median * 0.85),
              sqmCostP75: Math.round(median * 1.2),
              currency: "USD",
              source: "Seed 2024-25 from public TZ construction cost reports",
            },
            update: {
              sqmCostMedian: median,
              sqmCostP25: Math.round(median * 0.85),
              sqmCostP75: Math.round(median * 1.2),
            },
          })
        )
      }
    }
  }
  await runInBatches(benchTasks, 25)

  // 6. Roll up price index for the freshly seeded observations.
  console.log("→ price index rollup")
  const matsAll = await prisma.material.findMany({ where: { isActive: true }, select: { id: true } })
  const regionsAll = await prisma.region.findMany({ where: { isActive: true }, select: { id: true } })
  const start = new Date(observedAt.getTime() - 2 * 86400000)

  const indexTasks = []
  for (const mat of matsAll) {
    for (const region of regionsAll) {
      indexTasks.push(
        (async () => {
          const obs = await prisma.priceObservation.findMany({
            where: {
              materialId: mat.id,
              regionId: region.id,
              status: "ACTIVE",
              observedAt: { gte: start, lte: observedAt },
            },
            select: { unitPrice: true, confidence: true, currency: true },
          })
          if (!obs.length) return
          const values = obs.map((o) => Number(o.unitPrice)).sort((a, b) => a - b)
          const median = values[Math.floor(values.length / 2)]
          const p25 = values[Math.max(0, Math.floor(values.length * 0.25))]
          const p75 = values[Math.min(values.length - 1, Math.floor(values.length * 0.75))]
          const mean = values.reduce((s, v) => s + v, 0) / values.length
          const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
          const conf = Math.round(obs.reduce((s, o) => s + (o.confidence ?? 0), 0) / obs.length)
          await prisma.materialPriceIndex.upsert({
            where: {
              materialId_regionId_periodStart_granularity: {
                materialId: mat.id,
                regionId: region.id,
                periodStart: start,
                granularity: "daily",
              },
            },
            create: {
              materialId: mat.id,
              regionId: region.id,
              periodStart: start,
              periodEnd: observedAt,
              granularity: "daily",
              currency: obs[0]?.currency ?? "TZS",
              p25,
              median,
              p75,
              mean,
              stddev: Math.sqrt(variance),
              sampleSize: values.length,
              confidence: conf,
            },
            update: {
              periodEnd: observedAt,
              p25,
              median,
              p75,
              mean,
              stddev: Math.sqrt(variance),
              sampleSize: values.length,
              confidence: conf,
            },
          })
        })()
      )
    }
  }
  await runInBatches(indexTasks, 25)

  const counts = {
    regions: await prisma.region.count(),
    categories: await prisma.materialCategoryRef.count(),
    materials: await prisma.material.count(),
    observations: await prisma.priceObservation.count(),
    indices: await prisma.materialPriceIndex.count(),
    benchmarks: await prisma.costBenchmark.count(),
  }
  console.log("\nDone. Row counts:")
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(14)} ${v}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
