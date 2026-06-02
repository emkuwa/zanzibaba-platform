"use client"

import Link from "next/link"
import {
  Eye, FileText, ClipboardList, TrendingUp, Package, Crown, ShieldCheck,
  DollarSign, Calendar, ArrowRight, CheckCircle, AlertCircle, Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Profile Views", value: "127", change: "+12 today", icon: Eye, color: "text-blue-600 bg-blue-50" },
  { label: "RFQs This Week", value: "8", change: "+3 new", icon: FileText, color: "text-zanzibar-600 bg-zanzibar-50" },
  { label: "Quotes Sent", value: "42", change: "+5 this month", icon: ClipboardList, color: "text-gold-600 bg-gold-50" },
  { label: "Conversion Rate", value: "24%", change: "+2.5% vs last month", icon: TrendingUp, color: "text-ocean-600 bg-ocean-50" },
]

const newRFQs = [
  { id: "RFQ-2024-0050", title: "Cement Supply - Resort Project", buyer: "Beachfront Villas Ltd", budget: "$40,000 - $55,000", deadline: "Jan 15, 2025", category: "Cement & Binders" },
  { id: "RFQ-2024-0051", title: "Steel Bars - Bridge Construction", buyer: "InfraBuild Corp", budget: "$60,000 - $80,000", deadline: "Jan 20, 2025", category: "Steel & Reinforcement" },
  { id: "RFQ-2024-0052", title: "Plumbing Fixtures - Hotel", buyer: "Oceanview Hotels Ltd", budget: "$15,000 - $25,000", deadline: "Jan 25, 2025", category: "Plumbing" },
]

const topProducts = [
  { name: "Portland Cement Grade 42.5N", views: 234, inquiries: 18, conversion: "7.7%" },
  { name: "Steel Rebar 16mm", views: 189, inquiries: 14, conversion: "7.4%" },
  { name: "PVC Pipes 4 inch", views: 156, inquiries: 11, conversion: "7.1%" },
  { name: "Ceramic Floor Tiles", views: 132, inquiries: 9, conversion: "6.8%" },
]

export default function SupplierOverview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, John</h2>
          <p className="text-gray-500">Here&apos;s your supplier dashboard overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/supplier/products/new">
            <Button>
              <Package className="mr-1.5 h-4 w-4" /> Add Product
            </Button>
          </Link>
          <Link href="/dashboard/supplier/rfqs">
            <Button variant="outline">
              <FileText className="mr-1.5 h-4 w-4" /> View RFQs
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-1 text-xs text-gray-400">{stat.change}</p>
                  </div>
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="font-semibold text-gray-900">New RFQ Opportunities</h3>
            <Link href="/dashboard/supplier/rfqs" className="text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {newRFQs.map((rfq) => (
              <div key={rfq.id} className="rounded-lg border border-gray-200 p-4 hover:border-zanzibar-200 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 truncate">{rfq.title}</h4>
                      <Badge variant="success" className="shrink-0 text-[10px]">New</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{rfq.id} &middot; {rfq.buyer}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <DollarSign className="h-3 w-3" /> {rfq.budget}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" /> {rfq.deadline}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        {rfq.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/dashboard/supplier/rfqs/${rfq.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                    <Link href={`/dashboard/supplier/rfqs/${rfq.id}`}>
                      <Button size="sm">Submit Quote</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-gray-900">Product Performance</h3>
              <Link href="/dashboard/supplier/products" className="text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700">
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-y border-gray-100">
                      <th className="px-4 py-2.5 text-left font-medium text-gray-500">Product</th>
                      <th className="px-4 py-2.5 text-right font-medium text-gray-500">Views</th>
                      <th className="px-4 py-2.5 text-right font-medium text-gray-500">Inq.</th>
                      <th className="px-4 py-2.5 text-right font-medium text-gray-500">Conv.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {topProducts.map((p) => (
                      <tr key={p.name} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[140px]">{p.name}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{p.views}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{p.inquiries}</td>
                        <td className="px-4 py-3 text-right font-medium text-zanzibar-600">{p.conversion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Membership</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-gold-50 p-3">
                <Crown className="h-8 w-8 text-gold-600" />
                <div>
                  <p className="font-semibold text-gray-900">Professional Plan</p>
                  <p className="text-xs text-gray-500">$149/month &middot; Renews Jan 15, 2025</p>
                </div>
              </div>
              <Link href="/dashboard/supplier/membership">
                <Button variant="outline" className="w-full">
                  <Crown className="mr-1.5 h-4 w-4" /> Upgrade Plan
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Verification</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-zanzibar-50 p-3">
                <ShieldCheck className="h-8 w-8 text-zanzibar-600" />
                <div>
                  <p className="font-semibold text-gray-900">Verified Supplier</p>
                  <Badge variant="success">Verified</Badge>
                </div>
              </div>
              <Link href="/dashboard/supplier/verification">
                <Button variant="outline" className="w-full">
                  <ShieldCheck className="mr-1.5 h-4 w-4" /> View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
