import { NextRequest, NextResponse } from "next/server"
import { discoverSuppliers } from "@/lib/agents/supplier-agent"
import { discoverContractors } from "@/lib/agents/contractor-agent"
import { discoverProducts } from "@/lib/agents/product-agent"
import { discoverProjects } from "@/lib/agents/project-agent"
import { discoverInternational } from "@/lib/agents/international-agent"
import { storeLeads, getLeadStore, updateLeadStatus, updateLeadVerification, getLeadById, getStats, clearLeads } from "@/lib/agents/lead-store"
import { verifyLead } from "@/lib/agents/verification-agent"
import { generateOutreachForLead, approveOutreach } from "@/lib/agents/outreach-agent"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, agentType, leadId, status, notes } = body

    switch (action) {
      case "run-agent": {
        if (!agentType) {
          return NextResponse.json({ error: "agentType required" }, { status: 400 })
        }

        let discovered
        switch (agentType) {
          case "supplier":
            discovered = await discoverSuppliers()
            break
          case "contractor":
            discovered = await discoverContractors()
            break
          case "product":
            discovered = await discoverProducts()
            break
          case "project":
            discovered = await discoverProjects()
            break
          case "international":
            discovered = await discoverInternational()
            break
          default:
            return NextResponse.json({ error: `Unknown agent type: ${agentType}` }, { status: 400 })
        }

        const stored = storeLeads(discovered, agentType)
        const verified = stored.map(lead => {
          const result = verifyLead(lead)
          updateLeadVerification(lead.id, result.score, result.level, result.checks)
          return { ...lead, score: result.score, level: result.level, checks: result.checks }
        })

        return NextResponse.json({ leads: verified, count: verified.length, agentType })
      }

      case "run-all": {
        const results = []
        for (const type of ["supplier", "contractor", "product", "project", "international"]) {
          let discovered: Awaited<ReturnType<typeof discoverSuppliers>> = []
          switch (type) {
            case "supplier": discovered = await discoverSuppliers(); break
            case "contractor": discovered = await discoverContractors(); break
            case "product": discovered = await discoverProducts(); break
            case "project": discovered = await discoverProjects(); break
            case "international": discovered = await discoverInternational(); break
          }
          const stored = storeLeads(discovered, type)
          const verified = stored.map(lead => {
            const result = verifyLead(lead)
            updateLeadVerification(lead.id, result.score, result.level, result.checks)
            return { ...lead, score: result.score, level: result.level, checks: result.checks }
          })
          results.push({ agentType: type, count: verified.length })
        }
        return NextResponse.json({ results, total: results.reduce((a, r) => a + r.count, 0) })
      }

      case "update-status": {
        if (!leadId || !status) {
          return NextResponse.json({ error: "leadId and status required" }, { status: 400 })
        }
        const validStatuses = ["APPROVED", "REJECTED", "REVIEW_PENDING", "IMPORTED", "MERGED"]
        if (!validStatuses.includes(status)) {
          return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 })
        }
        const success = updateLeadStatus(leadId, status as any, notes)
        if (!success) {
          return NextResponse.json({ error: "Lead not found" }, { status: 404 })
        }
        if (status === "APPROVED") {
          const lead = getLeadById(leadId)
          if (lead) {
            generateOutreachForLead(lead, leadId)
            approveOutreach(leadId)
          }
        }
        return NextResponse.json({ success, lead: getLeadById(leadId) })
      }

      case "clear": {
        clearLeads()
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Agent operation failed" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    stats: getStats(),
    leads: getLeadStore(),
  })
}
