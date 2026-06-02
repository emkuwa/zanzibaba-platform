"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const categories = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "hospitality", label: "Hospitality" },
  { value: "infrastructure", label: "Infrastructure" },
]

const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "TZS", label: "TZS - Tanzanian Shilling" },
  { value: "EUR", label: "EUR - Euro" },
]

export default function NewProjectPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">New Project</h2>
          <p className="text-sm text-gray-500">Create a new construction project</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="space-y-5 p-6">
          <Input id="projectName" label="Project Name" placeholder="e.g. Beachfront Villa Development" />
          
          <Select id="projectType" label="Project Type" options={categories} placeholder="Select type" />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500 focus:border-zanzibar-500 transition-colors"
              placeholder="Describe your project scope, requirements, and any special considerations..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select id="category" label="Category" options={categories} placeholder="Select category" />
            <Select id="currency" label="Currency" options={currencies} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input id="budget" label="Budget" type="number" placeholder="0.00" />
            <Input id="location" label="Location" placeholder="e.g. Stone Town, Zanzibar" />
          </div>

          <Input id="timeline" label="Expected Timeline" placeholder="e.g. 12 months" />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Documents</label>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-zanzibar-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Drop files here or click to upload</p>
                <p className="text-xs text-gray-400">PDF, DWG, DOC - Max 20MB each</p>
              </div>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </label>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <p key={i} className="text-sm text-gray-600">{f.name}</p>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={() => router.push("/dashboard/buyer/projects")}>Create Project</Button>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
