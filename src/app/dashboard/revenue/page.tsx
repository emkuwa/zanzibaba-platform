import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getRevenueStats } from "@/lib/payments/stats"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Star,
  Megaphone,
  Users,
  Calendar,
  BarChart3,
  ArrowUpRight,
  Receipt,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount)
}

const SOURCE_CONFIG: Record<string, { label: string; icon: typeof ShieldCheck; color: string; barColor: string }> = {
  VERIFIED: { label: "Verification", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50", barColor: "bg-emerald-500" },
  FOUNDING: { label: "Founding Memberships", icon: Star, color: "text-gold-600 bg-gold-50", barColor: "bg-gold-500" },
  FREE: { label: "Free", icon: Users, color: "text-purple-600 bg-purple-50", barColor: "bg-purple-500" },
  BASIC: { label: "Basic", icon: Users, color: "text-blue-600 bg-blue-50", barColor: "bg-blue-500" },
  PROFESSIONAL: { label: "Professional", icon: Users, color: "text-blue-600 bg-blue-50", barColor: "bg-blue-500" },
  ENTERPRISE: { label: "Enterprise", icon: Megaphone, color: "text-blue-600 bg-blue-50", barColor: "bg-blue-500" },
}

function ChangeBadge({ change }: { change: number }) {
  if (change === 0) return null
  const isUp = change > 0
  return (
    <span className={cn("mt-1 inline-flex items-center gap-0.5 text-xs font-medium", isUp ? "text-green-600" : "text-red-600")}>
      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {isUp ? "+" : ""}{change}% vs last period
    </span>
  )
}

export default async function RevenueActivationDashboard() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  const stats = await getRevenueStats()
  const maxWeekValue = Math.max(...stats.weekTrend.map((d) => d.value), 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Revenue Activation Dashboard</h1>
            <Badge variant="outline" className="text-xs font-normal">Financials</Badge>
          </div>
          <p className="text-sm text-gray-500">Real-time revenue data from approved payments</p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Quick Summary</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Today</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(stats.today)}</p>
                  <ChangeBadge change={stats.todayChange} />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">This Week</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(stats.thisWeek)}</p>
                  <ChangeBadge change={stats.weekChange} />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">This Month</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(stats.thisMonth)}</p>
                  <ChangeBadge change={stats.monthChange} />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50 text-zanzibar-600">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Revenue by Source</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.bySource.length === 0 ? (
            <p className="col-span-full text-sm text-gray-400 py-4">No approved payments yet.</p>
          ) : (
            stats.bySource.map((source) => {
              const config = SOURCE_CONFIG[source.plan] || { label: source.plan, icon: DollarSign, color: "text-gray-600 bg-gray-50", barColor: "bg-gray-500" }
              const Icon = config.icon
              return (
                <Card key={source.plan}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", config.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="mt-3 text-sm font-medium text-gray-500">{config.label}</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(source.total)}</p>
                        <div className="mt-2">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div className={cn("h-full rounded-full", config.barColor)} style={{ width: `${source.percentage}%` }} />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">{source.percentage}% of total ({source.count} payment{source.count !== 1 ? "s" : ""})</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Revenue Trend — Last 7 Days</h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-end justify-between gap-2" style={{ height: 160 }}>
              {stats.weekTrend.map((d) => {
                const heightPct = maxWeekValue > 0 ? (d.value / maxWeekValue) * 100 : 0
                return (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-xs font-medium text-gray-700">{formatCurrency(d.value)}</span>
                    <div
                      className="w-full rounded-md bg-gradient-to-t from-zanzibar-600 to-zanzibar-400 transition-all"
                      style={{ height: `${heightPct}%`, minHeight: d.value > 0 ? 16 : 4 }}
                    />
                    <span className="text-xs text-gray-500">{d.day}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Revenue Forecast</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-gray-500">Current MRR</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(stats.thisMonth)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-gray-500">All-Time Revenue</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(stats.allTime)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-gray-500">Approved Payments</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.recentTransactions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-gray-500">Revenue Sources</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.bySource.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approved Payments</CardTitle>
          <CardDescription>Last 5 approved transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {stats.recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-400 px-6 py-4">No approved payments yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs text-gray-500">
                  <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Plan</th>
                  <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Amount</th>
                  <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3.5 px-6 text-sm text-gray-700">{t.date.toLocaleDateString()}</td>
                    <td className="py-3.5 px-6 text-sm font-medium text-gray-900">{t.customer}</td>
                    <td className="py-3.5 px-6 text-sm text-gray-700">{t.plan}</td>
                    <td className="py-3.5 px-6 text-sm font-medium text-gray-900">{formatCurrency(t.amount)}</td>
                    <td className="py-3.5 px-6 text-sm">
                      <Badge variant={t.status === "APPROVED" ? "success" : "warning"}>{t.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
