"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs } from "@/components/ui/tabs"
import RFQAssistant from "@/components/ai/rfq-assistant"
import {
  FileText, Check, ChevronRight, Upload, Building2, DollarSign,
  MapPin, Clock, MessageSquare, Shield, Star, HelpCircle, Users,
  ArrowRight, Plus, Download, FileSpreadsheet, FileImage, File,
  LayoutDashboard, Ruler, Sparkles, FormInput
} from "lucide-react"

const benefits = [
  { icon: Clock, title: "Save Time", description: "Post once, receive 5+ quotes. No more contacting suppliers one by one." },
  { icon: DollarSign, title: "Best Prices", description: "Competitive bidding ensures you get the best market rates." },
  { icon: Shield, title: "Verified Suppliers", description: "All quoters are vetted and verified by Zanzibaba." },
  { icon: MessageSquare, title: "Direct Negotiation", description: "Chat directly with suppliers to refine your requirements." },
]

const faqs = [
  { q: "How long does it take to receive quotes?", a: "Most RFQs receive 5+ quotes within 24 hours. Complex requests may take up to 48 hours." },
  { q: "Is posting an RFQ free?", a: "Yes, posting an RFQ is completely free for buyers." },
  { q: "Can I choose who quotes on my RFQ?", a: "You can make it public or invite-only for select suppliers." },
  { q: "How do I know suppliers are verified?", a: "All suppliers undergo a verification process. Filter to receive quotes only from verified suppliers." },
]

const docTypes = [
  { icon: FileSpreadsheet, label: "BOQ", desc: "Bill of Quantities (.xlsx, .csv)", color: "from-green-500 to-emerald-600" },
  { icon: LayoutDashboard, label: "Floor Plans", desc: "Architectural floor plans (.dwg, .pdf)", color: "from-blue-500 to-indigo-600" },
  { icon: Ruler, label: "Technical Drawings", desc: "Engineering drawings (.dwg, .dxf)", color: "from-purple-500 to-violet-600" },
  { icon: FileImage, label: "Project Photos", desc: "Site photos, inspiration images (.jpg, .png)", color: "from-gold-500 to-orange-600" },
]

