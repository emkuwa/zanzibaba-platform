"use client"

import { useState, useEffect } from "react"

interface ActivationStats {
  totalDiscovered: number
  claimReady: number
  invited: number
  visited: number
  claimed: number
  verified: number
  featured: number
  whatsappSent: number
  whatsappDelivered: number
  whatsappOpened: number
  foundingInvited: number
  foundingClaimed: number
}

interface ClaimableLead {
  id: string
  companyName: string | null
  contactName: string | null
  email: string | null
  phone: string | null
  city: string | null
  trustScore: number
  trustLevel: string
  claimToken: string | null
  claimLinkSentAt: string | null
  categoryLabels: any
}

export default function ActivationDashboard() {
  const [stats, setStats] = useState<ActivationStats | null>(null)
  const [claimableLeads, setClaimableLeads] = useState<ClaimableLead[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "claimable" | "whatsapp" | "founding">("overview")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  async function loadStats() {
    try {
      const res = await fetch("/api/activation/stats")
      const data = await res.json()
      setStats(data)
    } catch {
      setMessage("Failed to load stats")
    }
  }

  async function loadClaimable() {
    try {
      const res = await fetch("/api/activation/claim/generate")
      const data = await res.json()
      setClaimableLeads(data.leads || [])
    } catch {
      setMessage("Failed to load claimable leads")
    }
  }

  useEffect(() => {
    async function init() {
      await Promise.all([loadStats(), loadClaimable()])
      setLoading(false)
    }
    init()
  }, [])

  async function handleGenerateClaimLinks() {
    setMessage("Generating claim links...")
    try {
      const res = await fetch("/api/activation/claim/generate", { method: "POST" })
      const data = await res.json()
      setMessage(`Generated ${data.generated} claim links`)
      await Promise.all([loadStats(), loadClaimable()])
    } catch {
      setMessage("Failed to generate claim links")
    }
  }

  async function handlePrepareWhatsApp() {
    setMessage("Preparing WhatsApp messages...")
    try {
      const res = await fetch("/api/activation/whatsapp/prepare", { method: "POST" })
      const data = await res.json()
      setMessage(`Prepared ${data.prepared} WhatsApp messages`)
      await loadStats()
    } catch {
      setMessage("Failed to prepare WhatsApp messages")
    }
  }

  async function handleSendWhatsApp() {
    setMessage("Sending WhatsApp messages...")
    try {
      const res = await fetch("/api/activation/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-all" }),
      })
      const data = await res.json()
      setMessage(`Sent ${data.sent} WhatsApp messages`)
      await loadStats()
    } catch {
      setMessage("Failed to send WhatsApp messages")
    }
  }

  async function handleInviteFounding() {
    setMessage("Inviting to Founding Supplier Program...")
    try {
      const res = await fetch("/api/activation/founding/invite", { method: "POST" })
      const data = await res.json()
      setMessage(`Invited ${data.invited} suppliers to Founding Program`)
      await loadStats()
    } catch {
      setMessage("Failed to invite founding suppliers")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading Activation Dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supplier Activation</h1>
          <p className="text-gray-500 text-sm mt-1">Turn discovered suppliers into active marketplace suppliers</p>
        </div>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {([
          { key: "overview", label: "Overview" },
          { key: "claimable", label: "Claimable" },
          { key: "whatsapp", label: "WhatsApp" },
          { key: "founding", label: "Founding Program" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? "bg-white text-emerald-600 border border-b-white border-gray-200 -mb-[2px]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-7 gap-4">
            {[
              { label: "Discovered", value: stats.totalDiscovered, color: "bg-blue-500" },
              { label: "Claim-Ready", value: stats.claimReady, color: "bg-emerald-500" },
              { label: "Invited", value: stats.invited, color: "bg-violet-500" },
              { label: "Visited", value: stats.visited, color: "bg-orange-500" },
              { label: "Claimed", value: stats.claimed, color: "bg-amber-500" },
              { label: "Verified", value: stats.verified, color: "bg-cyan-500" },
              { label: "Featured", value: stats.featured, color: "bg-rose-500" },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${card.color}`} />
                  <div className="text-sm text-gray-500">{card.label}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{card.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "WhatsApp Sent", value: stats.whatsappSent },
              { label: "WhatsApp Delivered", value: stats.whatsappDelivered },
              { label: "WhatsApp Opened", value: stats.whatsappOpened },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="text-sm text-gray-500 mb-2">{card.label}</div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Founding Supplier Program</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-violet-50 rounded-lg p-4">
                <div className="text-sm text-violet-600">Invited</div>
                <div className="text-2xl font-bold text-violet-900">{stats.foundingInvited}</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="text-sm text-amber-600">Claimed</div>
                <div className="text-2xl font-bold text-amber-900">{stats.foundingClaimed}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Activation Funnel</h3>
            <div className="space-y-3">
              {[
                { label: "Discovered", value: stats.totalDiscovered, max: stats.totalDiscovered || 1 },
                { label: "Claim-Ready", value: stats.claimReady, max: stats.totalDiscovered || 1 },
                { label: "Invited", value: stats.invited, max: stats.totalDiscovered || 1 },
                { label: "Visited", value: stats.visited, max: stats.totalDiscovered || 1 },
                { label: "Claimed", value: stats.claimed, max: stats.totalDiscovered || 1 },
                { label: "Verified", value: stats.verified, max: stats.totalDiscovered || 1 },
                { label: "Featured", value: stats.featured, max: stats.totalDiscovered || 1 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.round((item.value / item.max) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "claimable" && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={handleGenerateClaimLinks}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Generate Claim Links
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Claim-Ready Suppliers ({claimableLeads.length})</h3>
            </div>
            {claimableLeads.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No claim-ready suppliers yet. Generate claim links first.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {claimableLeads.map((lead) => {
                  const claimUrl = lead.claimToken
                    ? `${window.location.origin}/claim/${lead.claimToken}`
                    : null
                  return (
                    <div key={lead.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{lead.companyName || "Unknown"}</div>
                        <div className="text-sm text-gray-500">
                          {lead.city} &middot; Score: {lead.trustScore}/100
                          {lead.claimLinkSentAt && (
                            <span className="ml-2 text-emerald-600">Link sent {new Date(lead.claimLinkSentAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      {claimUrl && (
                        <button
                          onClick={() => navigator.clipboard.writeText(claimUrl)}
                          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Copy Link
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "whatsapp" && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={handlePrepareWhatsApp}
              className="bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              Prepare Messages
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Send All Pending
            </button>
          </div>

          {stats && (
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Sent", value: stats.whatsappSent, color: "text-blue-600" },
                { label: "Delivered", value: stats.whatsappDelivered, color: "text-emerald-600" },
                { label: "Opened", value: stats.whatsappOpened, color: "text-amber-600" },
                { label: "Claimed (via WA)", value: 0, color: "text-rose-600" },
              ].map((card) => (
                <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className={`text-sm text-gray-500 mb-1`}>{card.label}</div>
                  <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "founding" && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={handleInviteFounding}
              className="bg-amber-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              Invite to Founding Program
            </button>
          </div>

          {stats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Program Progress</h3>
                <div className="space-y-3">
                  {[
                    { label: "Invited", value: stats.foundingInvited, total: stats.foundingInvited || 1 },
                    { label: "Claimed", value: stats.foundingClaimed, total: stats.foundingInvited || 1 },
                    { label: "Verified", value: stats.verified, total: stats.foundingInvited || 1 },
                    { label: "Featured", value: stats.featured, total: stats.foundingInvited || 1 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${Math.round((item.value / item.total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">About the Founding Supplier Program</h3>
                <p className="text-sm text-gray-600">
                  The Founding Supplier Program invites our claim-ready suppliers to be among the first
                  verified businesses on Zanzibaba. Founding suppliers receive:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">&#9733;</span>
                    <span>Priority placement in search results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">&#9733;</span>
                    <span>"Founding Supplier" badge on profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">&#9733;</span>
                    <span>Free featured listing for 3 months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">&#9733;</span>
                    <span>Direct RFQ notifications</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
