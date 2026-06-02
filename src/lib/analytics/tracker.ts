interface Event {
  id: string
  event: string
  entityType?: string
  entityId?: string
  metadata?: Record<string, any>
  timestamp: Date
}

interface AnalyticsSummary {
  totalEvents: number
  uniqueEvents: number
  rfqsSubmitted: number
  supplierSignups: number
  profileViews: number
  leadConversions: number
  eventsByDay: { date: string; count: number }[]
  eventsByType: { event: string; count: number }[]
}

const events: Event[] = []

function generateId(): string {
  return `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function trackEvent(
  event: string,
  data?: { entityType?: string; entityId?: string; metadata?: Record<string, any> }
): void {
  const newEvent: Event = {
    id: generateId(),
    event,
    entityType: data?.entityType,
    entityId: data?.entityId,
    metadata: data?.metadata,
    timestamp: new Date(),
  }
  events.unshift(newEvent)
}

export function getEvents(): Event[] {
  return [...events]
}

export function getEventsByType(event: string): Event[] {
  return events.filter((e) => e.event === event)
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const uniqueEvents = new Set(events.map((e) => e.event)).size
  const rfqsSubmitted = events.filter((e) => e.event === "rfq_submitted").length
  const supplierSignups = events.filter((e) => e.event === "supplier_signup").length
  const profileViews = events.filter((e) => e.event === "profile_view").length
  const leadConversions = events.filter((e) => e.event === "lead_conversion").length

  const daysMap = new Map<string, number>()
  const typeMap = new Map<string, number>()

  for (const e of events) {
    const date = e.timestamp.toISOString().slice(0, 10)
    daysMap.set(date, (daysMap.get(date) || 0) + 1)
    typeMap.set(e.event, (typeMap.get(e.event) || 0) + 1)
  }

  const eventsByDay = Array.from(daysMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, count]) => ({ date, count }))

  const eventsByType = Array.from(typeMap.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([event, count]) => ({ event, count }))

  return {
    totalEvents: events.length,
    uniqueEvents,
    rfqsSubmitted,
    supplierSignups,
    profileViews,
    leadConversions,
    eventsByDay,
    eventsByType,
  }
}
