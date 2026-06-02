"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Calendar, MapPin, DollarSign, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const statusSteps = [
  { label: "Planning", date: "Dec 1, 2024", completed: true },
  { label: "Design", date: "Dec 15, 2024", completed: true },
  { label: "RFQ Stage", date: "Jan 5, 2025", completed: false, current: true },
  { label: "Supplier Selection", date: "Pending", completed: false },
  { label: "Construction", date: "Pending", completed: false },
  { label: "Completion", date: "Pending", completed: false },
]

const documents = [
  { name: "Project_Scope_v2.pdf", type: "PDF", size: "2.4 MB" },
  { name: "Architectural_Drawings.dwg", type: "DWG", size: "8.1 MB" },
  { name: "Budget_Estimate.xlsx", type: "XLSX", size: "1.2 MB" },
]

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">Beachfront Villa Development</h2>
          <p className="text-sm text-gray-500">Project ID: {params.id}</p>
        </div>
        <Badge variant="success" className="text-sm">Active</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Project Details</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-gray-600">
              Luxury beachfront villa development project located in the pristine shores of Matemwe, Zanzibar.
              The project includes 6 luxury villas with private pools, landscaping, and communal amenities.
              Phase 1 focuses on the main structure and infrastructure.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">Matemwe, Zanzibar</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-sm font-medium text-gray-900">$850,000</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Timeline</p>
                  <p className="text-sm font-medium text-gray-900">12 months</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm font-medium text-gray-900">Residential / Hospitality</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Status Tracker</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {statusSteps.map((step, i) => (
                <div key={step.label} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < statusSteps.length - 1 && (
                    <div className={`absolute left-[9px] top-5 w-0.5 h-full -translate-x-1/2 ${
                      step.completed ? "bg-zanzibar-500" : "bg-gray-200"
                    }`} />
                  )}
                  <div className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    step.completed ? "bg-zanzibar-500 text-white" :
                    step.current ? "border-2 border-zanzibar-500 bg-white" : "bg-gray-200"
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : step.current ? (
                      <div className="h-2 w-2 rounded-full bg-zanzibar-500" />
                    ) : null}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${step.current ? "text-zanzibar-700" : "text-gray-700"}`}>{step.label}</p>
                    <p className="text-xs text-gray-400">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Documents</h3>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <div key={doc.name} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-400">{doc.type} - {doc.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
