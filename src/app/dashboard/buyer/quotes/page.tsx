"use client"

import { useState } from "react"
import { Search, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

const quotesData = [
  { id: "Q-001", supplier: "Azam Building Supplies", rfqTitle: "Cement Supply - Phase 2", amount: "$45,200", delivery: "21 days", status: "pending", date: "Dec 15, 2024" },
  { id: "Q-002", supplier: "Zanzibar Cement Ltd", rfqTitle: "Cement Supply - Phase 2", amount: "$42,800", delivery: "14 days", status: "accepted", date: "Dec 14, 2024" },
  { id: "Q-003", supplier: "East Africa Materials Co", rfqTitle: "Steel Reinforcement Bars", amount: "$38,500", delivery: "28 days", status: "pending", date: "Dec 13, 2024" },
  { id: "Q-004", supplier: "Tanga Steel Traders", rfqTitle: "Steel Reinforcement Bars", amount: "$36,200", delivery: "21 days", status: "rejected", date: "Dec 12, 2024" },
  { id: "Q-005", supplier: "Dar Es Salaam Hardware", rfqTitle: "Plumbing Fixtures - Hotel", amount: "$12,800", delivery: "14 days", status: "pending", date: "Dec 11, 2024" },
  { id: "Q-006", supplier: "Mombasa Building Centre", rfqTitle: "Roofing Materials - Warehouse", amount: "$28,400", delivery: "21 days", status: "accepted", date: "Dec 10, 2024" },
  { id: "Q-007", supplier: "Zanzibar Cement Ltd", rfqTitle: "Cement Supply - Phase 1", amount: "$41,000", delivery: "14 days", status: "accepted", date: "Nov 28, 2024" },
  { id: "Q-008", supplier: "Coastal Electricals Ltd", rfqTitle: "Electrical Cables & Wiring", amount: "$22,600", delivery: "21 days", status: "rejected", date: "Nov 25, 2024" },
  { id: "Q-009", supplier: "Premium Aggregates Ltd", rfqTitle: "Stone Town Hotel Renovation", amount: "$18,900", delivery: "10 days", status: "pending", date: "Nov 20, 2024" },
  { id: "Q-010", supplier: "Kenya Steel Mills", rfqTitle: "Steel Reinforcement Bars", amount: "$35,000", delivery: "30 days", status: "pending", date: "Nov 18, 2024" },
]

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
]

const statusVariant: Record<string, "warning" | "success" | "danger"> = {
  pending: "warning",
  accepted: "success",
  rejected: "danger",
}

export default function QuotesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = quotesData.filter((q) => {
    const s = search.toLowerCase()
    const matchesSearch = q.supplier.toLowerCase().includes(s) || q.rfqTitle.toLowerCase().includes(s)
    const matchesStatus = statusFilter === "all" || q.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Quotes Received</h2>
        <p className="text-sm text-gray-500">Review and manage quotes from suppliers</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search supplier or RFQ..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="w-40">
            <Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
          </div>
        </div>
        <p className="text-sm text-gray-500">{filtered.length} quote{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Supplier</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">RFQ Title</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Amount</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Delivery Timeline</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Date</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">{quote.supplier}</td>
                    <td className="px-5 py-4 text-gray-600">{quote.rfqTitle}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900">{quote.amount}</td>
                    <td className="px-5 py-4 text-gray-600">{quote.delivery}</td>
                    <td className="px-5 py-4">
                      <Badge variant={statusVariant[quote.status]}>
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{quote.date}</td>
                    <td className="px-5 py-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-1 h-4 w-4" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                      No quotes match your filters
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
