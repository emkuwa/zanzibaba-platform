"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface LeadData {
  companyName: string | null
  contactName: string | null
  email: string | null
  phone: string | null
  website: string | null
  city: string | null
  country: string | null
  description: string | null
  categoryLabels: any
  products: any
  trustScore: number
  activationStatus: string
  leadType?: string
  foundingEntry?: { stage: string; campaign: string | null } | null
}

const ENTITY_LABELS: Record<string, { label: string; buyerLabel: string; profileLabel: string }> = {
  supplier: { label: "Supplier", buyerLabel: "buyers", profileLabel: "business profile" },
  contractor: { label: "Contractor", buyerLabel: "clients", profileLabel: "contractor profile" },
  professional: { label: "Professional", buyerLabel: "clients", profileLabel: "professional profile" },
  architect: { label: "Architect", buyerLabel: "clients", profileLabel: "architect profile" },
  engineer: { label: "Engineer", buyerLabel: "clients", profileLabel: "engineer profile" },
  surveyor: { label: "Surveyor", buyerLabel: "clients", profileLabel: "surveyor profile" },
  service: { label: "Service Provider", buyerLabel: "customers", profileLabel: "service profile" },
  partner: { label: "Partner", buyerLabel: "partners", profileLabel: "partner profile" },
  "hardware-store": { label: "Hardware Store", buyerLabel: "buyers", profileLabel: "store profile" },
  "hospitality-service": { label: "Hospitality Service", buyerLabel: "hotels", profileLabel: "service profile" },
  "interior-designer": { label: "Interior Designer", buyerLabel: "clients", profileLabel: "designer profile" },
  landscaping: { label: "Landscaping", buyerLabel: "clients", profileLabel: "landscaping profile" },
  hotel: { label: "Hotel", buyerLabel: "guests", profileLabel: "hotel profile" },
  "tour-operator": { label: "Tour Operator", buyerLabel: "travelers", profileLabel: "tour operator profile" },
  developer: { label: "Developer", buyerLabel: "buyers", profileLabel: "developer profile" },
}

function getEntityLabels(leadType?: string) {
  return ENTITY_LABELS[leadType || ""] || ENTITY_LABELS.supplier
}

