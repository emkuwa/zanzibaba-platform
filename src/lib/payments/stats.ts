import { prisma } from "@/lib/prisma"

export interface RevenueStats {
  today: number
  thisWeek: number
  thisMonth: number
  allTime: number
  todayChange: number
  weekChange: number
  monthChange: number
  bySource: { plan: string; total: number; count: number; percentage: number }[]
  weekTrend: { day: string; value: number }[]
  recentTransactions: {
    id: string
    date: Date
    customer: string
    plan: string
    amount: number
    currency: string
    status: string
  }[]
}

export interface FounderStats {
  suppliers: number
  contractors: number
  professionals: number
  products: number
  newRegistrations30d: number
  totalUsers: number
  pendingPaymentsValue: number
  totalRevenue: number
  verifiedCount: number
  foundingCount: number
  freeCount: number
}

export interface MembershipRecord {
  id: string
  companyName: string
  userEmail: string
  membershipTier: string
  verificationStatus: string
  verificationBadge: boolean
  isFeatured: boolean
  createdAt: Date
  membershipExpiresAt: Date | null
}

function getDayRange(date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

function getWeekRange(date: Date) {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  const start = new Date(date)
  start.setDate(diff)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

function getMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
  return { start, end }
}

function getPreviousDayRange(date: Date) {
  const prev = new Date(date)
  prev.setDate(prev.getDate() - 1)
  return getDayRange(prev)
}

function getPreviousWeekRange(date: Date) {
  const prev = new Date(date)
  prev.setDate(prev.getDate() - 7)
  return getWeekRange(prev)
}

function getPreviousMonthRange(date: Date) {
  const prev = new Date(date.getFullYear(), date.getMonth() - 1, 1)
  const end = new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59, 999)
  return { start: prev, end }
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export async function getRevenueStats(): Promise<RevenueStats> {
  const now = new Date()

  const todayRange = getDayRange(now)
  const weekRange = getWeekRange(now)
  const monthRange = getMonthRange(now)
  const prevDayRange = getPreviousDayRange(now)
  const prevWeekRange = getPreviousWeekRange(now)
  const prevMonthRange = getPreviousMonthRange(now)

  const [
    todayApproved,
    weekApproved,
    monthApproved,
    allApproved,
    prevDayApproved,
    prevWeekApproved,
    prevMonthApproved,
    bySource,
    allPayments,
  ] = await Promise.all([
    prisma.manualPayment.findMany({
      where: { status: "APPROVED", createdAt: { gte: todayRange.start, lte: todayRange.end } },
    }),
    prisma.manualPayment.findMany({
      where: { status: "APPROVED", createdAt: { gte: weekRange.start, lte: weekRange.end } },
    }),
    prisma.manualPayment.findMany({
      where: { status: "APPROVED", createdAt: { gte: monthRange.start, lte: monthRange.end } },
    }),
    prisma.manualPayment.findMany({
      where: { status: "APPROVED" },
    }),
    prisma.manualPayment.findMany({
      where: { status: "APPROVED", createdAt: { gte: prevDayRange.start, lte: prevDayRange.end } },
    }),
    prisma.manualPayment.findMany({
      where: { status: "APPROVED", createdAt: { gte: prevWeekRange.start, lte: prevWeekRange.end } },
    }),
    prisma.manualPayment.findMany({
      where: { status: "APPROVED", createdAt: { gte: prevMonthRange.start, lte: prevMonthRange.end } },
    }),
    prisma.manualPayment.groupBy({
      by: ["plan"],
      where: { status: "APPROVED" },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.manualPayment.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
  ])

  const sumAmount = (items: { amount: { toNumber: () => number } }[]) =>
    items.reduce((acc, p) => acc + p.amount.toNumber(), 0)

  const todayTotal = sumAmount(todayApproved)
  const weekTotal = sumAmount(weekApproved)
  const monthTotal = sumAmount(monthApproved)
  const allTimeTotal = sumAmount(allApproved)
  const prevDayTotal = sumAmount(prevDayApproved)
  const prevWeekTotal = sumAmount(prevWeekApproved)
  const prevMonthTotal = sumAmount(prevMonthApproved)

  const todayChange = prevDayTotal > 0 ? Math.round(((todayTotal - prevDayTotal) / prevDayTotal) * 100) : 0
  const weekChange = prevWeekTotal > 0 ? Math.round(((weekTotal - prevWeekTotal) / prevWeekTotal) * 100) : 0
  const monthChange = prevMonthTotal > 0 ? Math.round(((monthTotal - prevMonthTotal) / prevMonthTotal) * 100) : 0

  const sourceData = bySource.map((s) => ({
    plan: s.plan,
    total: Number(s._sum.amount) || 0,
    count: s._count.id,
    percentage: allTimeTotal > 0 ? Math.round((Number(s._sum.amount || 0) / allTimeTotal) * 100) : 0,
  }))

  const weekTrend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekRange.start)
    d.setDate(d.getDate() + i)
    const { start, end } = getDayRange(d)
    const dayPayments = weekApproved.filter(
      (p) => p.createdAt >= start && p.createdAt <= end
    )
    return {
      day: DAY_NAMES[d.getDay()],
      value: sumAmount(dayPayments),
    }
  })

  const recentTransactions = allPayments.map((p) => ({
    id: p.id,
    date: p.createdAt,
    customer: p.user.name,
    plan: p.plan,
    amount: p.amount.toNumber(),
    currency: p.currency,
    status: p.status,
  }))

  return {
    today: todayTotal,
    thisWeek: weekTotal,
    thisMonth: monthTotal,
    allTime: allTimeTotal,
    todayChange,
    weekChange,
    monthChange,
    bySource: sourceData,
    weekTrend,
    recentTransactions,
  }
}

