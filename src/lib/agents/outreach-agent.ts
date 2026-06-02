import { generateOutreachMessages, type DiscoveredLeadInput, type OutreachMessage } from "./core"

interface OutreachResult {
  leadId: string
  leadName: string
  messages: OutreachMessage[]
  approved: boolean
}

const outreachStore: OutreachResult[] = []

export function getOutreachStore() {
  return outreachStore
}

export function generateOutreachForLead(lead: DiscoveredLeadInput, leadId: string): OutreachResult {
  const existing = outreachStore.find(o => o.leadId === leadId)
  if (existing) return existing

  const messages = generateOutreachMessages(lead)
  const result: OutreachResult = {
    leadId,
    leadName: lead.companyName || lead.contactName || "Unknown",
    messages,
    approved: false,
  }
  outreachStore.push(result)
  return result
}

export function approveOutreach(leadId: string): boolean {
  const entry = outreachStore.find(o => o.leadId === leadId)
  if (entry) {
    entry.approved = true
    return true
  }
  return false
}

export function rejectOutreach(leadId: string): boolean {
  const entry = outreachStore.find(o => o.leadId === leadId)
  if (entry) {
    outreachStore.splice(outreachStore.indexOf(entry), 1)
    return true
  }
  return false
}