export default function ClaimPage() {
  const { token } = useParams<{ token: string }>()
  const [lead, setLead] = useState<LeadData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [claimed, setClaimed] = useState(false)
  const [formData, setFormData] = useState({ contactName: "", email: "", phone: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/activation/claim/${token}`)
        if (!res.ok) {
          const data = await res.json()
          if (data.claimed) {
            setClaimed(true)
            setError("This profile has already been claimed.")
          } else {
            setError(data.error || "Invalid claim link")
          }
          return
        }
        const data = await res.json()
        setLead(data.lead)
        setFormData({
          contactName: data.lead.contactName || "",
          email: data.lead.email || "",
          phone: data.lead.phone || "",
        })
      } catch {
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/activation/claim/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setClaimed(true)
        setError("")
      } else {
        setError(data.error || "Failed to claim profile")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">Loading your profile...</div>
      </div>
    )
  }

  if (claimed) {
    const labels = getEntityLabels(lead?.leadType)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-emerald-600 font-bold">&#10003;</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Claimed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you! Your {labels.profileLabel} on Zanzibaba is now active.
            {lead?.companyName ? ` ${lead.companyName} is now listed in our marketplace.` : ""}
          </p>
          <div className="bg-emerald-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-emerald-800 mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-emerald-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">&#10003;</span>
                <span>{labels.buyerLabel.charAt(0).toUpperCase() + labels.buyerLabel.slice(1)} can now find your business in search results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">&#10003;</span>
                <span>You will receive inquiries from verified {labels.buyerLabel}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">&#10003;</span>
                <span>Log in to your dashboard to manage your profile and listings</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-500">
            You can now log in to your dashboard to manage your profile and receive inquiries.
          </p>
        </div>
      </div>
    )
  }

  if (error && !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-red-500">!</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Invalid</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const categories = Array.isArray(lead?.categoryLabels)
    ? lead.categoryLabels.join(", ")
    : "Building Supplies"

  const isFounding = !!lead?.foundingEntry
  const labels = getEntityLabels(lead?.leadType)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            Free {labels.profileLabel}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Claim Your Zanzibaba Profile
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Get discovered by {labels.buyerLabel} searching for{" "}
            <span className="text-gray-700 font-medium">{categories}</span> in{" "}
            {lead?.city || "Tanzania"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column — Benefits & Trust */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">{lead?.companyName || "Your Business"}</h2>
                <p className="text-emerald-100 mt-1">
                  {lead?.city || "Tanzania"}{lead?.country ? `, ${lead.country}` : ""}
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Categories</div>
                    <div className="font-medium text-gray-900">{categories}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Trust Score</div>
                    <div className="font-medium text-gray-900">{lead?.trustScore || 0}/100</div>
                  </div>
                </div>

                {lead?.description && (
                  <div className="mb-6">
                    <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">About Your Business</h3>
                    <p className="text-gray-700 leading-relaxed">{lead.description}</p>
                  </div>
                )}

                {/* Why Claim Section */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Why claim your profile?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: "👁️", title: "Get Discovered", desc: `Appear in search results when ${labels.buyerLabel} look for your services` },
                      { icon: "📩", title: "Receive Inquiries", desc: `Get requests from verified ${labels.buyerLabel}` },
                      { icon: "⭐", title: "Build Trust", desc: "Verified badge shows you are a legitimate business" },
                      { icon: "📊", title: "Track Leads", desc: "Dashboard with analytics, messages & profile management" },
                    ].map((item) => (
                      <div key={item.title} className="bg-emerald-50/50 rounded-xl p-4">
                        <div className="text-xl mb-2">{item.icon}</div>
                        <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Founding Supplier Upsell */}
            {isFounding && (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-md">
                <div className="flex items-start gap-4">
                  <div className="text-4xl shrink-0">&#9733;</div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Founding {labels.label} Program</h3>
                    <p className="text-purple-200 text-sm mb-4">
                      As one of our earliest {labels.label.toLowerCase()}s, you are invited to join the Founding {labels.label} Program —
                      exclusive benefits for early adopters.
                    </p>
                    <ul className="space-y-2 text-sm text-purple-100">
                      <li className="flex items-center gap-2">
                        <span>&#10003;</span> Priority placement in search results
                      </li>
                      <li className="flex items-center gap-2">
                        <span>&#10003;</span> "Founding {labels.label}" badge on your profile
                      </li>
                      <li className="flex items-center gap-2">
                        <span>&#10003;</span> Free featured listing for 3 months
                      </li>
                      <li className="flex items-center gap-2">
                        <span>&#10003;</span> Direct inquiry notifications
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Social Proof */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Trusted by businesses across East Africa</h3>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">400+</div>
                  <div className="text-xs text-gray-500 mt-1">Businesses Listed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600">50+</div>
                  <div className="text-xs text-gray-500 mt-1">Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600">1,000+</div>
                  <div className="text-xs text-gray-500 mt-1">Products Listed</div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Your information is safe with us</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🔒", title: "SSL Encrypted", desc: "All data transmitted securely" },
                  { icon: "🛡️", title: "Privacy Protected", desc: "Your data is never shared without consent" },
                  { icon: "✓", title: "Free to Join", desc: "No hidden fees or subscriptions" },
                  { icon: "⏱️", title: "Takes 2 Minutes", desc: "Quick and easy setup process" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="text-xl shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Claim Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-8">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Claim your profile</h3>
                <p className="text-xs text-gray-500 mt-1">Fill in your details to get started</p>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                      placeholder="+255 XXX XXX XXX"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-all hover:shadow-lg active:scale-[0.98]"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Claiming...
                      </span>
                    ) : (
                      "Claim Your Profile"
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-400">
                    By claiming, you agree to our{" "}
                    <a href="/terms" className="text-emerald-600 hover:underline">Terms</a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
