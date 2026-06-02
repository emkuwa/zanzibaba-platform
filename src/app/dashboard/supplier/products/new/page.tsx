"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, ImageIcon, Save, FileText, X } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const categoryOptions = [
  { value: "", label: "Select category" },
  { value: "Cement & Binders", label: "Cement & Binders" },
  { value: "Steel & Reinforcement", label: "Steel & Reinforcement" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "Electrical", label: "Electrical" },
  { value: "Roofing", label: "Roofing" },
  { value: "Finishes", label: "Finishes" },
  { value: "Aggregates", label: "Aggregates" },
  { value: "Tools & Equipment", label: "Tools & Equipment" },
  { value: "Other", label: "Other" },
]

const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "TZS", label: "TZS (TSh)" },
  { value: "KES", label: "KES (KSh)" },
  { value: "EUR", label: "EUR (€)" },
]

const unitOptions = [
  { value: "piece", label: "Per Piece" },
  { value: "kg", label: "Per Kg" },
  { value: "ton", label: "Per Ton" },
  { value: "meter", label: "Per Meter" },
  { value: "m2", label: "Per m²" },
  { value: "liter", label: "Per Liter" },
  { value: "bag", label: "Per Bag" },
  { value: "sheet", label: "Per Sheet" },
]

export default function NewProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<string[]>([])

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const result = ev.target?.result
        if (typeof result === 'string') {
          setImages((prev) => [...prev, result])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
          <p className="text-sm text-gray-500">List a new product in your catalog</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Product Name" id="name" placeholder="e.g. Portland Cement Grade 42.5N" />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" id="category" options={categoryOptions} placeholder="Select category" />
                <Input label="Brand" id="brand" placeholder="Brand name (optional)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500 focus:border-zanzibar-500"
                  placeholder="Describe your product in detail, including key features and benefits..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specifications</label>
                <textarea
                  className="mt-1 flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500 focus:border-zanzibar-500"
                  placeholder="e.g. Grade: 42.5N, Packaging: 50kg bags, Standards: ASTM C150..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Pricing & Inventory</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price" id="price" type="number" placeholder="0.00" />
                <Select label="Currency" id="currency" options={currencyOptions} placeholder="Select currency" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Minimum Order Quantity" id="moq" type="number" placeholder="1" />
                <Select label="Unit" id="unit" options={unitOptions} placeholder="Select unit" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Stock Quantity" id="stock" type="number" placeholder="0" />
                <Input label="Lead Time" id="leadTime" placeholder="e.g. 7-14 days" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Product Images</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-zanzibar-400 hover:bg-zanzibar-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-700">Drop images here</p>
                <p className="text-xs text-gray-400">or click to browse (max 5MB each)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt="" className="h-24 w-full rounded-lg object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && (
                <div className="flex items-center justify-center rounded-lg bg-gray-50 p-4">
                  <ImageIcon className="h-12 w-12 text-gray-300" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button variant="secondary">
          <Save className="mr-1.5 h-4 w-4" /> Save as Draft
        </Button>
        <Button>
          <FileText className="mr-1.5 h-4 w-4" /> Publish Product
        </Button>
      </div>
    </div>
  )
}
