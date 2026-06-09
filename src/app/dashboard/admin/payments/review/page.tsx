"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, XCircle, AlertTriangle, Search, Filter, Eye } from "lucide-react"

interface PaymentRequest {
  id: string
  userId: string
  plan: string
  amount: number
  currency: string
  receiptUrl: string | null
  receiptFileName: string | null
  transactionRef: string | null
  bankName: string | null
  notes: string | null
  status: string
  adminNotes: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  createdAt: string
  user: { name: string; email: string }
}

export default function AdminPaymentReviewPage() {
  const [payments, setPayments] = useState<PaymentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("PENDING")
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null)
  const [reviewNote, setReviewNote] = useState("")

  async function loadPayments() {
    setLoading(true)
    try {
      const url = filter ? `/api/admin/payments/review?status=${filter}` : "/api/admin/payments/review"
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      setPayments(data)
    } catch {
      setMessage("Failed to load payment requests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPayments() }, [filter])

  const filtered = payments.filter((p) =>
    !search || p.user.name.toLowerCase().includes(search.toLowerCase()) || p.user.email.toLowerCase().includes(search.toLowerCase())
  )

  async function handleReview(action: "approve" | "reject" | "clarification", paymentId: string) {
    setMessage("Processing...")
    try {
      const res = await fetch("/api/admin/payments/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, paymentId, reason: reviewNote }),
      })
      if (!res.ok) throw new Error("Failed")
      setSelectedPayment(null)
      setReviewNote("")
      setMessage(`Payment ${action}d successfully`)
      await loadPayments()
    } catch {
      setMessage(`Failed to ${action} payment`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Review Queue</h1>
          <p className="text-gray-500 text-sm mt-1">Review and approve manual payment requests</p>
        </div>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm border ${
          message.includes("Failed") ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}>
          {message}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
          />
        </div>
        {["PENDING", "APPROVED", "REJECTED", "CLARIFICATION", ""].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === s ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No payment requests found</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Supplier</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Plan</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Reference</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{p.user.name}</div>
                    <div className="text-xs text-gray-400">{p.user.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">{p.plan}</span>
                  </td>
                  <td className="py-3 px-4">
                    {p.currency === "TZS" ? "TZS" : "$"}{Number(p.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{p.transactionRef || "-"}</td>
                  <td className="py-3 px-4 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.status === "PENDING" ? "bg-amber-50 text-amber-700" :
                      p.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" :
                      p.status === "REJECTED" ? "bg-red-50 text-red-700" :
                      "bg-blue-50 text-blue-700"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {p.status === "PENDING" && (
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => { setSelectedPayment(p); setReviewNote("") }}
                          className="px-2 py-1 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          Review
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedPayment(p)}
                      className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Review Payment</h2>
                <button onClick={() => setSelectedPayment(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Supplier</span>
                  <span className="font-medium">{selectedPayment.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{selectedPayment.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan</span>
                  <span className="font-medium">{selectedPayment.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold">
                    {selectedPayment.currency === "TZS" ? "TZS" : "$"}{Number(selectedPayment.amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank</span>
                  <span className="font-medium">{selectedPayment.bankName || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction Ref</span>
                  <span className="font-medium">{selectedPayment.transactionRef || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted</span>
                  <span className="font-medium">{new Date(selectedPayment.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {selectedPayment.receiptUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Receipt</label>
                  {selectedPayment.receiptUrl.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
                    <img src={selectedPayment.receiptUrl} alt="Receipt" className="max-h-48 rounded-lg border" />
                  ) : (
                    <a href={selectedPayment.receiptUrl} target="_blank" className="text-emerald-600 text-sm hover:underline">
                      View receipt file
                    </a>
                  )}
                </div>
              )}

              {selectedPayment.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Notes</label>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{selectedPayment.notes}</p>
                </div>
              )}

              {selectedPayment.adminNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                  <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">{selectedPayment.adminNotes}</p>
                </div>
              )}

              {selectedPayment.status === "PENDING" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes</label>
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      rows={2}
                      placeholder="Add notes about this payment..."
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview("approve", selectedPayment.id)}
                      className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleReview("clarification", selectedPayment.id)}
                      className="flex-1 bg-amber-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-amber-700 flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="h-4 w-4" /> Clarify
                    </button>
                    <button
                      onClick={() => handleReview("reject", selectedPayment.id)}
                      className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </div>
                </>
              )}

              {selectedPayment.status !== "PENDING" && (
                <div className="text-center text-sm text-gray-500">
                  Payment already {selectedPayment.status.toLowerCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
