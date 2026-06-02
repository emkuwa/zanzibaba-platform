export interface ChecklistItem {
  id: string
  label: string
  target: number
  current: number
  unit: string
  category: "population" | "activation" | "revenue"
  description: string
}

export interface DailyLog {
  date: string
  entries: Record<string, number>
  note: string
}

export interface LaunchData {
  items: ChecklistItem[]
  dailyLogs: DailyLog[]
  lastUpdated: string
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  {
    id: "suppliers",
    label: "Suppliers Onboarded",
    target: 100,
    current: 0,
    unit: "suppliers",
    category: "population",
    description: "Active supplier profiles with approved listings",
  },
  {
    id: "contractors",
    label: "Contractors Onboarded",
    target: 50,
    current: 0,
    unit: "contractors",
    category: "population",
    description: "Registered contractor profiles",
  },
  {
    id: "architects",
    label: "Architects Onboarded",
    target: 20,
    current: 0,
    unit: "architects",
    category: "population",
    description: "Registered architect professional profiles",
  },
  {
    id: "engineers",
    label: "Engineers Onboarded",
    target: 20,
    current: 0,
    unit: "engineers",
    category: "population",
    description: "Registered engineer professional profiles",
  },
  {
    id: "products",
    label: "Products Uploaded",
    target: 1000,
    current: 0,
    unit: "products",
    category: "activation",
    description: "Active product listings across all suppliers",
  },
  {
    id: "rfqs",
    label: "RFQs Submitted",
    target: 25,
    current: 0,
    unit: "RFQs",
    category: "activation",
    description: "Total RFQs submitted by buyers",
  },
  {
    id: "verified-sold",
    label: "Verified Suppliers Sold",
    target: 10,
    current: 0,
    unit: "suppliers",
    category: "activation",
    description: "Verified suppliers with at least one completed order",
  },
  {
    id: "revenue",
    label: "Revenue Generated",
    target: 1,
    current: 0,
    unit: "paying customer",
    category: "revenue",
    description: "First paying customer (membership/verification/commission)",
  },
]

let data: LaunchData = {
  items: JSON.parse(JSON.stringify(DEFAULT_ITEMS)),
  dailyLogs: [],
  lastUpdated: new Date().toISOString(),
}

export function getLaunchData(): LaunchData {
  return { ...data, items: data.items.map(i => ({ ...i })) }
}

export function getItems(): ChecklistItem[] {
  return data.items.map(i => ({ ...i }))
}

export function getItem(id: string): ChecklistItem | undefined {
  return data.items.find(i => i.id === id)
}

export function updateItem(id: string, current: number): ChecklistItem | undefined {
  const item = data.items.find(i => i.id === id)
  if (!item) return undefined
  item.current = Math.max(0, Math.min(current, item.target))
  data.lastUpdated = new Date().toISOString()
  return { ...item }
}

export function resetAll(): void {
  data.items = JSON.parse(JSON.stringify(DEFAULT_ITEMS))
  data.dailyLogs = []
  data.lastUpdated = new Date().toISOString()
}

export function logDaily(note: string): DailyLog {
  const today = new Date().toISOString().split("T")[0]
  const entries: Record<string, number> = {}
  for (const item of data.items) {
    entries[item.id] = item.current
  }
  const existingIndex = data.dailyLogs.findIndex(l => l.date === today)
  const log: DailyLog = { date: today, entries, note: note || "" }
  if (existingIndex >= 0) {
    data.dailyLogs[existingIndex] = log
  } else {
    data.dailyLogs.push(log)
  }
  data.dailyLogs.sort((a, b) => b.date.localeCompare(a.date))
  return log
}

export function getDailySummary(date?: string): string {
  const today = date || new Date().toISOString().split("T")[0]
  const log = data.dailyLogs.find(l => l.date === today)

  let summary = `=== FOUNDER DAILY SUMMARY — ${today} ===\n\n`

  const completed = data.items.filter(i => i.current >= i.target).length
  const total = data.items.length
  const pct = Math.round((data.items.reduce((s, i) => s + i.current, 0) / data.items.reduce((s, i) => s + i.target, 0)) * 100)

  summary += `Overall Progress: ${pct}% (${completed}/${total} items at target)\n\n`

  for (const item of data.items) {
    const itemPct = Math.round((item.current / item.target) * 100)
    const bar = getProgressBar(itemPct, 20)
    const status = itemPct >= 80 ? "GREEN" : itemPct >= 40 ? "YELLOW" : "RED"
    summary += `  [${status}] ${item.label}: ${item.current}/${item.target} (${itemPct}%)\n`
    summary += `         ${bar}\n`
  }

  if (log) {
    summary += `\nToday's Note: ${log.note || "(none)"}\n`
  }

  const logsToday = data.dailyLogs.filter(l => l.date === today)
  if (logsToday.length > 0 && log) {
    const yesterdayEntries = data.dailyLogs.find(l => {
      const d = new Date(l.date)
      const t = new Date(today)
      d.setDate(d.getDate() - 1)
      return d.toISOString().split("T")[0] === l.date
    })
    if (yesterdayEntries) {
      summary += `\nChanges from yesterday:\n`
      for (const item of data.items) {
        const prev = yesterdayEntries.entries[item.id] || 0
        const diff = item.current - prev
        if (diff !== 0) {
          summary += `  ${item.label}: ${diff > 0 ? "+" : ""}${diff}\n`
        }
      }
    }
  }

  return summary
}

function getProgressBar(pct: number, length: number): string {
  const filled = Math.round((pct / 100) * length)
  const empty = length - filled
  const fillChar = pct >= 80 ? "█" : pct >= 40 ? "▓" : "▒"
  return fillChar.repeat(filled) + "░".repeat(empty) + ` ${pct}%`
}


