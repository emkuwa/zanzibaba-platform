import type { DiscoveredLeadInput } from "./core"

export interface StoredLead extends DiscoveredLeadInput {
  id: string
  score: number
  level: "LOW" | "MEDIUM" | "HIGH"
  checks: { name: string; passed: boolean; score: number; maxScore: number; detail?: string }[]
  agentType: string
  agentRunId: string
  discoveredAt: string
  status: "DISCOVERED" | "VERIFIED" | "REVIEW_PENDING" | "APPROVED" | "REJECTED" | "IMPORTED" | "MERGED"
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  duplicateOf?: string
}

let leads: StoredLead[] = []
let runCounter = 0
let duplicateCount = 0

export function getLeadStore() {
  return leads
}

export function clearLeads() {
  leads = []
  duplicateCount = 0
}

export function incrementDuplicateCount() {
  duplicateCount++
}

export function getDuplicateCountTotal() {
  return duplicateCount
}

export function getLeadsByStatus(status: string): StoredLead[] {
  return leads.filter(l => l.status === status)
}

export function getLeadsByAgent(agentType: string): StoredLead[] {
  return leads.filter(l => l.agentType === agentType)
}

export function getLeadById(id: string): StoredLead | undefined {
  return leads.find(l => l.id === id)
}

export function storeLeads(discovered: DiscoveredLeadInput[], agentType: string): StoredLead[] {
  const runId = `run-${++runCounter}-${Date.now()}`
  const timestamp = new Date().toISOString()

  const stored: StoredLead[] = discovered.map((lead, i) => ({
    ...lead,
    id: `lead-${runCounter}-${i + 1}`,
    score: (lead as any).score || 0,
    level: (lead as any).level || "LOW",
    checks: (lead as any).checks || [],
    agentType,
    agentRunId: runId,
    discoveredAt: timestamp,
    status: "DISCOVERED",
  }))

  leads.push(...stored)
  return stored
}

export function updateLeadVerification(id: string, score: number, level: StoredLead["level"], checks: StoredLead["checks"]): boolean {
  const lead = leads.find(l => l.id === id)
  if (!lead) return false
  lead.score = score
  lead.level = level
  lead.checks = checks
  return true
}

export function updateLeadStatus(id: string, status: StoredLead["status"], notes?: string): boolean {
  const lead = leads.find(l => l.id === id)
  if (!lead) return false
  lead.status = status
  if (notes) lead.reviewNotes = notes
  if (status === "APPROVED" || status === "REJECTED") {
    lead.reviewedAt = new Date().toISOString()
  }
  return true
}

export function getStats() {
  return {
    total: leads.length,
    byStatus: {
      DISCOVERED: leads.filter(l => l.status === "DISCOVERED").length,
      VERIFIED: leads.filter(l => l.status === "VERIFIED").length,
      REVIEW_PENDING: leads.filter(l => l.status === "REVIEW_PENDING").length,
      APPROVED: leads.filter(l => l.status === "APPROVED").length,
      REJECTED: leads.filter(l => l.status === "REJECTED").length,
      IMPORTED: leads.filter(l => l.status === "IMPORTED").length,
    },
    byAgent: {
      supplier: leads.filter(l => l.agentType === "supplier").length,
      contractor: leads.filter(l => l.agentType === "contractor").length,
      professional: leads.filter(l => l.agentType === "professional").length,
      product: leads.filter(l => l.agentType === "product").length,
      project: leads.filter(l => l.agentType === "project").length,
      international: leads.filter(l => l.agentType === "international").length,
    },
    byTrustLevel: {
      HIGH: leads.filter(l => l.level === "HIGH").length,
      MEDIUM: leads.filter(l => l.level === "MEDIUM").length,
      LOW: leads.filter(l => l.level === "LOW").length,
    },
  }
}
