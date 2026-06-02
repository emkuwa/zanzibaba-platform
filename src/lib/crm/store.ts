export interface CRMLead {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  type: 'supplier' | 'contractor' | 'professional' | 'buyer'
  source: 'website' | 'referral' | 'direct-outreach' | 'whatsapp' | 'email-campaign' | 'trade-show' | 'google-ads' | 'facebook-ads'
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'converted' | 'lost'
  assignedTo: string
  categoryInterest?: string
  estimatedValue: number
  notes: string
  followUpDate?: Date
  followUpHistory: { date: Date; action: string; staff: string; notes: string }[]
  createdAt: Date
  updatedAt: Date
}

let leads: CRMLead[] = []

function generateId(): string {
  return `CRM-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export function addLead(lead: Omit<CRMLead, 'id' | 'createdAt' | 'updatedAt' | 'followUpHistory'>): CRMLead {
  const newLead: CRMLead = {
    ...lead,
    id: generateId(),
    followUpHistory: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  leads.unshift(newLead)
  return newLead
}

export function getLeads(filters?: { status?: string; type?: string; assignedTo?: string; source?: string }): CRMLead[] {
  if (!filters) return [...leads]
  return leads.filter((l) => {
    if (filters.status && filters.status !== 'all' && l.status !== filters.status) return false
    if (filters.type && filters.type !== 'all' && l.type !== filters.type) return false
    if (filters.assignedTo && filters.assignedTo !== 'all' && l.assignedTo !== filters.assignedTo) return false
    if (filters.source && filters.source !== 'all' && l.source !== filters.source) return false
    return true
  })
}

export function getLead(id: string): CRMLead | undefined {
  return leads.find((l) => l.id === id)
}

export function updateLeadStatus(id: string, status: string, staff: string, notes: string): CRMLead {
  const lead = leads.find((l) => l.id === id)
  if (!lead) throw new Error(`Lead ${id} not found`)
  lead.status = status as CRMLead['status']
  lead.updatedAt = new Date()
  lead.followUpHistory.push({
    date: new Date(),
    action: `Status changed to ${status}`,
    staff,
    notes,
  })
  return lead
}

export function addFollowUp(id: string, action: string, staff: string, notes: string): CRMLead {
  const lead = leads.find((l) => l.id === id)
  if (!lead) throw new Error(`Lead ${id} not found`)
  lead.followUpHistory.push({ date: new Date(), action, staff, notes })
  lead.updatedAt = new Date()
  return lead
}

export function getLeadsByStaff(staff: string): CRMLead[] {
  return leads.filter((l) => l.assignedTo === staff)
}

export function getCRMStats() {
  const total = leads.length
  const byStatus: Record<string, number> = {}
  const byType: Record<string, number> = {}
  const bySource: Record<string, number> = {}
  let totalValue = 0

  for (const l of leads) {
    byStatus[l.status] = (byStatus[l.status] || 0) + 1
    byType[l.type] = (byType[l.type] || 0) + 1
    bySource[l.source] = (bySource[l.source] || 0) + 1
    totalValue += l.estimatedValue
  }

  return { total, byStatus, byType, bySource, totalValue }
}

export function exportCRMCSV(): string {
  const headers = [
    'ID', 'Company Name', 'Contact Name', 'Email', 'Phone',
    'Type', 'Source', 'Status', 'Assigned To', 'Category Interest',
    'Estimated Value', 'Notes', 'Follow Up Date', 'Created At', 'Updated At',
  ]
  const rows = leads.map((l) =>
    [
      l.id,
      `"${l.companyName.replace(/"/g, '""')}"`,
      `"${l.contactName.replace(/"/g, '""')}"`,
      l.email,
      l.phone,
      l.type,
      l.source,
      l.status,
      l.assignedTo,
      l.categoryInterest || '',
      l.estimatedValue.toString(),
      `"${l.notes.replace(/"/g, '""')}"`,
      l.followUpDate ? l.followUpDate.toISOString() : '',
      l.createdAt.toISOString(),
      l.updatedAt.toISOString(),
    ].join(','),
  )
  return [headers.join(','), ...rows].join('\n')
}

export function updateLead(id: string, updates: Partial<CRMLead>): CRMLead {
  const lead = leads.find((l) => l.id === id)
  if (!lead) throw new Error(`Lead ${id} not found`)
  Object.assign(lead, updates, { updatedAt: new Date() })
  return lead
}

export function getStaffList(): string[] {
  const staff = new Set(leads.map((l) => l.assignedTo).filter(Boolean))
  return Array.from(staff)
}
