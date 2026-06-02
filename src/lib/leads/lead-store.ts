interface Lead {
  id: string
  type: "rfq" | "contact" | "supplier-inquiry" | "quote-request"
  source: string
  data: Record<string, any>
  contact: { name?: string; email?: string; phone?: string }
  createdAt: Date
}

const leads: Lead[] = []

function generateId(): string {
  return `LEAD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function addLead(lead: Omit<Lead, "id" | "createdAt">): Lead {
  const newLead: Lead = {
    ...lead,
    id: generateId(),
    createdAt: new Date(),
  }
  leads.unshift(newLead)
  return newLead
}

export function getLeads(): Lead[] {
  return [...leads]
}

export function getLeadsByType(type: string): Lead[] {
  return leads.filter((l) => l.type === type)
}

export function getLeadsCount(): number {
  return leads.length
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportLeadsCSV(): string {
  const headers = ["ID", "Type", "Source", "Contact Name", "Contact Email", "Contact Phone", "Data", "Created At"]
  const rows = leads.map((l) =>
    [
      l.id,
      l.type,
      l.source,
      l.contact.name || "",
      l.contact.email || "",
      l.contact.phone || "",
      JSON.stringify(l.data),
      l.createdAt.toISOString(),
    ]
      .map(escapeCSV)
      .join(",")
  )
  return [headers.join(","), ...rows].join("\n")
}
