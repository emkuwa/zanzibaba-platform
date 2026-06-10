import { prisma } from "@/lib/prisma"

export interface DailyCount {
  date: string
  count: number
}

export interface SourceBreakdown {
  source: string
  count: number
}

export interface DiscoveryStats {
  today: number
  thisWeek: number
  approved: number
  rejected: number
  duplicates: number
  totalDiscovered: number
  avgTrustScore: number
  bySource: SourceBreakdown[]
  trends: DailyCount[]
  dailyReports: DailyReport[]
}

export interface DailyReport {
  date: string
  discovered: number
  approved: number
  rejected: number
  avgScore: number
  bySource: { source: string; count: number }[]
}

function normalizeSource(source?: string): string {
  if (!source) return "Unknown"
  const s = source.toLowerCase()
  if (s.includes("google") || s.includes("maps")) return "Google Maps"
  if (s.includes("trade") || s.includes("directory")) return "Trade Directories"
  if (s.includes("portal") || s.includes("construction") || s.includes("website") || s.includes("v2")) return "Company Websites"
  if (s.includes("manual") || s.includes("import") || s.includes("csv")) return "Manual Import"
  if (s.includes("strategic")) return "Strategic Discovery"
  return source
}

function getDateString(d: Date): string {
  return d.toISOString().split("T")[0]
}

function isToday(date: Date): boolean {
  const now = new Date()
  return date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
}

function isThisWeek(date: Date): boolean {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  return date >= startOfWeek
}

export async function computeDiscoveryStats(): Promise<DiscoveryStats> {
  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(todayStart)
  todayEnd.setDate(todayEnd.getDate() + 1)

  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const fourteenDaysAgo = new Date(now)
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13)
  fourteenDaysAgo.setHours(0, 0, 0, 0)

  const allLeads = await prisma.discoveredLead.findMany({
    where: { leadType: "supplier" },
    orderBy: { createdAt: "asc" },
    select: {
      createdAt: true,
      sourcePlatform: true,
      trustScore: true,
      status: true,
    },
  })

  let todayCount = 0
  let weekCount = 0
  let approvedCount = 0
  let rejectedCount = 0
  let totalScore = 0
  let scoredLeads = 0
  const sourceMap = new Map<string, number>()
  const dayMap = new Map<string, number>()
  const daySourceMap = new Map<string, Map<string, number>>()
  const dayApprovedMap = new Map<string, number>()
  const dayRejectedMap = new Map<string, number>()
  const dayScoreMap = new Map<string, number[]>()

  for (const lead of allLeads) {
    const date = getDateString(lead.createdAt)
    const source = normalizeSource(lead.sourcePlatform || undefined)

    if (isToday(lead.createdAt)) todayCount++
    if (isThisWeek(lead.createdAt)) weekCount++
    if (lead.status === "APPROVED" || lead.status === "IMPORTED") approvedCount++
    if (lead.status === "REJECTED") rejectedCount++

    sourceMap.set(source, (sourceMap.get(source) || 0) + 1)

    dayMap.set(date, (dayMap.get(date) || 0) + 1)

    if (!daySourceMap.has(date)) daySourceMap.set(date, new Map())
    const sm = daySourceMap.get(date)!
    sm.set(source, (sm.get(source) || 0) + 1)

    if (lead.status === "APPROVED" || lead.status === "IMPORTED") dayApprovedMap.set(date, (dayApprovedMap.get(date) || 0) + 1)
    if (lead.status === "REJECTED") dayRejectedMap.set(date, (dayRejectedMap.get(date) || 0) + 1)

    if (lead.trustScore > 0) {
      totalScore += lead.trustScore
      scoredLeads++
      if (!dayScoreMap.has(date)) dayScoreMap.set(date, [])
      dayScoreMap.get(date)!.push(lead.trustScore)
    }
  }

  const trends: DailyCount[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = getDateString(d)
    trends.push({ date: dateStr, count: dayMap.get(dateStr) || 0 })
  }

  const bySource: SourceBreakdown[] = Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)

  const dailyReports: DailyReport[] = Array.from(dayMap.entries())
    .map(([date]) => {
      const scores = dayScoreMap.get(date) || []
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
      const sm = daySourceMap.get(date) || new Map()
      return {
        date,
        discovered: dayMap.get(date) || 0,
        approved: dayApprovedMap.get(date) || 0,
        rejected: dayRejectedMap.get(date) || 0,
        avgScore,
        bySource: Array.from(sm.entries()).map(([s, c]) => ({ source: s, count: c })),
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  const duplicates = await prisma.discoveredLead.count({
    where: { status: "MERGED" },
  })

  return {
    today: todayCount,
    thisWeek: weekCount,
    approved: approvedCount,
    rejected: rejectedCount,
    duplicates,
    totalDiscovered: allLeads.length,
    avgTrustScore: scoredLeads > 0 ? Math.round(totalScore / scoredLeads) : 0,
    bySource,
    trends,
    dailyReports,
  }
}

export function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    "Google Maps": "#10b981",
    "Company Websites": "#3b82f6",
    "Trade Directories": "#f59e0b",
    "Manual Import": "#8b5cf6",
    "Strategic Discovery": "#f97316",
    Unknown: "#9ca3af",
  }
  return colors[source] || "#9ca3af"
}
