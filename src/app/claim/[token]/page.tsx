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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">&#10003;</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Claimed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you! Your business profile on Zanzibaba is now active. 
            {lead?.companyName ? ` ${lead.companyName} is now listed in our marketplace.` : ""}
          </p>
          <p className="text-sm text-gray-500">
            You can now log in to your dashboard to manage your profile, products, and receive inquiries from buyers.
          </p>
        </div>
      </div>
    )
  }

  if (error && !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">&#10060;</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Invalid</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const categories = Array.isArray(lead?.categoryLabels)
    ? lead.categoryLabels.join(", ")
    : "Building Supplies"

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Claim Your Zanzibaba Profile</h1>
            <p className="text-emerald-100 mt-1">
              {lead?.companyName || "Your Business"} &mdash; {lead?.city || "Tanzania"}
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Categories</div>
                <div className="font-medium text-gray-900">{categories}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Trust Score</div>
                <div className="font-medium text-gray-900">{lead?.trustScore || 0}/100</div>
              </div>
            </div>

            {lead?.description && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 mb-2">About Your Business</h3>
                <p className="text-gray-700">{lead.description}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="+255 XXX XXX XXX"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Claiming..." : "Claim Your Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
