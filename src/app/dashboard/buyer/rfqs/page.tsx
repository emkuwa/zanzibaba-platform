"use client"

import Link from "next/link"
import { Plus, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const rfqs = [
  { id: "RFQ-2024-0042", title: "Cement Supply - Phase 2", category: "Cement & Binders", status: "open", quotes: 4, deadline: "Dec 20, 2024" },
  { id: "RFQ-2024-0043", title: "Steel Reinforcement Bars", category: "Steel & Reinforcement", status: "open", quotes: 3, deadline: "Dec 22, 2024" },
  { id: "RFQ-2024-0044", title: "Plumbing Fixtures - Hotel", category: "Plumbing", status: "closing", quotes: 2, deadline: "Dec 25, 2024" },
  { id: "RFQ-2024-0045", title: "Roofing Materials - Warehouse", category: "Roofing", status: "open", quotes: 5, deadline: "Dec 28, 2024" },
  { id: "RFQ-2024-0046", title: "Electrical Cables & Wiring", category: "Electrical", status: "closed", quotes: 6, deadline: "Dec 10, 2024" },
  { id: "RFQ-2024-0047", title: "Paint & Finishes - Office", category: "Finishes", status: "awarded", quotes: 4, deadline: "Dec 5, 2024" },
]

export default function RFQsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Request for Quotations</h2>
          <p className="text-sm text-gray-500">Manage your RFQs and received quotes</p>
        </div>
        <Link href="/dashboard/buyer/rfqs/new">
          <Button>
            <Plus className="mr-1.5 h-4 w-4" /> New RFQ
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">RFQ</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Category</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3.5 text-center font-medium text-gray-500">Quotes</th>
                  <th className="px-5 py-3.5 text-left font-medium text-gray-500">Deadline</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/buyer/rfqs/${rfq.id}`}>
                        <p className="font-medium text-gray-900 hover:text-zanzibar-600">{rfq.title}</p>
                      </Link>
                      <p className="text-xs text-gray-400">{rfq.id}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{rfq.category}</td>
                    <td className="px-5 py-4">
                      <Badge variant={
                        rfq.status === "open" ? "success" :
                        rfq.status === "closing" ? "warning" :
                        rfq.status === "awarded" ? "default" : "secondary"
                      }>
                        {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-center font-medium text-gray-900">{rfq.quotes}</td>
                    <td className="px-5 py-4 text-gray-600">{rfq.deadline}</td>
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/buyer/rfqs/${rfq.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-1 h-4 w-4" /> View
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
    </div>
  )
}
