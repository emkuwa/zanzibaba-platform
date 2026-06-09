import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getFounderStats, getRecentActivity } from "@/lib/payments/stats"
import {
  Building2,
  HardHat,
  Briefcase,
  Package,
  FileText,
  MessageSquare,
  Phone,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  UserPlus,
  Eye,
  ShieldCheck,
  Wallet,
  FileSpreadsheet,
  ShoppingCart,
  CheckCircle,
  Clock,
  Upload,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount)
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? "s" : ""} ago`
}

export default async function FounderOperationsDashboard() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  const [stats, activity] = await Promise.all([
    getFounderStats(),
    getRecentActivity(10),
  ])

  const growthItems = [
    { key: "suppliers", value: stats.suppliers, target: 100, icon: Building2, color: "text-blue-600 bg-blue-50" },
    { key: "contractors", value: stats.contractors, target: 50, icon: HardHat, color: "text-orange-600 bg-orange-50" },
    { key: "professionals", value: stats.professionals, target: 40, icon: Briefcase, color: "text-purple-600 bg-purple-50" },
    { key: "products", value: stats.products, target: 1000, icon: Package, color: "text-teal-600 bg-teal-50" },
  ]

  const demandItems = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-zanzibar-600 bg-zanzibar-50" },
    { label: "Pending Payments", value: formatCurrency(stats.pendingPaymentsValue), icon: DollarSign, color: "text-amber-600 bg-amber-50" },
    { label: "Free Suppliers", value: stats.freeCount, icon: Users, color: "text-gray-600 bg-gray-50" },
    { label: "New Registrations (30d)", value: stats.newRegistrations30d, icon: UserPlus, color: "text-cyan-600 bg-cyan-50" },
  ]

  const revenueItems = [
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: "text-zanzibar-600 bg-zanzibar-50" },
    { label: "Verified Suppliers", value: stats.verifiedCount, icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50" },
    { label: "Founding Suppliers", value: stats.foundingCount, icon: Star, color: "text-gold-600 bg-gold-50" },
  ]

  const activityIcons: Record<string, typeof Building2> = {
    supplier: Building2,
    user: UserPlus,
    payment: DollarSign,
  }

  const activityColors: Record<string, string> = {
    supplier: "text-blue-600 bg-blue-50",
    user: "text-cyan-600 bg-cyan-50",
    payment: "text-emerald-600 bg-emerald-50",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Founder Operations Dashboard</h1>
            <Badge variant="outline" className="text-xs font-normal">CEO View</Badge>
          </div>
          <p className="text-sm text-gray-500">Real-time platform metrics from live data</p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Marketplace Growth</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {growthItems.map((item) => {
            const Icon = item.icon
            const pct = item.target > 0 ? Math.round((item.value / item.target) * 100) : 0
            return (
              <Card key={item.key}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 capitalize">{item.key}</p>
                      <p className="mt-1 text-3xl font-bold text-gray-900">{item.value}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Target: {item.target}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-zanzibar-500 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", item.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Platform Metrics</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demandItems.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.label}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{item.label}</p>
                      <p className="mt-1 text-3xl font-bold text-gray-900">{item.value}</p>
                    </div>
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", item.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Revenue & Membership</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {revenueItems.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.label}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">{item.label}</p>
                          <p className="mt-1 text-2xl font-bold text-gray-900">{item.value}</p>
                        </div>
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", item.color)}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Feed</CardTitle>
              <CardDescription>Last 10 platform events</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              {activity.length === 0 ? (
                <p className="text-sm text-gray-400 px-5 py-4">No recent activity.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {activity.map((item) => {
                    const Icon = activityIcons[item.type] || Users
                    const color = activityColors[item.type] || "text-gray-600 bg-gray-50"
                    return (
                      <div key={item.id} className="flex items-start gap-3 px-5 py-3.5">
                        <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", color)}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">
                            {item.action} <span className="font-medium text-gray-900">{item.target}</span>
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" /> {timeAgo(item.time)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common founder tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-5 pt-0">
              <Link href="/dashboard/admin/import">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="mr-2 h-4 w-4" /> Import Suppliers
                </Button>
              </Link>
              <Link href="/dashboard/admin/crm">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" /> View CRM
                </Button>
              </Link>
              <Link href="/dashboard/admin/verification">
                <Button variant="outline" className="w-full justify-start">
                  <ShieldCheck className="mr-2 h-4 w-4" /> Review Verifications
                </Button>
              </Link>
              <Link href="/dashboard/admin/payments">
                <Button variant="outline" className="w-full justify-start">
                  <Wallet className="mr-2 h-4 w-4" /> View Payments
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-0">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Total Suppliers
                </span>
                <span className="text-sm font-medium text-gray-900">{stats.suppliers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Total Users
                </span>
                <span className="text-sm font-medium text-green-600">{stats.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  Total Revenue
                </span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(stats.totalRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  Products Listed
                </span>
                <span className="text-sm font-medium text-gray-900">{stats.products}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
