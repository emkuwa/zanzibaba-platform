"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Edit3, Trash2, Eye, ToggleLeft, ToggleRight, Sparkles, Database, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Tabs } from "@/components/ui/tabs"
import ProductImportAssistant from "@/components/ai/product-import-assistant"

const products = [
  { id: "P-001", name: "Portland Cement Grade 42.5N", category: "Cement & Binders", price: "$12.50/bag", status: "active", views: 234, inquiries: 18 },
  { id: "P-002", name: "Steel Rebar 16mm", category: "Steel & Reinforcement", price: "$850/ton", status: "active", views: 189, inquiries: 14 },
  { id: "P-003", name: "PVC Pipes 4 inch", category: "Plumbing", price: "$8.50/m", status: "active", views: 156, inquiries: 11 },
  { id: "P-004", name: "Ceramic Floor Tiles 60x60", category: "Finishes", price: "$18.90/m²", status: "active", views: 132, inquiries: 9 },
  { id: "P-005", name: "Electrical Cable 10mm", category: "Electrical", price: "$4.20/m", status: "inactive", views: 98, inquiries: 6 },
  { id: "P-006", name: "Roofing Sheets Iron", category: "Roofing", price: "$22.00/sheet", status: "draft", views: 0, inquiries: 0 },
  { id: "P-007", name: "Paint Emulsion White 20L", category: "Finishes", price: "$45.00/pail", status: "active", views: 87, inquiries: 5 },
  { id: "P-008", name: "River Sand Coarse", category: "Aggregates", price: "$35.00/ton", status: "active", views: 145, inquiries: 12 },
]

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "Cement & Binders", label: "Cement & Binders" },
  { value: "Steel & Reinforcement", label: "Steel & Reinforcement" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "Electrical", label: "Electrical" },
  { value: "Roofing", label: "Roofing" },
  { value: "Finishes", label: "Finishes" },
  { value: "Aggregates", label: "Aggregates" },
]

const statusVariant: Record<string, "success" | "secondary" | "warning"> = {
  active: "success",
  inactive: "secondary",
  draft: "warning",
}

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [productList, setProductList] = useState(products)
  const [showImport, setShowImport] = useState(false)

  const filtered = productList.filter((p) => {
    const s = search.toLowerCase()
    const matchesSearch = p.name.toLowerCase().includes(s) || p.id.toLowerCase().includes(s)
    const matchesCategory = category === "all" || p.category === category
    return matchesSearch && matchesCategory
  })

  function toggleStatus(id: string) {
    setProductList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
      )
    )
  }

  function deleteProduct(id: string) {
    if (confirm("Are you sure you want to delete this product?")) {
      setProductList((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">Manage your product catalog ({productList.length} products)</p>
        </div>
        <div className="flex items-center gap-2">
          {!showImport ? (
            <>
              <Button variant="outline" onClick={() => setShowImport(true)}>
                <Sparkles className="mr-1.5 h-4 w-4" /> AI Import
              </Button>
              <Link href="/dashboard/supplier/products/new">
                <Button>
                  <Plus className="mr-1.5 h-4 w-4" /> Add Product
                </Button>
              </Link>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setShowImport(false)}>
              <X className="mr-1.5 h-4 w-4" /> Close Import
            </Button>
          )}
        </div>
      </div>

      {showImport ? (
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-50 to-zanzibar-50 p-4">
              <Database className="h-6 w-6 text-zanzibar-600 shrink-0" />
              <div>
                <p className="font-semibold text-zanzibar-800">AI Product Import</p>
                <p className="text-sm text-zanzibar-600">Paste a URL, upload a PDF catalog, or enter product details to bulk import.</p>
              </div>
            </div>
            <ProductImportAssistant />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search products..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="w-48">
              <Select options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <p className="text-sm text-gray-500 sm:ml-auto">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-5 py-3.5 text-left font-medium text-gray-500">Product</th>
                      <th className="px-5 py-3.5 text-left font-medium text-gray-500">Category</th>
                      <th className="px-5 py-3.5 text-left font-medium text-gray-500">Price</th>
                      <th className="px-5 py-3.5 text-left font-medium text-gray-500">Status</th>
                      <th className="px-5 py-3.5 text-right font-medium text-gray-500">Views</th>
                      <th className="px-5 py-3.5 text-right font-medium text-gray-500">Inquiries</th>
                      <th className="px-5 py-3.5 text-right font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                              <Eye className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-400">{product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-600">{product.category}</td>
                        <td className="px-5 py-4 font-semibold text-gray-900">{product.price}</td>
                        <td className="px-5 py-4">
                          <Badge variant={statusVariant[product.status]}>
                            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right text-gray-600">{product.views}</td>
                        <td className="px-5 py-4 text-right text-gray-600">{product.inquiries}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/dashboard/supplier/products/${product.id}/edit`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><Edit3 className="h-4 w-4" /></Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => deleteProduct(product.id)}><Trash2 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStatus(product.id)}>
                              {product.status === "active" ? <ToggleRight className="h-4 w-4 text-zanzibar-600" /> : <ToggleLeft className="h-4 w-4 text-gray-400" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-gray-500">No products match your filters</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
