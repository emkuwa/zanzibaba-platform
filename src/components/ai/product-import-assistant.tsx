"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs } from "@/components/ui/tabs"
import {
  Globe, FileText, Check, CheckCircle, Loader2, Sparkles,
  Database, Download, Import, Package, Tag, DollarSign,
  Upload, ArrowRight, X, ShoppingBag, List
} from "lucide-react"
import { MessageList, type Message } from "./chat-message"
import { FileUploadZone, type UploadedFileInfo } from "./file-upload-zone"
import type { ImportedProduct, ProductImportResult } from "@/lib/ai/product-import"

type InputMode = "url" | "pdf" | "text"

export default function ProductImportAssistant() {
  const [mode, setMode] = useState<InputMode>("url")
  const [url, setUrl] = useState("")
  const [textInput, setTextInput] = useState("")
  const [files, setFiles] = useState<UploadedFileInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ProductImportResult | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())
  const [imported, setImported] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: (
        <div>
          <p className="font-semibold text-zanzibar-800 mb-1">
            AI Product Import Assistant
          </p>
          <p>
            Paste a website URL, upload a PDF catalogue, or enter product details manually.
            I'll extract products, generate descriptions, and prepare them for import.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Bulk import your entire catalog in minutes.
          </p>
        </div>
      ),
    },
  ])

  function addMessage(role: "ai" | "user" | "system", content: string | React.ReactNode) {
    setMessages((prev) => [...prev, { id: `${role}-${Date.now()}`, role, content }])
  }

  function addLoading() {
    setMessages((prev) => [...prev, { id: "loading", role: "ai", type: "loading", content: "" }])
  }

  function removeLoading() {
    setMessages((prev) => prev.filter((m) => m.id !== "loading"))
  }

  async function handleExtract() {
    const hasContent = mode === "url" ? url : mode === "text" ? textInput : files.length > 0
    if (!hasContent) return

    const desc = mode === "url" ? `URL: ${url.substring(0, 50)}...` :
      mode === "text" ? `Text: ${textInput.substring(0, 50)}...` :
        `File: ${files[0]?.name}`
    addMessage("user", desc)
    addLoading()
    setLoading(true)

    const formData = new FormData()
    formData.append("type", mode)

    if (mode === "url") {
      formData.append("url", url)
    } else if (mode === "text") {
      formData.append("text", textInput)
    } else if (files.length > 0) {
      formData.append("file", files[0].file)
      formData.append("text", "")
    }

    try {
      const res = await fetch("/api/ai/product-import", { method: "POST", body: formData })
      const data = await res.json()
      removeLoading()
      setLoading(false)

      if (data.products && data.products.length > 0) {
        setResult(data)
        setSelectedProducts(new Set(data.products.map((_: unknown, i: number) => i)))
        addMessage("ai", (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-5 w-5 text-zanzibar-600" />
              <span className="font-semibold text-zanzibar-800">
                Found {data.products.length} products
              </span>
            </div>
            <p>I've extracted {data.products.length} products from your {data.source}. Review them below and select which ones to import.</p>
          </div>
        ))
      } else {
        addMessage("ai", "I couldn't extract any products from that source. Try a different URL or upload a more detailed catalog.")
      }
    } catch {
      removeLoading()
      setLoading(false)
      addMessage("ai", "Network error. Please check your connection and try again.")
    }
  }

  function toggleProduct(index: number) {
    setSelectedProducts((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function selectAll() {
    if (result) {
      setSelectedProducts(new Set(result.products.map((_, i) => i)))
    }
  }

  function deselectAll() {
    setSelectedProducts(new Set())
  }

  function handleImport() {
    setImported(true)
    addMessage("system", `${selectedProducts.size} products imported successfully!`)
  }

  function handleReset() {
    setResult(null)
    setSelectedProducts(new Set())
    setImported(false)
    setUrl("")
    setTextInput("")
    setFiles([])
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Conversation */}
      <div className="mb-6 max-h-[350px] overflow-y-auto space-y-4 px-1">
        <MessageList messages={messages} />
      </div>

      {/* Input Section */}
      {!result && !loading && (
        <Card className="border-zanzibar-100">
          <CardContent className="p-5">
            <Tabs
              tabs={[
                {
                  id: "url",
                  label: "Website URL",
                  content: (
                    <div className="space-y-3 pt-3">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            placeholder="https://example.com/products"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && url && handleExtract()}
                          />
                        </div>
                        <Button onClick={handleExtract} disabled={!url}>
                          <Globe className="mr-1.5 h-4 w-4" /> Extract
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Paste a product catalog page or supplier website URL
                      </p>
                    </div>
                  ),
                },
                {
                  id: "pdf",
                  label: "PDF Catalog",
                  content: (
                    <div className="pt-3">
                      <FileUploadZone
                        label="Upload PDF catalog"
                        description="Drop your product catalog PDF here"
                        accept=".pdf"
                        multiple={false}
                        onFilesChange={setFiles}
                      />
                      {files.length > 0 && (
                        <Button onClick={handleExtract} className="mt-3 w-full">
                          <Upload className="mr-1.5 h-4 w-4" /> Extract Products from PDF
                        </Button>
                      )}
                    </div>
                  ),
                },
                {
                  id: "text",
                  label: "Paste Text",
                  content: (
                    <div className="space-y-3 pt-3">
                      <textarea
                        rows={6}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
                        placeholder="Paste product list here...
Example:
Portland Cement 42.5N - $12.50/bag
Steel Rebar 16mm - $850/ton
Ceramic Floor Tiles 60x60 - $18.90/m²"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                      />
                      <Button onClick={handleExtract} disabled={!textInput}>
                        <List className="mr-1.5 h-4 w-4" /> Extract Products
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="border-zanzibar-100">
          <CardContent className="p-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-zanzibar-600" />
            <p className="mt-3 text-sm text-gray-600">Analyzing source content and extracting products...</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card className="border-zanzibar-200 mt-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-zanzibar-600" />
                <h3 className="font-semibold text-gray-900">
                  {result.products.length} Products Found
                </h3>
                <Badge variant="secondary" className="text-xs">
                  Source: {result.source}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-xs">
                  <Tag className="mr-1 h-3 w-3" /> {result.suggestedCategory}
                </Badge>
              </div>
            </div>

            {/* Selection Controls */}
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-500">
                {selectedProducts.size} of {result.products.length} selected
                {result.totalEstimatedValue > 0 && (
                  <span className="ml-2 text-gray-400">
                    | Est. total: ${result.totalEstimatedValue.toLocaleString()}
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-xs text-zanzibar-600 hover:text-zanzibar-800">
                  Select All
                </button>
                <button onClick={deselectAll} className="text-xs text-gray-500 hover:text-gray-700">
                  Deselect All
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="w-10 px-3 py-2.5"></th>
                    <th className="px-3 py-2.5 text-left font-medium text-gray-500">Product</th>
                    <th className="px-3 py-2.5 text-left font-medium text-gray-500 hidden md:table-cell">Category</th>
                    <th className="px-3 py-2.5 text-right font-medium text-gray-500">Price</th>
                    <th className="px-3 py-2.5 text-left font-medium text-gray-500 hidden sm:table-cell">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {result.products.slice(0, 100).map((product, i) => (
                    <tr
                      key={i}
                      className={cn(
                        "hover:bg-gray-50 cursor-pointer transition-colors",
                        selectedProducts.has(i) && "bg-zanzibar-50/50"
                      )}
                      onClick={() => toggleProduct(i)}
                    >
                      <td className="px-3 py-2.5">
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                            selectedProducts.has(i)
                              ? "border-zanzibar-600 bg-zanzibar-600 text-white"
                              : "border-gray-300"
                          )}
                        >
                          {selectedProducts.has(i) && <Check className="h-3 w-3" />}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-gray-900 truncate max-w-[250px]">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[250px]">
                          {product.description?.substring(0, 60)}
                          {product.sku && <span className="ml-2 text-gray-300">{product.sku}</span>}
                        </p>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600 hidden md:table-cell">
                        {product.category?.substring(0, 20) || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-gray-900">
                        {product.price > 0 ? `${product.currency || "USD"} ${product.price.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-gray-500 text-xs hidden sm:table-cell">
                        {product.unit || "piece"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            {!imported ? (
              <div className="flex flex-wrap gap-3 border-t pt-4">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <X className="mr-1.5 h-4 w-4" /> Discard
                </Button>
                <Button variant="secondary" size="sm" onClick={handleReset}>
                  <Upload className="mr-1.5 h-4 w-4" /> New Import
                </Button>
                <Button
                  size="sm"
                  className="bg-gold-500 hover:bg-gold-600 text-white ml-auto"
                  onClick={handleImport}
                  disabled={selectedProducts.size === 0}
                >
                  <Import className="mr-1.5 h-4 w-4" /> Import {selectedProducts.size} Products
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  {selectedProducts.size} products imported successfully!
                </span>
                <Button variant="outline" size="sm" className="ml-auto" onClick={handleReset}>
                  Import More
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
