"use client"

import Link from "next/link"
import { Plus, FileText, Users, ClipboardList, ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Active Projects", value: "3", change: "+1 this month", icon: FileText, color: "text-blue-600 bg-blue-50" },
  { label: "Open RFQs", value: "5", change: "+2 this week", icon: ClipboardList, color: "text-zanzibar-600 bg-zanzibar-50" },
  { label: "Quotes Received", value: "12", change: "+4 this week", icon: Users, color: "text-gold-600 bg-gold-50" },
  { label: "Saved Suppliers", value: "8", change: "2 new", icon: Users, color: "text-ocean-600 bg-ocean-50" },
]

const recentActivity = [
  { id: "1", action: "Quote received from", target: "Azam Building Supplies", time: "2 min ago", type: "quote" },
  { id: "2", action: "RFQ", target: "#RFQ-2024-0042 approved", time: "1 hour ago", type: "success" },
  { id: "3", action: "New project created:", target: "Beachfront Villa Development", time: "3 hours ago", type: "project" },
  { id: "4", action: "Order", target: "#ORD-2024-0018 shipped", time: "5 hours ago", type: "order" },
  { id: "5", action: "Supplier", target: "Zanzibar Cement Ltd joined your shortlist", time: "1 day ago", type: "supplier" },
]

const openRFQs = [
  { id: "RFQ-2024-0042", title: "Cement Supply - Phase 2", category: "Cement & Binders", quotes: 4, deadline: "2024-12-20", status: "open" },
  { id: "RFQ-2024-0043", title: "Steel Reinforcement Bars", category: "Steel & Reinforcement", quotes: 3, deadline: "2024-12-22", status: "open" },
  { id: "RFQ-2024-0044", title: "Plumbing Fixtures - Hotel Project", category: "Plumbing", quotes: 2, deadline: "2024-12-25", status: "closing" },
  { id: "RFQ-2024-0045", title: "Roofing Materials - Warehouse", category: "Roofing", quotes: 5, deadline: "2024-12-28", status: "open" },
]

export default function BuyerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, John</h2>
          <p className="text-gray-500">Here&apos;s what&apos;s happening with your projects today.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/buyer/projects/new">
            <Button>
              <Plus className="mr-1.5 h-4 w-4" /> New Project
            </Button>
          </Link>
          <Link href="/dashboard/buyer/rfqs/new">
            <Button variant="outline">
              <FileText className="mr-1.5 h-4 w-4" /> New RFQ
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
            <h3 className="font-semibold text-gray-900">Open RFQs</h3>
            <Link href="/dashboard/buyer/rfqs" className="text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-gray-100">
                    <th className="px-5 py-3 text-left font-medium text-gray-500">RFQ</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Category</th>
                    <th className="px-5 py-3 text-center font-medium text-gray-500">Quotes</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Deadline</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {openRFQs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900">{rfq.title}</p>
                        <p className="text-xs text-gray-400">{rfq.id}</p>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{rfq.category}</td>
                      <td className="px-5 py-3.5 text-center font-medium text-gray-900">{rfq.quotes}</td>
                      <td className="px-5 py-3.5 text-gray-600">{rfq.deadline}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={rfq.status === "closing" ? "warning" : "success"}>
                          {rfq.status === "closing" ? "Closing Soon" : "Open"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Link href={`/dashboard/buyer/rfqs/${rfq.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                    <div className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      item.type === "quote" && "bg-blue-50 text-blue-600",
                      item.type === "success" && "bg-zanzibar-50 text-zanzibar-600",
                      item.type === "project" && "bg-gold-50 text-gold-600",
                      item.type === "order" && "bg-ocean-50 text-ocean-600",
                      item.type === "supplier" && "bg-purple-50 text-purple-600",
                    )}>
                      {item.type === "quote" && <ClipboardList className="h-3.5 w-3.5" />}
                      {item.type === "success" && <CheckCircle className="h-3.5 w-3.5" />}
                      {item.type === "project" && <FileText className="h-3.5 w-3.5" />}
                      {item.type === "order" && <ShoppingCart className="h-3.5 w-3.5" />}
                      {item.type === "supplier" && <Users className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        {item.action} <span className="font-medium text-gray-900">{item.target}</span>
                      </p>
                      <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-2 p-5 pt-0">
              <Link href="/dashboard/buyer/projects/new">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
              </Link>
              <Link href="/dashboard/buyer/rfqs/new">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" /> New RFQ
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Browse Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
