"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Building2,
  HardHat,
  Briefcase,
  Package,
  FileText,
  MessageSquare,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  UserPlus,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  UserCheck,
  CreditCard,
  BarChart3,
  Upload,
  Phone,
  ShieldCheck,
  Wallet,
  FileSpreadsheet,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Zap,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const growthMetrics = {
  suppliers: { value: 47, target: 100, icon: Building2, color: "text-blue-600 bg-blue-50", change: "+8", up: true },
  contractors: { value: 23, target: 50, icon: HardHat, color: "text-orange-600 bg-orange-50", change: "+4", up: true },
  professionals: { value: 12, target: 40, icon: Briefcase, color: "text-purple-600 bg-purple-50", change: "+2", up: true },
  products: { value: 340, target: 1000, icon: Package, color: "text-teal-600 bg-teal-50", change: "+47", up: true },
}

const demandMetrics = [
  { label: "RFQs Submitted", value: 186, icon: FileText, color: "text-zanzibar-600 bg-zanzibar-50" },
  { label: "Quote Requests", value: 312, icon: MessageSquare, color: "text-sky-600 bg-sky-50" },
  { label: "Contact Requests", value: 94, icon: Phone, color: "text-amber-600 bg-amber-50" },
  { label: "Active Buyers", value: 58, icon: Users, color: "text-green-600 bg-green-50" },
]

const revenueMetrics = [
  { label: "Verified Members", value: 2385, icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50" },
  { label: "Featured Listings", value: 1450, icon: Star, color: "text-gold-600 bg-gold-50" },
  { label: "Total Revenue", value: 8234, icon: DollarSign, color: "text-zanzibar-600 bg-zanzibar-50", forecast: "Monthly Forecast: $9,500" },
]

const growthMetricsSection = [
  { label: "Traffic (Unique Visitors)", value: "1,847", icon: Eye, color: "text-indigo-600 bg-indigo-50" },
  { label: "Conversion Rate", value: "3.2%", icon: TrendingUp, color: "text-rose-600 bg-rose-50" },
  { label: "New Registrations (30d)", value: 89, icon: UserPlus, color: "text-cyan-600 bg-cyan-50" },
]

const recentActivity = [
  { id: "1", action: "New supplier registered:", target: "Zanzibar Cement Works Ltd", time: "2 min ago", type: "supplier", icon: Building2, color: "text-blue-600 bg-blue-50" },
  { id: "2", action: "RFQ submitted:", target: "500 tons Steel Reinforcement", time: "15 min ago", type: "rfq", icon: FileText, color: "text-zanzibar-600 bg-zanzibar-50" },
  { id: "3", action: "Quote accepted:", target: "Hotel Renovation Project", time: "42 min ago", type: "quote", icon: CheckCircle, color: "text-teal-600 bg-teal-50" },
  { id: "4", action: "New order placed:", target: "#ORD-2025-0042 - Roofing Materials", time: "2 hours ago", type: "order", icon: ShoppingCart, color: "text-green-600 bg-green-50" },
  { id: "5", action: "Contractor verified:", target: "Mwana Builders & Construction", time: "3 hours ago", type: "verify", icon: ShieldCheck, color: "text-purple-600 bg-purple-50" },
  { id: "6", action: "Lead captured:", target: "Beach Resort Development - Stone Town", time: "5 hours ago", type: "lead", icon: TrendingUp, color: "text-orange-600 bg-orange-50" },
  { id: "7", action: "Payment received:", target: "Premium Membership - Azam Supplies", time: "6 hours ago", type: "payment", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
  { id: "8", action: "Review posted:", target: "5-Star - Pemba Timber Co.", time: "7 hours ago", type: "review", icon: Star, color: "text-gold-600 bg-gold-50" },
  { id: "9", action: "New professional joined:", target: "Architect Fatima Hassan", time: "9 hours ago", type: "professional", icon: Briefcase, color: "text-purple-600 bg-purple-50" },
  { id: "10", action: "Product uploaded:", target: "48 new items by Dar Es Salaam Traders", time: "11 hours ago", type: "product", icon: Package, color: "text-teal-600 bg-teal-50" },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount)
}

export default function FounderOperationsDashboard() {
  const [refreshedAt, setRefreshedAt] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshedAt(new Date())
      setRefreshing(false)
    }, 800)
  }

  useEffect(() => {
    const interval = setInterval(() => setRefreshedAt(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Founder Operations Dashboard</h1>
            <Badge variant="outline" className="text-xs font-normal">CEO View</Badge>
          </div>
          <p className="text-sm text-gray-500">
            Last refreshed: {refreshedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={cn("mr-1.5 h-4 w-4", refreshing && "animate-spin")} /> Refresh
        </Button>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Marketplace Growth</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(growthMetrics).map(([key, item]) => {
            const Icon = item.icon
            const pct = Math.round((item.value / item.target) * 100)
            return (
              <Card key={key}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 capitalize">{key}</p>
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
                      <span className={cn("mt-2 inline-flex items-center gap-0.5 text-xs font-medium", item.up ? "text-green-600" : "text-red-600")}>
                        {item.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {item.change} this month
                      </span>
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
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Demand Metrics</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demandMetrics.map((item) => {
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
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Revenue Metrics</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {revenueMetrics.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.label}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">{item.label}</p>
                          <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(item.value)}</p>
                          {item.forecast && (
                            <p className="mt-1 text-xs text-gray-500">{item.forecast}</p>
                          )}
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
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Growth Metrics</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {growthMetricsSection.map((item) => {
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

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Feed</CardTitle>
              <CardDescription>Last 10 platform events</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {recentActivity.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.id} className="flex items-start gap-3 px-5 py-3.5">
                      <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", item.color)}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          {item.action} <span className="font-medium text-gray-900">{item.target}</span>
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" /> {item.time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
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
                  Uptime
                </span>
                <span className="text-sm font-medium text-gray-900">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  API Status
                </span>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  Active Users
                </span>
                <span className="text-sm font-medium text-gray-900">142 online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  Search Index
                </span>
                <span className="text-sm font-medium text-gray-900">340 products</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
