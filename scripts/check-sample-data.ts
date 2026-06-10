import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  type Row = { dataClassification: string; cnt: number; with_website: number; high_trust: number; activated: number }
  const rows = await prisma.$queryRawUnsafe<Row[]>(`
    SELECT "dataClassification", COUNT(*)::int as cnt,
       COUNT("website") FILTER (WHERE "website" IS NOT NULL AND "website" != '')::int as with_website,
       COUNT(*) FILTER (WHERE "trustScore" >= 70)::int as high_trust,
       COUNT(*) FILTER (WHERE "activationStatus" IN ('CLAIMED','VERIFIED','FEATURED'))::int as activated
    FROM "DiscoveredLead"
    GROUP BY "dataClassification"
    ORDER BY cnt DESC
  `)
  console.log("=== Data classification distribution ===")
  console.table(rows)

  type Sample = { companyName: string; website: string; country: string; categorySlug: string; trustScore: number; dataClassification: string }
  const samples = await prisma.$queryRawUnsafe<Sample[]>(`
    SELECT "companyName", "website", "country", "categorySlug", "trustScore", "dataClassification"
    FROM "DiscoveredLead"
    WHERE "website" IS NOT NULL AND "website" != ''
      AND "dataClassification" IN ('STRATEGIC_VERIFIED','DISCOVERED_VERIFIED')
    ORDER BY "trustScore" DESC
    LIMIT 15
  `)
  console.log("\n=== Top 15 leads with websites ===")
  console.table(samples)
}
main().catch(console.error).finally(() => prisma.$disconnect())
