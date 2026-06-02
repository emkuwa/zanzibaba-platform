"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Building2, Calendar, DollarSign, MapPin, CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const quotes = [
  { id: "Q-001", supplier: "Azam Building Supplies", amount: "$45,200", timeline: "21 days", status: "pending", rated: false },
  { id: "Q-002", supplier: "Zanzibar Cement Ltd", amount: "$42,800", timeline: "14 days", status: "pending", rated: false },
  { id: "Q-003", supplier: "East Africa Materials Co", amount: "$48,500", timeline: "28 days", status: "pending", rated: false },
]

export default function RFQDetailPage() {
  const params = useParams()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">Cement Supply - Phase 2</h2>
          <p className="text-sm text-gray-500">RFQ ID: {params.id}</p>
        </div>
        <Badge variant="success" className="text-sm">Open</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">RFQ Details</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-gray-600">
                We are seeking competitive quotes for the supply of Portland cement for Phase 2 of our
                Beachfront Villa Development project. Required specifications: Grade 42.5N, in 50kg bags.
                Estimated quantity: 500 tons. Delivery to Matemwe construction site.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Budget Range</p>
                    <p className="text-sm font-medium text-gray-900">$40,000 - $55,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Delivery Location</p>
                    <p className="text-sm font-medium text-gray-900">Matemwe, Zanzibar</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="text-sm font-medium text-gray-900">Dec 20, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-medium text-gray-900">Cement & Binders</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Attached Documents</p>
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    <Download className="h-3 w-3" /> RFQ_Specs.pdf
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    <Download className="h-3 w-3" /> Site_Plan.dwg
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Buyer Info</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zanzibar-100 text-zanzibar-700 font-semibold">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Beachfront Villas Ltd</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>Member since Jan 2024</p>
                <p>4 active projects</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Received Quotes ({quotes.length})</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {quotes.map((quote) => (
                <div key={quote.id} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{quote.supplier}</p>
                    <Badge variant={quote.status === "pending" ? "warning" : "success"}>
                      {quote.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-zanzibar-600">{quote.amount}</span>
                    <span className="text-gray-500">{quote.timeline}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="default" className="flex-1">Accept</Button>
                    <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
