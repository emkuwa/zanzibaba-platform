import { ensureAcquisitionAgent, createRun, completeRun, updateRunLog, storeDiscoveredLeads, markLeadsOutreach } from "./prisma-store"
import { runDiscovery } from "./discovery-agent"
import { enrichLeads } from "./enrichment-agent"
import { buildProfiles } from "./profile-builder"
import { extractProducts } from "./product-builder"
import { reviewLeads } from "./review-queue"
import { generateOutreach } from "./outreach-agent"
import type { AcquisitionRunResult } from "./types"

export async function runAcquisitionPipeline(): Promise<AcquisitionRunResult> {
  const startedAt = new Date()
  const startTime = Date.now()

  const agentId = await ensureAcquisitionAgent()
  const runId = await createRun(agentId)

  const result: AcquisitionRunResult = {
    runId, agentId, status: "running",
    stages: {
      discovery: { status: "pending", found: 0 },
      enrichment: { status: "pending", enriched: 0 },
      profileBuilder: { status: "pending", profilesBuilt: 0 },
      productBuilder: { status: "pending", productsExtracted: 0 },
      review: { status: "pending", inReview: 0 },
      outreach: { status: "pending", messagesGenerated: 0 },
    },
    startedAt: startedAt.toISOString(),
    duration: 0,
  }

  try {
    await updateRunLog(runId, "=== DISCOVERY STAGE ===")
    const discovery = await runDiscovery(runId)
    const ds = discovery.stats
    result.stages.discovery = {
      status: "completed", found: ds.found,
      darSuppliers: ds.darSuppliers,
      zanzibarContractors: ds.zanzibarContractors,
      zanzibarProfessionals: ds.zanzibarProfessionals,
      internationalPartners: ds.internationalPartners,
    }
    await updateRunLog(runId, `Found ${ds.found} total: ${ds.darSuppliers} Dar suppliers, ${ds.zanzibarContractors} Zanzibar contractors, ${ds.zanzibarProfessionals} Zanzibar professionals, ${ds.internationalPartners} international partners (${ds.fromGoogleMaps} from Google Maps, ${ds.fromDirectories} from directories)`)

    await storeDiscoveredLeads(discovery.leads, agentId, runId)
    await updateRunLog(runId, `Stored ${ds.found} leads to database`)

    await updateRunLog(runId, "=== ENRICHMENT STAGE ===")
    const enrichment = await enrichLeads(discovery.leads, runId)
    result.stages.enrichment = { status: "completed", enriched: enrichment.enriched }
    await updateRunLog(runId, `Enriched ${enrichment.enriched} leads`)
    await storeDiscoveredLeads(enrichment.leads, agentId, runId)

    await updateRunLog(runId, "=== PROFILE BUILDER STAGE ===")
    const profiles = await buildProfiles(enrichment.leads, runId)
    result.stages.profileBuilder = { status: "completed", profilesBuilt: profiles.profilesBuilt, claimReady: profiles.claimReady }
    await updateRunLog(runId, `Generated ${profiles.profilesBuilt} profiles (${profiles.claimReady} claim-ready)`)
    await storeDiscoveredLeads(profiles.leads, agentId, runId)

    await updateRunLog(runId, "=== PRODUCT EXTRACTION STAGE ===")
    const products = await extractProducts(profiles.leads)
    result.stages.productBuilder = { status: "completed", productsExtracted: products.productsExtracted }
    await updateRunLog(runId, `Extracted ${products.productsExtracted} products`)
    await storeDiscoveredLeads(products.leads, agentId, runId)

    await updateRunLog(runId, "=== REVIEW STAGE ===")
    const review = await reviewLeads(products.leads, runId)
    result.stages.review = { status: "completed", inReview: review.inReview, approved: review.decisions.approved, rejected: review.decisions.rejected }
    await updateRunLog(runId, `Review: ${review.decisions.approved} approved, ${review.decisions.rejected} rejected, ${review.decisions.flagged} flagged`)
    await storeDiscoveredLeads(review.leads, agentId, runId)

    await updateRunLog(runId, "=== OUTREACH STAGE ===")
    const outreach = await generateOutreach(review.leads)
    result.stages.outreach = { status: "completed", messagesGenerated: outreach.messagesGenerated }
    await updateRunLog(runId, `Generated ${outreach.messagesGenerated} outreach message sets`)

    if (outreach.messagesGenerated > 0) {
      const prepared = await markLeadsOutreach(runId)
      await updateRunLog(runId, `Marked ${prepared} leads ready for outreach (claim-ready profiles prepared)`)
    }

    const duration = Math.round((Date.now() - startTime) / 1000)
    result.status = "completed"
    result.completedAt = new Date().toISOString()
    result.duration = duration

    await updateRunLog(runId, `Pipeline completed in ${duration}s`)
    await completeRun(runId, ds.found, review.decisions.approved + review.decisions.flagged, `Pipeline completed in ${duration}s`)

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : `${error}`
    result.status = "failed"
    ;(["discovery", "enrichment", "profileBuilder", "productBuilder", "review", "outreach"] as const).forEach((name) => {
      const s = result.stages[name] as any
      if (s.status === "pending") { s.status = "failed"; s.errors = errorMsg }
    })
    const duration = Math.round((Date.now() - startTime) / 1000)
    result.duration = duration
    await updateRunLog(runId, `Pipeline failed: ${errorMsg}`)
    await completeRun(runId, 0, 0, `Pipeline failed: ${errorMsg}`, errorMsg)
  }

  return result
}
