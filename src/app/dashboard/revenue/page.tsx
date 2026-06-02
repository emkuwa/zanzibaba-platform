"use client"

import { useState, useEffect } from "react"
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
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount)
}

const weekData = [
  { day: "Mon", value: 180 },
  { day: "Tue", value: 245 },
  { day: "Wed", value: 190 },
  { day: "Thu", value: 320 },
  { day: "Fri", value: 410 },
  { day: "Sat", value: 290 },
  { day: "Sun", value: 350 },
]

const maxWeekValue = Math.max(...weekData.map((d) => d.value))

const revenueSources = [
  { label: "Verification", value: 2385, pct: 29, icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50", barColor: "bg-emerald-500" },
  { label: "Featured Listings", value: 1450, pct: 18, icon: Star, color: "text-gold-600 bg-gold-50", barColor: "bg-gold-500" },
  { label: "Advertising", value: 899, pct: 11, icon: Megaphone, color: "text-blue-600 bg-blue-50", barColor: "bg-blue-500" },
  { label: "Memberships", value: 3500, pct: 42, icon: Users, color: "text-purple-600 bg-purple-50", barColor: "bg-purple-500" },
]

const transactions = [
  { date: "2025-06-01", customer: "Azam Building Supplies", product: "Premium Membership", amount: 299, status: "Completed" },
  { date: "2025-05-30", customer: "Stone Town Construction", product: "Featured Listing - 30 days", amount: 149, status: "Completed" },
  { date: "2025-05-28", customer: "Mwanza Hardware Ltd", product: "Verification Fee", amount: 85, status: "Completed" },
  { date: "2025-05-27", customer: "Pemba Timber Co.", product: "Premium Membership", amount: 299, status: "Completed" },
  { date: "2025-05-26", customer: "Dar Es Salaam Traders", product: "Advertising Package", amount: 199, status: "Pending" },
]

export default function RevenueActivationDashboard() {
  const [refreshedAt, setRefreshedAt] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setRefreshedAt(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Revenue Activation Dashboard</h1>
            <Badge variant="outline" className="text-xs font-normal">Financials</Badge>
          </div>
          <p className="text-sm text-gray-500">
            Last updated: {refreshedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
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
                  <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(234)}</p>
                  <span className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
                    <TrendingUp className="h-3 w-3" /> +12% from yesterday
                  </span>
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
                  <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(1890)}</p>
                  <span className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
                    <TrendingUp className="h-3 w-3" /> +8% from last week
                  </span>
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
                  <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(8234)}</p>
                  <span className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
                    <TrendingUp className="h-3 w-3" /> +15% from last month
                  </span>
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
          {revenueSources.map((source) => {
            const Icon = source.icon
            return (
              <Card key={source.label}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", source.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="mt-3 text-sm font-medium text-gray-500">{source.label}</p>
                      <p className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(source.value)}</p>
                      <div className="mt-2">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <div className={cn("h-full rounded-full", source.barColor)} style={{ width: `${source.pct}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{source.pct}% of total</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Revenue Trend — Last 7 Days</h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-end justify-between gap-2" style={{ height: 160 }}>
              {weekData.map((d) => {
                const heightPct = (d.value / maxWeekValue) * 100
                return (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-xs font-medium text-gray-700">{formatCurrency(d.value)}</span>
                    <div
                      className="w-full rounded-md bg-gradient-to-t from-zanzibar-600 to-zanzibar-400 transition-all"
                      style={{ height: `${heightPct}%`, minHeight: 16 }}
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
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(8234)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-gray-500">Projected Month End</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(9500)}</p>
              <span className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
                <ArrowUpRight className="h-3 w-3" /> +15.4% growth
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-gray-500">Quarter Forecast</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(28000)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-gray-500">Annual Run Rate</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(98808)}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Last 5 financial transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs text-gray-500">
                <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Product</th>
                <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-6 font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.date + t.customer} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3.5 px-6 text-sm text-gray-700">{t.date}</td>
                  <td className="py-3.5 px-6 text-sm font-medium text-gray-900">{t.customer}</td>
                  <td className="py-3.5 px-6 text-sm text-gray-700">{t.product}</td>
                  <td className="py-3.5 px-6 text-sm font-medium text-gray-900">{formatCurrency(t.amount)}</td>
                  <td className="py-3.5 px-6 text-sm">
                    <Badge variant={t.status === "Completed" ? "success" : "warning"}>{t.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
