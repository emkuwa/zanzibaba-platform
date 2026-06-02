"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText, Upload, Check, CheckCircle, Loader2, Building2,
  ClipboardList, DollarSign, MapPin, Clock, Users, Sparkles,
  ArrowRight, ShoppingCart, Edit3, Send
} from "lucide-react"
import { MessageList, type Message } from "./chat-message"
import { FileUploadZone, type UploadedFileInfo } from "./file-upload-zone"
import type { RFQDraft } from "@/lib/ai/rfq-assistant"

const PROJECT_TYPES = [
  "Hotel Construction",
  "Resort Development",
  "Villa Construction",
  "Commercial Building",
  "Residential Apartment",
  "Hospitality Renovation",
  "Infrastructure",
  "Industrial",
  "Mixed-Use Development",
  "Other",
]

export default function RFQAssistant() {
  const [files, setFiles] = useState<UploadedFileInfo[]>([])
  const [textInput, setTextInput] = useState("")
  const [draft, setDraft] = useState<RFQDraft | null>(null)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: (
        <div>
          <p className="font-semibold text-zanzibar-800 mb-1">
            AI RFQ Assistant
          </p>
          <p>
            Upload your BOQ, floor plans, or project PDF, or describe what you need.
            I'll analyze your requirements and create a structured RFQ draft automatically.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            No more manual forms — just upload and go.
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

  async function handleGenerate() {
    if (!textInput && files.length === 0) return

    const fileCount = files.length
    addMessage("user", fileCount > 0
      ? `${fileCount} file${fileCount > 1 ? "s" : ""} uploaded + description provided`
      : textInput.substring(0, 80) + "..."
    )

    addLoading()
    setLoading(true)

    const formData = new FormData()
    formData.append("text", textInput)
    for (const f of files) {
      formData.append("files", f.file)
    }

    try {
      const res = await fetch("/api/ai/rfq-assistant", { method: "POST", body: formData })
      const data = await res.json()

      removeLoading()
      setLoading(false)

      if (data.draft) {
        setDraft(data.draft)
        addMessage("ai", (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-zanzibar-800">RFQ Draft Ready!</span>
            </div>
            <p>I've analyzed your requirements. Review the draft below and submit when ready.</p>
          </div>
        ))
      } else {
        addMessage("ai", "Sorry, I couldn't process your request. Please try again with more details.")
      }
    } catch {
      removeLoading()
      setLoading(false)
      addMessage("ai", "Network error. Please check your connection and try again.")
    }
  }

  function handleSubmitRFQ() {
    addMessage("system", "RFQ submitted! Suppliers will start quoting shortly.")
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Conversation */}
      <div className="mb-6 max-h-[400px] overflow-y-auto space-y-4 px-1">
        <MessageList messages={messages} />
      </div>

      {/* Input Section */}
      {!draft && (
        <Card className="border-zanzibar-100">
          <CardContent className="p-5 space-y-4">
            <FileUploadZone
              label="Upload project documents"
              description="Drop your BOQ, floor plans, or PDFs here"
              onFilesChange={setFiles}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400">
                <span className="bg-white px-2">Or type your requirements</span>
              </div>
            </div>

            <div>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
                placeholder="Describe your project requirements... e.g. I need 500 bags of Portland Cement 42.5N delivered to Nungwi, Zanzibar for a hotel construction project."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {files.length > 0 && `${files.length} file${files.length > 1 ? "s" : ""} selected`}
              </p>
              <Button
                onClick={handleGenerate}
                disabled={(!textInput && files.length === 0) || loading}
                className="bg-zanzibar-600 hover:bg-zanzibar-700"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate RFQ Draft</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RFQ Draft Result */}
      {draft && (
        <Card className="border-zanzibar-200 mt-6">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-zanzibar-600" />
                <h3 className="font-semibold text-gray-900">RFQ Draft</h3>
              </div>
              <Badge variant="warning" className="text-xs">
                <Sparkles className="mr-1 h-3 w-3" /> AI Generated Draft
              </Badge>
            </div>

            {/* Title & Project Type */}
            <div className="rounded-lg bg-gray-50 p-4 space-y-2">
              <Input
                label="RFQ Title"
                defaultValue={draft.title}
                className="font-semibold"
              />
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Building2 className="h-4 w-4 text-zanzibar-600" />
                  {draft.projectType}
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                  <MapPin className="h-4 w-4 text-zanzibar-600" />
                  {draft.deliveryLocation}
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                  <DollarSign className="h-4 w-4 text-zanzibar-600" />
                  {draft.budgetMin > 0 ? `${draft.currency} ${draft.budgetMin.toLocaleString()} - ${draft.budgetMax.toLocaleString()}` : "Budget not specified"}
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="h-4 w-4 text-zanzibar-600" />
                  {draft.timeline}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Description</p>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                defaultValue={draft.description}
              />
            </div>

            {/* Requirements Table */}
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                <ShoppingCart className="inline h-3 w-3 mr-1" /> Procurement Requirements
              </p>
              {draft.requirements.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-2.5 text-left font-medium text-gray-500">Item</th>
                        <th className="px-4 py-2.5 text-right font-medium text-gray-500">Qty</th>
                        <th className="px-4 py-2.5 text-left font-medium text-gray-500">Unit</th>
                        <th className="px-4 py-2.5 text-left font-medium text-gray-500">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {draft.requirements.map((req, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2.5 font-medium text-gray-900">{req.item}</td>
                          <td className="px-4 py-2.5 text-right text-gray-700">{req.quantity || "—"}</td>
                          <td className="px-4 py-2.5 text-gray-600">{req.unit}</td>
                          <td className="px-4 py-2.5 text-gray-500 text-xs">{req.notes || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No specific line items extracted. Edit the description above with quantities.</p>
              )}
            </div>

            {/* Suggested Categories */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5">
                  <Badge variant="secondary" className="text-xs mr-1" /> Suggested Categories
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5">
                  <Users className="inline h-3 w-3 mr-1" /> Suggested Suppliers
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.suggestedSuppliers.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 border-t pt-4">
              <Button variant="outline" size="sm" onClick={() => setDraft(null)}>
                <Edit3 className="mr-1.5 h-4 w-4" /> Start Over
              </Button>
              <Button variant="secondary" size="sm">
                <Upload className="mr-1.5 h-4 w-4" /> Upload Revised BOQ
              </Button>
              <Button size="sm" className="bg-gold-500 hover:bg-gold-600 text-white" onClick={handleSubmitRFQ}>
                <Send className="mr-1.5 h-4 w-4" /> Submit RFQ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
