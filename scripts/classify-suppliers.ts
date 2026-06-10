import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("=== CLASSIFYING SUPPLIER DATA ===\n")

  // --- CLASSIFY DISCOVEREDLEADS ---
  console.log("--- DiscoveredLead ---")
  const allLeads = await prisma.discoveredLead.findMany({
    select: { id: true, companyName: true, website: true, trustLevel: true, trustScore: true, activationStatus: true },
  })
  console.log(`Total leads: ${allLeads.length}`)

  const batches = { STRATEGIC_VERIFIED: [] as string[], DISCOVERED_VERIFIED: [] as string[], CLAIMED: [] as string[], TEST: [] as string[], SYNTHETIC: [] as string[] }

  for (const lead of allLeads) {
    const name = (lead.companyName || "").toLowerCase()
    if (name.includes("test") || name.includes("demo")) {
      batches.TEST.push(lead.id)
    } else if (lead.activationStatus === "CLAIMED" || lead.activationStatus === "VERIFIED" || lead.activationStatus === "FEATURED") {
      batches.CLAIMED.push(lead.id)
    } else if (lead.website && lead.trustLevel === "HIGH") {
      batches.STRATEGIC_VERIFIED.push(lead.id)
    } else if (lead.website || lead.trustLevel === "MEDIUM" || lead.trustLevel === "HIGH") {
      batches.DISCOVERED_VERIFIED.push(lead.id)
    } else {
      batches.SYNTHETIC.push(lead.id)
    }
  }

  for (const [classification, ids] of Object.entries(batches)) {
    if (ids.length === 0) continue
    await prisma.discoveredLead.updateMany({
      where: { id: { in: ids } },
      data: { dataClassification: classification as any },
    })
    console.log(`  ${classification}: ${ids.length}`)
  }

  const realDiscovered = batches.STRATEGIC_VERIFIED.length + batches.DISCOVERED_VERIFIED.length + batches.CLAIMED.length

  // --- CLASSIFY DIRECTORYENTITIES ---
  console.log("\n--- DirectoryEntity ---")
  const allEntities = await prisma.directoryEntity.findMany({
    select: { id: true, name: true, website: true, activationStatus: true, discoveredLeadId: true },
  })
  console.log(`Total entities: ${allEntities.length}`)

  const entityBatches = { STRATEGIC_VERIFIED: [] as string[], DISCOVERED_VERIFIED: [] as string[], CLAIMED: [] as string[], TEST: [] as string[], SYNTHETIC: [] as string[] }

  for (const entity of allEntities) {
    const name = (entity.name || "").toLowerCase()
    if (name.includes("test") || name.includes("demo")) {
      entityBatches.TEST.push(entity.id)
    } else if (entity.activationStatus === "CLAIMED" || entity.activationStatus === "VERIFIED" || entity.activationStatus === "FEATURED") {
      entityBatches.CLAIMED.push(entity.id)
    } else if (entity.website) {
      entityBatches.STRATEGIC_VERIFIED.push(entity.id)
    } else if (entity.discoveredLeadId) {
      entityBatches.DISCOVERED_VERIFIED.push(entity.id)
    } else {
      entityBatches.SYNTHETIC.push(entity.id)
    }
  }

  for (const [classification, ids] of Object.entries(entityBatches)) {
    if (ids.length === 0) continue
    await prisma.directoryEntity.updateMany({
      where: { id: { in: ids } },
      data: { dataClassification: classification as any },
    })
    console.log(`  ${classification}: ${ids.length}`)
  }

  // --- CLASSIFY SUPPLIERPROFILES ---
  console.log("\n--- SupplierProfile ---")
  const allSuppliers = await prisma.supplierProfile.findMany({
    select: { id: true, companyName: true, website: true, verificationStatus: true },
  })
  console.log(`Total suppliers: ${allSuppliers.length}`)

  const supBatches = { STRATEGIC_VERIFIED: [] as string[], DISCOVERED_VERIFIED: [] as string[], CLAIMED: [] as string[], TEST: [] as string[], SYNTHETIC: [] as string[] }

  for (const sup of allSuppliers) {
    const name = (sup.companyName || "").toLowerCase()
    if (name.includes("test") || name.includes("demo")) {
      supBatches.TEST.push(sup.id)
    } else if (sup.verificationStatus === "VERIFIED") {
      supBatches.STRATEGIC_VERIFIED.push(sup.id)
    } else if (sup.website) {
      supBatches.DISCOVERED_VERIFIED.push(sup.id)
    } else {
      supBatches.SYNTHETIC.push(sup.id)
    }
  }

  for (const [classification, ids] of Object.entries(supBatches)) {
    if (ids.length === 0) continue
    await prisma.supplierProfile.updateMany({
      where: { id: { in: ids } },
      data: { dataClassification: classification as any },
    })
    console.log(`  ${classification}: ${ids.length}`)
  }

  // --- VERIFICATION ---
  const leadCounts = await prisma.discoveredLead.groupBy({ by: ["dataClassification"], _count: true })
  console.log("\n=== VERIFICATION: DiscoveredLead ===")
  leadCounts.forEach(c => console.log(`  ${c.dataClassification}: ${c._count}`))

  const entityCounts = await prisma.directoryEntity.groupBy({ by: ["dataClassification"], _count: true })
  console.log("\n=== VERIFICATION: DirectoryEntity ===")
  entityCounts.forEach(c => console.log(`  ${c.dataClassification}: ${c._count}`))

  const supCounts = await prisma.supplierProfile.groupBy({ by: ["dataClassification"], _count: true })
  console.log("\n=== VERIFICATION: SupplierProfile ===")
  supCounts.forEach(c => console.log(`  ${c.dataClassification}: ${c._count}`))

  console.log("\n=== DONE ===")
}

main().catch(console.error).finally(() => prisma.$disconnect())