export async function getFounderStats(): Promise<FounderStats> {
  const now = new Date()
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    suppliers,
    contractors,
    professionals,
    products,
    totalUsers,
    newUsers30d,
    approvedPayments,
    pendingPayments,
    tierCounts,
  ] = await Promise.all([
    prisma.supplierProfile.count(),
    prisma.contractorProfile.count().catch(() => 0),
    prisma.professionalProfile.count().catch(() => 0),
    prisma.product.count().catch(() => 0),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.manualPayment.aggregate({
      where: { status: "APPROVED" },
      _sum: { amount: true },
    }),
    prisma.manualPayment.aggregate({
      where: { status: "PENDING" },
      _sum: { amount: true },
    }),
    prisma.supplierProfile.groupBy({
      by: ["membershipTier"],
      _count: { id: true },
    }),
  ])

  const totalRevenue = Number(approvedPayments._sum.amount) || 0
  const pendingValue = Number(pendingPayments._sum.amount) || 0

  const getTierCount = (tier: string) =>
    tierCounts.find((t) => t.membershipTier === tier)?._count.id ?? 0

  return {
    suppliers,
    contractors,
    professionals,
    products,
    newRegistrations30d: newUsers30d,
    totalUsers,
    pendingPaymentsValue: pendingValue,
    totalRevenue,
    verifiedCount: getTierCount("VERIFIED"),
    foundingCount: getTierCount("FOUNDING"),
    freeCount: getTierCount("FREE"),
  }
}

export interface ActivityEvent {
  id: string
  action: string
  target: string
  time: Date
  type: string
}

export async function getRecentActivity(limit = 10): Promise<ActivityEvent[]> {
  const [recentUsers, recentSuppliers, recentPayments] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, name: true, createdAt: true },
    }),
    prisma.supplierProfile.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, companyName: true, createdAt: true },
    }),
    prisma.manualPayment.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, plan: true, amount: true, status: true, createdAt: true, user: { select: { name: true } } },
    }),
  ])

  const events: ActivityEvent[] = [
    ...recentSuppliers.map((s) => ({
      id: `supplier-${s.id}`,
      action: "New supplier registered:",
      target: s.companyName,
      time: s.createdAt,
      type: "supplier" as const,
    })),
    ...recentUsers.map((u) => ({
      id: `user-${u.id}`,
      action: "New user registered:",
      target: u.name,
      time: u.createdAt,
      type: "user" as const,
    })),
    ...recentPayments.map((p) => ({
      id: `payment-${p.id}`,
      action: `Payment ${p.status.toLowerCase()}:`,
      target: `${p.plan} — ${p.user.name} (${p.amount})`,
      time: p.createdAt,
      type: "payment" as const,
    })),
  ]

  events.sort((a, b) => b.time.getTime() - a.time.getTime())
  return events.slice(0, limit)
}

export async function getAdminMemberships(): Promise<MembershipRecord[]> {
  const suppliers = await prisma.supplierProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } },
  })
  return suppliers.map((s) => ({
    id: s.id,
    companyName: s.companyName,
    userEmail: s.user.email,
    membershipTier: s.membershipTier,
    verificationStatus: s.verificationStatus,
    verificationBadge: s.verificationBadge,
    isFeatured: s.isFeatured,
    createdAt: s.createdAt,
    membershipExpiresAt: s.membershipExpiresAt,
  }))
}
