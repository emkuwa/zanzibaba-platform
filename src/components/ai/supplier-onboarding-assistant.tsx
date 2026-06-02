"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  ArrowRight, Check, CheckCircle, Copy, Eye, FileText,
  Loader2, Rocket, Sparkles, Tags, Target, Globe, Building2,
  Package, Award, ChevronRight
} from "lucide-react"
import { MessageList, StepIndicator, type Message } from "./chat-message"
import type { CompanyInfo, SupplierProfileDraft } from "@/lib/ai/supplier-onboarding"

const TOTAL_STEPS = 6

const QUESTIONS = [
  { field: "companyName", label: "Company Name", placeholder: "e.g. Zanzibar Building Supplies Ltd" },
  { field: "businessType", label: "Business Type", type: "select", options: ["Manufacturer", "Distributor", "Wholesaler", "Retailer", "Importer", "Exporter", "Contractor", "Service Provider"] },
  { field: "description", label: "Tell us about your company", type: "textarea", placeholder: "What products do you supply? Who are your customers? What makes you different?" },
  { field: "products", label: "Products you supply", type: "multiline", placeholder: "List products one per line (e.g. Portland Cement 42.5N, Steel Rebar 16mm, Ceramic Tiles 60x60)" },
  { field: "location", label: "Location", type: "location", placeholder: "City" },
  { field: "contact", label: "Contact Details", type: "contact" },
]

interface OnboardingState {
  step: number
  companyName: string
  businessType: string
  yearEstablished: string
  location: string
  city: string
  country: string
  contactName: string
  email: string
  phone: string
  website: string
  description: string
  productCategories: string[]
  productList: string
  certifications: string
  targetMarkets: string[]
}

const INITIAL_STATE: OnboardingState = {
  step: 0,
  companyName: "",
  businessType: "",
  yearEstablished: "",
  location: "",
  city: "",
  country: "Tanzania",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  description: "",
  productCategories: [],
  productList: "",
  certifications: "",
  targetMarkets: ["Zanzibar"],
}

