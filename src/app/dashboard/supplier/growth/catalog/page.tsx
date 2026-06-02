"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs } from "@/components/ui/tabs"
import {
  Package, Sparkles, Loader2, Check, CheckCircle, Upload,
  Globe, List, Database, Import
} from "lucide-react"
import { FileUploadZone, type UploadedFileInfo } from "@/components/ai/file-upload-zone"
import type { CatalogProduct, CatalogResult } from "@/lib/ai-growth/types"

function cn(...c: (string | boolean | undefined | null)[]) { return c.filter(Boolean).join(" ") }

export default function CatalogGeneratorPage() {
  const [mode, setMode] = useState<"url" | "file" | "text">("text")
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [files, setFiles] = useState<UploadedFileInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CatalogResult | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  async function handleExtract() {
    const hasContent = mode === "url" ? url : mode === "text" ? text : files.length > 0
    if (!hasContent) return
    setLoading(true)
    const formData = new FormData()
    formData.append("text", mode === "text" ? text : mode === "url" ? `URL: ${url}` : "")
    formData.append("source", mode === "url" ? url : files[0]?.name || "manual")
    if (mode === "file" && files[0]) formData.append("file", files[0].file)
    try {
      const res = await fetch("/api/ai-growth/catalog", { method: "POST", body: formData })
      const data = await res.json()
      setResult(data)
      setSelected(new Set(data.products?.map((_: any, i: number) => i) || []))
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold text-gray-900">AI Product Catalog Generator</h2><p className="text-sm text-gray-500">Extract, describe, and categorize products from any source.</p></div>

      {!result && !loading && (
        <Card>
          <CardContent className="p-5">
            <Tabs tabs={[
              { id: "text", label: "Paste Text", content: <div className="pt-3 space-y-3"><textarea rows={6} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" placeholder="Paste product list...&#10;Portland Cement 42.5N - $12.50/bag&#10;Steel Rebar 16mm - $850/ton" value={text} onChange={e => setText(e.target.value)} /><Button onClick={handleExtract} disabled={!text}><Sparkles className="mr-1.5 h-4 w-4" /> Extract Products</Button></div> },
              { id: "url", label: "Website URL", content: <div className="pt-3 space-y-3"><div className="flex gap-2"><div className="flex-1"><input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="https://example.com/products" value={url} onChange={e => setUrl(e.target.value)} /></div><Button onClick={handleExtract} disabled={!url}><Globe className="mr-1.5 h-4 w-4" /> Extract</Button></div></div> },
              { id: "file", label: "Upload File", content: <div className="pt-3"><FileUploadZone label="Upload product catalog" description="PDF, Excel, or CSV" multiple={false} onFilesChange={setFiles} />{files.length > 0 && <Button onClick={handleExtract} className="mt-3 w-full"><Upload className="mr-1.5 h-4 w-4" /> Extract from File</Button>}</div> },
            ]} />
          </CardContent>
        </Card>
      )}

      {loading && <Card><CardContent className="p-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-zanzibar-600" /><p className="mt-3 text-sm text-gray-600">Extracting products...</p></CardContent></Card>}

      {result && (
        <Card><CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Package className="h-5 w-5 text-zanzibar-600" /><h3 className="font-semibold text-gray-900">{result.products.length} Products</h3><Badge variant="secondary" className="text-xs">Source: {result.source?.substring(0, 30)}</Badge></div>
            <div className="flex gap-2 text-sm"><button onClick={() => setSelected(new Set(result.products.map((_, i) => i)))} className="text-zanzibar-600 text-xs">All</button><button onClick={() => setSelected(new Set())} className="text-gray-500 text-xs">None</button></div>
          </div>
          <p className="text-sm text-gray-500">{selected.size} selected</p>

          <div className="overflow-x-auto rounded-lg border max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50"><th className="w-8 px-3 py-2"></th><th className="px-3 py-2 text-left font-medium text-gray-500">Product</th><th className="px-3 py-2 text-left font-medium text-gray-500 hidden sm:table-cell">Category</th><th className="px-3 py-2 text-right font-medium text-gray-500">Price</th></tr></thead>
              <tbody className="divide-y">
                {result.products.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 cursor-pointer" onClick={() => { const n = new Set(selected); n.has(i) ? n.delete(i) : n.add(i); setSelected(n) }}>
                    <td className="px-3 py-2"><div className={cn("flex h-4 w-4 items-center justify-center rounded border", selected.has(i) ? "border-zanzibar-600 bg-zanzibar-600 text-white" : "border-gray-300")}>{selected.has(i) && <Check className="h-3 w-3" />}</div></td>
                    <td className="px-3 py-2"><p className="font-medium text-gray-900 text-xs">{p.name}</p><p className="text-xs text-gray-400 truncate max-w-[200px]">{p.description?.substring(0, 60)}</p></td>
                    <td className="px-3 py-2 text-gray-600 text-xs hidden sm:table-cell">{p.category?.substring(0, 20)}</td>
                    <td className="px-3 py-2 text-right text-xs font-medium">{p.price ? `${p.currency || "USD"} ${p.price}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 border-t pt-4">
            <Button variant="outline" size="sm" onClick={() => setResult(null)}>New Import</Button>
            <Button size="sm" className="bg-gold-500 hover:bg-gold-600 text-white ml-auto" disabled={selected.size === 0}><Database className="mr-1.5 h-4 w-4" /> Import {selected.size} Products</Button>
          </div>
        </CardContent></Card>
      )}
    </div>
  )
}
