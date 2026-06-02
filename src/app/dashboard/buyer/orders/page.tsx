"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Eye, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

const ordersData = [
  { id: "ORD-2024-0018", supplier: "Zanzibar Cement Ltd", amount: "$42,800", status: "shipped", date: "Dec 10, 2024", tracking: "ZCL-98472" },
  { id: "ORD-2024-0017", supplier: "Azam Building Supplies", amount: "$45,200", status: "processing", date: "Dec 8, 2024", tracking: "ABS-77341" },
  { id: "ORD-2024-0016", supplier: "Mombasa Building Centre", amount: "$28,400", status: "confirmed", date: "Dec 5, 2024", tracking: "MBC-66230" },
  { id: "ORD-2024-0015", supplier: "East Africa Materials Co", amount: "$38,500", status: "delivered", date: "Nov 28, 2024", tracking: "EAM-55129" },
  { id: "ORD-2024-0014", supplier: "Dar Es Salaam Hardware", amount: "$12,800", status: "delivered", date: "Nov 20, 2024", tracking: "DHS-44018" },
  { id: "ORD-2024-0013", supplier: "Tanga Steel Traders", amount: "$36,200", status: "cancelled", date: "Nov 15, 2024", tracking: "TST-33907" },
  { id: "ORD-2024-0012", supplier: "Zanzibar Cement Ltd", amount: "$41,000", status: "delivered", date: "Nov 10, 2024", tracking: "ZCL-22896" },
  { id: "ORD-2024-0011", supplier: "Coastal Electricals Ltd", amount: "$22,600", status: "processing", date: "Nov 5, 2024", tracking: "CEL-11785" },
]

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

const statusVariant: Record<string, "default" | "warning" | "success" | "danger" | "secondary"> = {
  confirmed: "default",
  processing: "warning",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
}

export default function OrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = ordersData.filter((o) => {
    const s = search.toLowerCase()
    const matchesSearch = o.supplier.toLowerCase().includes(s) || o.id.toLowerCase().includes(s)
    const matchesStatus = statusFilter === "all" || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Orders</h2>
        <p className="text-sm text-gray-500">Track and manage your orders</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search orders..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="w-40">
            <Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
          </div>
        </div>
        <p className="text-sm text-gray-500">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Order #</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Supplier</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Amount</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Date</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Tracking</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/buyer/orders/${order.id}`}>
                        <p className="font-medium text-gray-900 hover:text-zanzibar-600">{order.id}</p>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{order.supplier}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900">{order.amount}</td>
                    <td className="px-5 py-4">
                      <Badge variant={statusVariant[order.status]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{order.date}</td>
                    <td className="px-5 py-4">
                      {order.tracking ? (
                        <span className="font-mono text-xs text-gray-500">{order.tracking}</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/buyer/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                      No orders match your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
