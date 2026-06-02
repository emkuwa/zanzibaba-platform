"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  { value: "cement", label: "Cement & Binders" },
  { value: "steel", label: "Steel & Reinforcement" },
  { value: "timber", label: "Timber & Wood" },
  { value: "roofing", label: "Roofing Materials" },
  { value: "plumbing", label: "Plumbing & Fixtures" },
  { value: "electrical", label: "Electrical & Lighting" },
  { value: "finishes", label: "Finishes & Paint" },
  { value: "tiles", label: "Tiles & Flooring" },
  { value: "doors", label: "Doors & Windows" },
]

const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "TZS", label: "TZS - Tanzanian Shilling" },
  { value: "EUR", label: "EUR - Euro" },
]

const units = [
  { value: "tons", label: "Tons" },
  { value: "kg", label: "Kilograms" },
  { value: "bags", label: "Bags" },
  { value: "pieces", label: "Pieces" },
  { value: "sqm", label: "Square Meters" },
  { value: "cbm", label: "Cubic Meters" },
  { value: "liters", label: "Liters" },
  { value: "units", label: "Units" },
]

export default function NewRFQPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">New RFQ</h2>
          <p className="text-sm text-gray-500">Request quotes from suppliers</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="space-y-5 p-6">
          <Input id="title" label="RFQ Title" placeholder="e.g. Cement Supply for Phase 2" />
          <Select id="category" label="Category" options={categories} placeholder="Select category" />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500 focus:border-zanzibar-500 transition-colors"
              placeholder="Describe what you need, specifications, quality requirements..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input id="quantity" label="Quantity" type="number" placeholder="0" />
            <Select id="unit" label="Unit" options={units} placeholder="Unit" />
            <Select id="currency" label="Currency" options={currencies} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input id="budgetMin" label="Budget Range - Min" type="number" placeholder="0.00" />
            <Input id="budgetMax" label="Budget Range - Max" type="number" placeholder="0.00" />
          </div>

          <Input id="deliveryLocation" label="Delivery Location" placeholder="e.g. Stone Town, Zanzibar" />
          <Input id="deliveryTimeline" label="Expected Delivery Timeline" placeholder="e.g. Within 30 days" />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Supporting Documents</label>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-zanzibar-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Drop files here or click to upload</p>
                <p className="text-xs text-gray-400">PDF, DOC, XLS, DWG - Max 20MB</p>
              </div>
              <input type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
            </label>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((f, i) => <p key={i} className="text-sm text-gray-600">{f.name}</p>)}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button>Publish RFQ</Button>
            <Button variant="outline" onClick={() => router.back()}>Save as Draft</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
