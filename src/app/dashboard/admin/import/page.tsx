"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { parseCSV, generateSampleCSV } from "@/lib/import/csv-parser"
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react"

interface PreviewRow {
  index: number
  data: Record<string, string>
}

interface ImportResult {
  total: number
  imported: number
  failed: number
  skipped: number
  errors: { row: number; message: string }[]
  warnings: { row: number; message: string }[]
}

const defaultSupplierMapping = {
  companyName: "companyName",
  email: "email",
  phone: "phone",
  city: "city",
  country: "country",
  description: "description",
  website: "website",
  categorySlug: "categorySlug",
}

const defaultProductMapping = {
  name: "name",
  supplierEmail: "supplierEmail",
  categorySlug: "categorySlug",
  description: "description",
  price: "price",
  moq: "moq",
  unit: "unit",
}


type ImportTab = "suppliers" | "products"

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState<ImportTab>("suppliers")
  const [csvContent, setCsvContent] = useState<string | null>(null)
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>(
    defaultSupplierMapping
  )
  const [isUploading, setIsUploading] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleTabChange(tab: ImportTab) {
    setActiveTab(tab)
    setCsvContent(null)
    setPreviewRows([])
    setHeaders([])
    setImportResult(null)
    setProgress(0)
    setMapping(
      tab === "suppliers" ? defaultSupplierMapping : defaultProductMapping
    )
  }

  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCsvContent(content)
      setImportResult(null)
      setProgress(0)

      const rows = parseCSV(content)
      const cols = rows.length > 0 ? Object.keys(rows[0]) : []

      setHeaders(cols)
      setPreviewRows(
        rows.slice(0, 5).map((data, i) => ({ index: i, data }))
      )

      if (cols.length > 0) {
        const autoMap: Record<string, string> = {}
        const mapKeys =
          activeTab === "suppliers"
            ? Object.keys(defaultSupplierMapping)
            : Object.keys(defaultProductMapping)

        for (const key of mapKeys) {
          const match = cols.find(
            (c) => c.toLowerCase().replace(/[\s_-]/g, "") === key.toLowerCase()
          )
          autoMap[key] = match || ""
        }
        setMapping(autoMap)
      }
    }
    reader.readAsText(file)
  }, [activeTab])

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function downloadSample() {
    const csv = generateSampleCSV(activeTab)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sample-${activeTab}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport() {
    if (!csvContent) return

    setIsUploading(true)
    setProgress(10)
    setImportResult(null)

    try {
      setProgress(30)

      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: csvContent,
          mapping,
          type: activeTab,
        }),
      })

      setProgress(80)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Import failed")
      }

      const result: ImportResult = await res.json()
      setImportResult(result)
      setProgress(100)
    } catch (error) {
      const errResult: ImportResult = {
        total: 0,
        imported: 0,
        failed: 0,
        skipped: 0,
        warnings: [],
        errors: [{
          row: 0,
          message: error instanceof Error ? error.message : "Import failed",
        }],
      }
      setImportResult(errResult)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Import Data</h1>
        <p className="text-gray-500">
          Import suppliers and products from CSV files
        </p>
      </div>

      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        <button
          onClick={() => handleTabChange("suppliers")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "suppliers"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Import Suppliers
        </button>
        <button
          onClick={() => handleTabChange("products")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "products"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Import Products
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV</CardTitle>
              <CardDescription>
                Drag and drop your CSV file or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors",
                  dragOver
                    ? "border-zanzibar-500 bg-zanzibar-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Upload className="mb-4 h-8 w-8 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  Drop your CSV file here
                </p>
                <p className="mt-1 text-xs text-gray-500">or click to browse</p>
              </div>

              {headers.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <FileSpreadsheet className="h-4 w-4 text-zanzibar-600" />
                  <span>
                    Found <strong>{headers.length}</strong> columns and{" "}
                    <strong>
                      {csvContent ? parseCSV(csvContent).length : 0}
                    </strong>{" "}
                    rows
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {headers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Column Mapping</CardTitle>
                <CardDescription>
                  Map CSV columns to Zanzibaba fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.keys(mapping).map((field) => (
                    <div
                      key={field}
                      className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"
                    >
                      <div className="rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                        {field === "categorySlug"
                          ? "Category"
                          : field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <select
                        value={mapping[field] || ""}
                        onChange={(e) =>
                          setMapping((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
                      >
                        <option value="">-- Skip --</option>
                        {headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {previewRows.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  First {previewRows.length} rows of your data
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-sm text-gray-500">
                        <th className="text-left py-3 px-4 font-medium">#</th>
                        {headers.map((h) => (
                          <th
                            key={h}
                            className="text-left py-3 px-4 font-medium whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row) => (
                        <tr
                          key={row.index}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="py-2.5 px-4 text-sm text-gray-500">
                            {row.index + 1}
                          </td>
                          {headers.map((h) => (
                            <td
                              key={h}
                              className="py-2.5 px-4 text-sm max-w-[200px] truncate"
                            >
                              {row.data[h] || (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {previewRows.length > 0 && (
            <div className="space-y-4">
              {progress > 0 && progress < 100 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Importing...</span>
                    <span className="font-medium text-zanzibar-600">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-zanzibar-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  onClick={handleImport}
                  disabled={isUploading || !csvContent}
                >
                  {isUploading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Import All
                </Button>
                <Button variant="outline" onClick={downloadSample}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Sample CSV
                </Button>
              </div>
            </div>
          )}

          {importResult && (
            <Card>
              <CardHeader>
                <CardTitle>Import Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-700">
                        {importResult.imported}
                      </p>
                      <p className="text-xs text-green-600">Imported</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold text-red-700">
                        {importResult.failed}
                      </p>
                      <p className="text-xs text-red-600">Failed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-700">
                        {importResult.skipped}
                      </p>
                      <p className="text-xs text-yellow-600">Skipped</p>
                    </div>
                  </div>
                </div>

                {importResult.warnings.length > 0 && (
                  <div className="space-y-1 mb-3">
                    <p className="text-sm font-medium text-amber-700">
                      Warnings ({importResult.warnings.length})
                    </p>
                    <div className="max-h-32 overflow-y-auto rounded-lg bg-amber-50 p-3">
                      {[...new Map(importResult.warnings.map(w => [w.row, w])).values()].map((w, i) => (
                        <p key={i} className="text-sm text-amber-700 font-mono">
                          Row {w.row}: {w.message}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {importResult.errors.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      Errors ({importResult.errors.length})
                    </p>
                    <div className="max-h-48 overflow-y-auto rounded-lg bg-red-50 p-3">
                      {importResult.errors.map((err, i) => (
                        <p
                          key={i}
                          className="text-sm text-red-700 font-mono"
                        >
                          Row {err.row}: {err.message}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-2">
                <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">1</Badge>
                <span>Download the sample CSV template</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">2</Badge>
                <span>Fill in your data following the template format</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">3</Badge>
                <span>Upload your CSV file</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">4</Badge>
                <span>Map CSV columns to Zanzibaba fields</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">5</Badge>
                <span>Review the preview and click Import All</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CSV Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>• File must be in CSV format</p>
              <p>• First row must be column headers</p>
              <p>• Required fields depend on mapping</p>
              <p>• Max file size: 10MB</p>
              <p>• UTF-8 encoding recommended</p>
              <p>• Duplicate emails will be skipped</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