export default function RFQPage() {
  const [documents, setDocuments] = useState<{ name: string; type: string }[]>([])

  function addDocument(type: string) {
    setDocuments((prev) => [...prev, { name: `${type}-${prev.length + 1}`, type }])
  }

  function removeDocument(index: number) {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="warning" className="mb-4 px-4 py-1.5 text-sm">
              <FileText className="mr-1.5 h-4 w-4" /> Request for Quotation
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Upload Your Requirements, Get 5+ Quotes in 24 Hours
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Post your RFQ once. Receive competitive quotes from verified suppliers automatically.
              Save time, compare prices, and get the best deal for your project.
            </p>
          </div>
        </div>
      </section>

      {/* RFQ Form — Tabs: Manual + AI Assistant */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Tabs
            tabs={[
              {
                id: "manual",
                label: "Manual RFQ Form",
                content: (
                  <Card>
                    <CardContent className="p-6 sm:p-8">
                      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl bg-gradient-to-r from-zanzibar-50 to-zanzibar-100 p-4">
                        <Shield className="h-8 w-8 text-zanzibar-600 shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-zanzibar-800">Quotes from Verified Suppliers Only</p>
                          <p className="text-sm text-zanzibar-600">All suppliers on Zanzibaba are verified. You receive quotes from trusted businesses.</p>
                        </div>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-5">
                          <h3 className="text-lg font-semibold text-gray-900">What do you need?</h3>
                          <Select label="Category" id="category" placeholder="Select a category" options={[
                            { value: "building-materials", label: "Building Materials" },
                            { value: "furniture", label: "Furniture" },
                            { value: "kitchens", label: "Kitchens" },
                            { value: "sanitary", label: "Sanitary & Plumbing" },
                            { value: "electrical", label: "Electrical" },
                            { value: "prefab", label: "Prefab Structures" },
                            { value: "hospitality", label: "Hospitality Equipment" },
                            { value: "lighting", label: "Lighting" },
                            { value: "hvac", label: "HVAC" },
                            { value: "other", label: "Other" },
                          ]} />
                          <Input label="RFQ Title" id="title" placeholder="e.g., 500 bags Portland Cement 42.5N" />
                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea rows={3} className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500" placeholder="Describe your requirements — specifications, quality standards, delivery needs..." />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Input label="Quantity" id="quantity" type="number" placeholder="100" />
                            <Select label="Unit" id="unit" placeholder="Select" options={[
                              { value: "pieces", label: "Pieces" }, { value: "kg", label: "Kilograms" },
                              { value: "tons", label: "Tons" }, { value: "boxes", label: "Boxes" },
                              { value: "sqm", label: "Square Meters" }, { value: "units", label: "Units" },
                            ]} />
                          </div>
                        </div>
                        <div className="space-y-5">
                          <h3 className="text-lg font-semibold text-gray-900">Budget & Delivery</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <Input label="Budget Min" id="budget-min" type="number" placeholder="$" />
                            <Input label="Budget Max" id="budget-max" type="number" placeholder="$" />
                          </div>
                          <Select label="Currency" id="currency" placeholder="Select" options={[
                            { value: "USD", label: "US Dollar ($)" }, { value: "TZS", label: "Tanzanian Shilling (TSh)" }, { value: "EUR", label: "Euro (€)" },
                          ]} />
                          <Input label="Delivery Location" id="location" placeholder="e.g., Stone Town, Zanzibar" />
                          <Select label="Preferred Timeline" id="timeline" placeholder="Select" options={[
                            { value: "immediate", label: "Immediate (1-2 weeks)" }, { value: "standard", label: "Standard (2-4 weeks)" },
                            { value: "flexible", label: "Flexible (1-3 months)" }, { value: "tbd", label: "Not Sure / TBD" },
                          ]} />
                          <div className="space-y-2 rounded-lg border p-3">
                            <p className="text-sm font-medium text-gray-700">Preferences</p>
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-zanzibar-600" />
                              <Shield className="h-4 w-4 text-zanzibar-600" /> Verified suppliers only
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                              <input type="checkbox" className="rounded border-gray-300 text-zanzibar-600" />
                              <Users className="h-4 w-4 text-zanzibar-600" /> Invite-only (select suppliers)
                            </label>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-8" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload Supporting Documents</h3>
                        <p className="text-sm text-gray-500 mb-4">Attach documents to help suppliers quote accurately. The more detail, the better the quotes.</p>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          {docTypes.map((doc) => {
                            const Icon = doc.icon
                            return (
                              <button key={doc.label} onClick={() => addDocument(doc.label)} className="group relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 p-4 text-left transition-all hover:border-zanzibar-400 hover:bg-zanzibar-50">
                                <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${doc.color} p-2.5`}><Icon className="h-5 w-5 text-white" /></div>
                                <p className="font-medium text-gray-900 group-hover:text-zanzibar-600">{doc.label}</p>
                                <p className="mt-0.5 text-xs text-gray-500">{doc.desc}</p>
                                <div className="mt-2"><span className="inline-flex items-center gap-1 text-xs font-medium text-zanzibar-600 opacity-0 group-hover:opacity-100 transition-opacity"><Upload className="h-3 w-3" /> Click to upload</span></div>
                              </button>
                            )
                          })}
                        </div>
                        {documents.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium text-gray-700">Uploaded documents ({documents.length})</p>
                            {documents.map((doc, i) => (
                              <div key={i} className="flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-2.5">
                                <div className="flex items-center gap-2"><File className="h-4 w-4 text-zanzibar-600" /><span className="text-sm text-gray-700">{doc.type} Document {doc.name.slice(-1)}</span></div>
                                <button onClick={() => removeDocument(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="mt-3 text-xs text-gray-400">Max 10MB per file. Supported: PDF, DWG, DXF, XLSX, JPG, PNG</p>
                      </div>

                      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500"><Check className="inline h-4 w-4 text-zanzibar-600 mr-1" />Your RFQ will be sent to verified suppliers in this category</p>
                        <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-white min-w-[200px]"><FileText className="mr-2 h-5 w-5" /> Submit RFQ</Button>
                      </div>
                    </CardContent>
                  </Card>
                ),
              },
              {
                id: "ai",
                label: "AI RFQ Assistant",
                content: (
                  <Card>
                    <CardContent className="p-6">
                      <div className="mb-6 flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-50 to-zanzibar-50 p-4">
                        <Sparkles className="h-6 w-6 text-zanzibar-600 shrink-0" />
                        <div>
                          <p className="font-semibold text-zanzibar-800">Upload BOQ, Floor Plans, or PDF — AI Creates Your RFQ</p>
                          <p className="text-sm text-zanzibar-600">No manual forms. Upload your project documents and get a structured RFQ draft instantly.</p>
                        </div>
                      </div>
                      <RFQAssistant />
                    </CardContent>
                  </Card>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">Why Use Zanzibaba RFQ?</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {benefits.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-500 to-zanzibar-700 shadow-lg">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{b.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{b.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent RFQs */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Recent RFQs</h2>
          <div className="mt-6 space-y-3">
            {[
              { title: "500 Bags Portland Cement 42.5N", category: "Building Materials", qty: "500 bags", budget: "$4,000 - $5,000", time: "2 hours ago", quotes: 5 },
              { title: "Complete Kitchen Set for 12 Apartments", category: "Kitchens", qty: "12 units", budget: "$15,000 - $20,000", time: "5 hours ago", quotes: 3 },
              { title: "Hotel Furniture Package 60 Rooms", category: "Furniture", qty: "60 rooms", budget: "$45,000 - $60,000", time: "8 hours ago", quotes: 7 },
              { title: "Solar Panel System 50kW", category: "Electrical", qty: "1 system", budget: "$8,000 - $12,000", time: "1 day ago", quotes: 4 },
            ].map((rfq) => (
              <div key={rfq.title} className="flex flex-wrap items-center justify-between rounded-xl border bg-white px-6 py-4 transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50">
                    <FileText className="h-5 w-5 text-zanzibar-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rfq.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                      <Badge variant="secondary" className="text-xs">{rfq.category}</Badge>
                      <span>{rfq.qty}</span>
                      <span>{rfq.budget}</span>
                      <span className="text-zanzibar-600 font-medium">{rfq.quotes} quotes</span>
                      <span>{rfq.time}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="default" className="text-xs">Open for Quotes</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">RFQ FAQ</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border bg-white">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-medium text-gray-900">
                  {faq.q}
                  <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-90" />
                </summary>
                <div className="border-t px-6 py-4 text-sm text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
