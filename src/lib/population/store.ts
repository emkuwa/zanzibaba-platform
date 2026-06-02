export interface PopulationTarget {
  type: string
  label: string
  target: number
  current: number
  dailyRate: number
  startDate: Date
}

export interface PopulationEvent {
  id: string
  type: string
  entityName: string
  source: "csv-import" | "manual-seed" | "self-registration" | "admin-create"
  createdAt: Date
}

const defaultTargets: PopulationTarget[] = [
  { type: "suppliers", label: "Suppliers", target: 100, current: 47, dailyRate: 3.2, startDate: new Date("2025-01-01") },
  { type: "contractors", label: "Contractors", target: 50, current: 23, dailyRate: 1.5, startDate: new Date("2025-01-01") },
  { type: "architects", label: "Architects", target: 20, current: 7, dailyRate: 0.8, startDate: new Date("2025-01-15") },
  { type: "engineers", label: "Engineers", target: 20, current: 5, dailyRate: 0.7, startDate: new Date("2025-01-15") },
  { type: "products", label: "Products", target: 1000, current: 340, dailyRate: 12.5, startDate: new Date("2025-01-01") },
  { type: "verified-members", label: "Verified Members", target: 50, current: 18, dailyRate: 1.2, startDate: new Date("2025-02-01") },
]

const sampleEvents: PopulationEvent[] = [
  { id: "1", type: "supplier", entityName: "Zanzibar Cement Works Ltd", source: "self-registration", createdAt: new Date("2025-06-01T10:30:00") },
  { id: "2", type: "supplier", entityName: "Pemba Timber & Hardware", source: "csv-import", createdAt: new Date("2025-05-28T14:00:00") },
  { id: "3", type: "contractor", entityName: "Mwana Builders", source: "self-registration", createdAt: new Date("2025-05-27T09:15:00") },
  { id: "4", type: "architect", entityName: "Fatima Hassan", source: "admin-create", createdAt: new Date("2025-05-25T11:00:00") },
  { id: "5", type: "supplier", entityName: "Dar Steel Corporation", source: "admin-create", createdAt: new Date("2025-05-25T10:00:00") },
  { id: "6", type: "engineer", entityName: "James Mwangi", source: "self-registration", createdAt: new Date("2025-05-24T16:45:00") },
  { id: "7", type: "contractor", entityName: "Stone Town Construction", source: "manual-seed", createdAt: new Date("2025-05-22T08:30:00") },
  { id: "8", type: "supplier", entityName: "Mwanza Construction Materials", source: "manual-seed", createdAt: new Date("2025-05-19T13:00:00") },
  { id: "9", type: "architect", entityName: "Amara Mwinyi", source: "self-registration", createdAt: new Date("2025-05-18T10:00:00") },
  { id: "10", type: "engineer", entityName: "Kevin Ochieng", source: "admin-create", createdAt: new Date("2025-05-16T15:00:00") },
]

let targets = [...defaultTargets]
let events = [...sampleEvents]

export function getPopulationTargets(): PopulationTarget[] {
  return targets
}

export function getPopulationEvents(limit?: number): PopulationEvent[] {
  const sorted = [...events].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  return limit ? sorted.slice(0, limit) : sorted
}

export function incrementPopulation(type: string, count = 1): void {
  const target = targets.find((t) => t.type === type)
  if (target) {
    target.current = Math.min(target.current + count, target.target)
  }
}

export function getPopulationProgress(): { type: string; percentage: number; remaining: number; estCompletion: string }[] {
  return targets.map((t) => {
    const percentage = Math.round((t.current / t.target) * 100)
    const remaining = t.target - t.current
    const daysToComplete = remaining > 0 && t.dailyRate > 0 ? Math.ceil(remaining / t.dailyRate) : 0
    const estDate = new Date()
    estDate.setDate(estDate.getDate() + daysToComplete)
    const estCompletion = daysToComplete > 0
      ? estDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "Complete"
    return { type: t.type, percentage, remaining, estCompletion }
  })
}

export function getPopulationSummary(): string {
  const suppliers = targets.find((t) => t.type === "suppliers")
  const contractors = targets.find((t) => t.type === "contractors")
  const professionals = targets.find((t) => t.type === "architects" || t.type === "engineers")
  const arch = targets.find((t) => t.type === "architects")
  const eng = targets.find((t) => t.type === "engineers")
  const proTotal = (arch?.current || 0) + (eng?.current || 0)
  const proTarget = (arch?.target || 0) + (eng?.target || 0)
  return `${suppliers?.current || 0}/${suppliers?.target || 0} suppliers, ${contractors?.current || 0}/${contractors?.target || 0} contractors, ${proTotal}/${proTarget} professionals`
}

export function addPopulationEvent(event: Omit<PopulationEvent, "id" | "createdAt">): PopulationEvent {
  const newEvent: PopulationEvent = {
    ...event,
    id: String(events.length + 1),
    createdAt: new Date(),
  }
  events.unshift(newEvent)
  return newEvent
}