export default function SupplierOnboardingAssistant() {
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: (
        <div>
          <p className="font-semibold text-zanzibar-800 mb-1">
            Welcome! Let's create your supplier profile.
          </p>
          <p>
            I'll guide you through {TOTAL_STEPS} quick steps. At the end, I'll generate a ready-to-publish
            profile with SEO description, categories, and keywords.
          </p>
          <p className="mt-2 text-gray-500">Ready? Let's start with your company name.</p>
        </div>
      ),
    },
  ])
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState<SupplierProfileDraft | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedSEO, setCopiedSEO] = useState(false)

  const currentStep = state.step

  function updateField(field: keyof OnboardingState, value: unknown) {
    setState((prev) => ({ ...prev, [field]: value }))
  }

  const addUserMessage = useCallback((content: string | React.ReactNode) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content },
    ])
  }, [])

  const addAIMessage = useCallback((content: string | React.ReactNode) => {
    setMessages((prev) => [
      ...prev,
      { id: `ai-${Date.now()}`, role: "ai", content },
    ])
  }, [])

  function advanceStep() {
    setState((prev) => ({ ...prev, step: prev.step + 1 }))
  }

  function handleCompanyName(value: string) {
    updateField("companyName", value)
    addUserMessage(value)
    addAIMessage(
      <div>
        <p>Great! <strong>{value}</strong> sounds like a solid company.</p>
        <p className="mt-1">What type of business are you? This helps us categorize your profile.</p>
      </div>
    )
    advanceStep()
  }

  function handleBusinessType(value: string) {
    updateField("businessType", value)
    addUserMessage(value)
    addAIMessage(
      <div>
        <p>
          {value === "Manufacturer"
            ? "Excellent! Manufacturers get priority in search results."
            : value === "Distributor" || value === "Wholesaler"
              ? "Perfect. Distributors are in high demand for large projects."
              : "Great choice."}
        </p>
        <p className="mt-1">Now, describe your company. What products do you supply? Who are your customers?</p>
      </div>
    )
    advanceStep()
  }

  function handleDescription(value: string) {
    updateField("description", value)
    addUserMessage(value.substring(0, 80) + "...")
    addAIMessage(
      <div>
        <p>Thanks for the detail! Now list your products — one per line.</p>
        <p className="mt-1 text-sm text-gray-500">
          Example:<br />
          Portland Cement 42.5N (50kg bags)<br />
          Steel Rebar 16mm (12m length)<br />
          Ceramic Floor Tiles 60x60
        </p>
      </div>
    )
    advanceStep()
  }

  function handleProducts(value: string) {
    updateField("productList", value)
    const lineCount = value.split("\n").filter((l) => l.trim()).length
    addUserMessage(`${lineCount} products listed`)
    const aiMsg = lineCount > 5
      ? "Impressive catalog! Where are you based?"
      : "Good start. You can always add more later. Where are you located?"
    addAIMessage(
      <div>
        <p>{aiMsg}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Input
            placeholder="City (e.g. Stone Town)"
            onChange={(e) => updateField("city", e.target.value)}
            className="h-9 text-sm"
          />
          <Select
            placeholder="Country"
            options={[
              { value: "Tanzania", label: "Tanzania" },
              { value: "Kenya", label: "Kenya" },
              { value: "Uganda", label: "Uganda" },
              { value: "Rwanda", label: "Rwanda" },
              { value: "Other", label: "Other" },
            ]}
            onChange={(e) => updateField("country", e.target.value)}
          />
        </div>
      </div>
    )
    advanceStep()
  }

  function handleLocation(city: string, country: string) {
    updateField("city", city)
    updateField("country", country)
    addUserMessage(`${city}, ${country}`)
    addAIMessage(
      <div>
        <p>Almost done! Just need your contact details so buyers can reach you.</p>
        <div className="mt-3 space-y-2">
          <Input placeholder="Contact person name" onChange={(e) => updateField("contactName", e.target.value)} className="h-9 text-sm" />
          <Input placeholder="Email address" type="email" onChange={(e) => updateField("email", e.target.value)} className="h-9 text-sm" />
          <Input placeholder="Phone number" type="tel" onChange={(e) => updateField("phone", e.target.value)} className="h-9 text-sm" />
          <Input placeholder="Website (optional)" onChange={(e) => updateField("website", e.target.value)} className="h-9 text-sm" />
        </div>
      </div>
    )
    advanceStep()
  }

  function handleContact() {
    const info: CompanyInfo = {
      companyName: state.companyName,
      businessType: state.businessType,
      yearEstablished: state.yearEstablished,
      location: `${state.city}, ${state.country}`,
      city: state.city,
      country: state.country,
      contactName: state.contactName,
      email: state.email,
      phone: state.phone,
      website: state.website,
      description: state.description,
      productCategories: state.productCategories,
      productList: state.productList.split("\n").filter((l) => l.trim()).map((name) => ({
        name: name.trim(),
        description: "",
      })),
      certifications: state.certifications.split("\n").filter((l) => l.trim()),
      targetMarkets: state.targetMarkets,
    }

    addUserMessage("All set! Generate my profile please.")
    setMessages((prev) => [
      ...prev,
      { id: "loading", role: "ai", type: "loading", content: "" },
    ])
    setLoading(true)

    fetch("/api/ai/supplier-onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(info),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        setMessages((prev) => prev.filter((m) => m.id !== "loading"))
        if (data.draft) {
          setDraft(data.draft)
          addAIMessage(
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="h-5 w-5 text-zanzibar-600" />
                <span className="font-semibold text-zanzibar-800">Your profile is ready!</span>
              </div>
              <p>Here's your ready-to-publish supplier profile. Review it below and make any edits you'd like.</p>
            </div>
          )
        } else {
          addAIMessage("Sorry, I encountered an error generating your profile. Please try again.")
        }
      })
      .catch(() => {
        setLoading(false)
        setMessages((prev) => prev.filter((m) => m.id !== "loading"))
        addAIMessage("Network error. Please check your connection and try again.")
      })

    setState((prev) => ({ ...prev, step: prev.step + 1 }))
  }

  function handleSkip() {
    handleContact()
  }

  function renderStepInput(): React.ReactNode {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Input
              placeholder="e.g. Zanzibar Building Supplies Ltd"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                  handleCompanyName((e.target as HTMLInputElement).value.trim())
                }
              }}
            />
            <p className="mt-2 text-xs text-gray-400">Press Enter to continue</p>
          </div>
        )

      case 1:
        return (
          <div className="grid grid-cols-2 gap-2">
            {["Manufacturer", "Distributor", "Wholesaler", "Retailer", "Importer", "Exporter", "Contractor", "Service Provider"].map((type) => (
              <button
                key={type}
                onClick={() => handleBusinessType(type)}
                className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-zanzibar-400 hover:bg-zanzibar-50 hover:text-zanzibar-700"
              >
                {type}
              </button>
            ))}
          </div>
        )

      case 2:
        return (
          <div className="space-y-2">
            <textarea
              rows={4}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
              placeholder="e.g. We supply premium building materials to hotels, resorts, and villa developers across Zanzibar..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  const val = (e.target as HTMLTextAreaElement).value.trim()
                  if (val) handleDescription(val)
                }
              }}
            />
            <p className="text-xs text-gray-400">Press Shift+Enter for new line, Enter to continue</p>
          </div>
        )

      case 3:
        return (
          <div className="space-y-2">
            <textarea
              rows={5}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
              placeholder="Portland Cement 42.5N (50kg bags)
Steel Rebar 16mm (12m length)
Ceramic Floor Tiles 60x60
PVC Pipes 4 inch
Roofing Sheets Iron"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  const val = (e.target as HTMLTextAreaElement).value.trim()
                  if (val) handleProducts(val)
                }
              }}
            />
            <p className="text-xs text-gray-400">One product per line. Press Enter to continue.</p>
          </div>
        )

      case 4:
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="City (e.g. Stone Town)"
                autoFocus
                onChange={(e) => updateField("city", e.target.value)}
              />
              <Select
                placeholder="Country"
                options={[
                  { value: "Tanzania", label: "Tanzania" },
                  { value: "Kenya", label: "Kenya" },
                  { value: "Uganda", label: "Uganda" },
                  { value: "Rwanda", label: "Rwanda" },
                  { value: "Other", label: "Other" },
                ]}
                onChange={(e) => updateField("country", e.target.value)}
              />
            </div>
            <Button
              onClick={() => handleLocation(state.city || "Zanzibar", state.country)}
              disabled={!state.city}
              size="sm"
            >
              Continue <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )

      case 5:
        return (
          <div className="space-y-2">
            <Input
              placeholder="Contact person name"
              onChange={(e) => updateField("contactName", e.target.value)}
            />
            <Input
              placeholder="Email address"
              type="email"
              onChange={(e) => updateField("email", e.target.value)}
            />
            <Input
              placeholder="Phone number"
              type="tel"
              onChange={(e) => updateField("phone", e.target.value)}
            />
            <Input
              placeholder="Website (optional)"
              onChange={(e) => updateField("website", e.target.value)}
            />
            <div className="flex gap-2 pt-1">
              <Button onClick={handleContact} disabled={!state.email} size="sm">
                <Rocket className="mr-1.5 h-4 w-4" /> Generate Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                Skip optional fields
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Steps Progress */}
      {currentStep < TOTAL_STEPS && (
        <div className="mb-6">
          <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          <p className="mt-2 text-center text-xs text-gray-400">
            Step {currentStep + 1} of {TOTAL_STEPS}
          </p>
        </div>
      )}

      {/* Conversation */}
      <div className="mb-6 max-h-[500px] overflow-y-auto space-y-4 px-1">
        <MessageList messages={messages} />
      </div>

      {/* Input Area */}
      {currentStep < TOTAL_STEPS && (
        <Card className="border-zanzibar-100">
          <CardContent className="p-4">{renderStepInput()}</CardContent>
        </Card>
      )}

      {/* Profile Draft Result */}
      {draft && (
        <Card className="border-zanzibar-200 mt-6">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold text-gray-900">Ready-to-Publish Profile</h3>
              </div>
              <Badge variant="success" className="text-xs">
                <Sparkles className="mr-1 h-3 w-3" /> AI Generated
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Company Name & Slug */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Company</p>
                <p className="text-lg font-bold text-gray-900">{draft.companyName}</p>
                <p className="text-sm text-gray-400">zanzibaba.com/suppliers/{draft.slug}</p>
              </div>

              {/* Short Description */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                  <FileText className="inline h-3 w-3 mr-1" /> Short Description
                </p>
                <p className="text-sm text-gray-700">{draft.shortDescription}</p>
              </div>

              {/* SEO Description */}
              <div className="rounded-lg bg-zanzibar-50 p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-zanzibar-700">SEO Meta Description</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(draft.seoDescription)
                      setCopiedSEO(true)
                      setTimeout(() => setCopiedSEO(false), 2000)
                    }}
                    className="text-xs text-zanzibar-600 hover:text-zanzibar-800"
                  >
                    {copiedSEO ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <p className="text-sm text-zanzibar-800">{draft.seoDescription}</p>
                <p className="mt-1 text-xs text-zanzibar-500">{draft.seoDescription.length} / 160 characters</p>
              </div>

              {/* Categories */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5">
                  <Tags className="inline h-3 w-3 mr-1" /> Categories
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.categories.map((cat) => (
                    <Badge key={cat.slug} variant="secondary" className="text-xs">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5">
                  <Target className="inline h-3 w-3 mr-1" /> Keywords
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Company Summary */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                  <Building2 className="inline h-3 w-3 mr-1" /> Company Summary
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{draft.companySummary}</p>
              </div>

              {/* Products */}
              {draft.products.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5">
                    <Package className="inline h-3 w-3 mr-1" /> Products ({draft.products.length})
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {draft.products.map((p, i) => (
                      <div key={i} className="rounded-lg border bg-white px-3 py-2 text-xs text-gray-700">
                        {p.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Verification Score */}
              <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
                <Award className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  Suggested Trust Score: {draft.suggestedVerificationScore}/100
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3 border-t pt-4">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${draft.shortDescription}\n\n${draft.companySummary}\n\nSEO: ${draft.seoDescription}`
                  )
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                variant="outline"
                size="sm"
              >
                {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
                Copy to Clipboard
              </Button>
              <Button size="sm">
                <Eye className="mr-1.5 h-4 w-4" /> Preview Profile
              </Button>
              <Button size="sm" className="bg-gold-500 hover:bg-gold-600 text-white">
                <Rocket className="mr-1.5 h-4 w-4" /> Publish Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
