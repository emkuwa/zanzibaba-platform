"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Check, Copy, Upload, Building2, CreditCard, Smartphone, Clock } from "lucide-react"
import { SUBSCRIPTION_PLANS, BANK_DETAILS, VERIFIED_PRICE_USD, VERIFIED_PRICE_TZS, FOUNDING_PRICE_USD, FOUNDING_PRICE_TZS } from "@/lib/payments/types"
import type { BankDetails } from "@/lib/payments/types"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planTier = searchParams.get("plan") || ""

  const plan = SUBSCRIPTION_PLANS.find((p) => p.tier === planTier)
  const [currency, setCurrency] = useState<"USD" | "TZS">("USD")
  const [bank, setBank] = useState<BankDetails>(BANK_DETAILS[1])
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string>("")
  const [transactionRef, setTransactionRef] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [step, setStep] = useState<"select" | "pay" | "submit" | "done">("select")

  const price = planTier === "VERIFIED"
    ? (currency === "TZS" ? VERIFIED_PRICE_TZS : VERIFIED_PRICE_USD)
    : (currency === "TZS" ? FOUNDING_PRICE_TZS : FOUNDING_PRICE_USD)

  const availableBanks = currency === "TZS"
    ? BANK_DETAILS.filter((b) => b.currency === "TZS")
    : BANK_DETAILS.filter((b) => b.currency === "USD")

  useEffect(() => {
    setBank(availableBanks[0])
  }, [currency])

  if (!plan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Invalid plan selected.</p>
        <button onClick={() => router.push("/dashboard/supplier/plans")} className="text-emerald-600 mt-2">Go back to plans</button>
      </div>
    )
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => setReceiptPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit() {
    if (!receiptFile && !transactionRef) {
      setMessage("Please upload a receipt or enter a transaction reference")
      return
    }
    setSubmitting(true)
    setMessage("")

    try {
      let receiptUrl = ""
      let receiptFileName = ""

      if (receiptFile) {
        const formData = new FormData()
        formData.append("file", receiptFile)
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        if (uploadRes.ok) {
          const data = await uploadRes.json()
          receiptUrl = data.url || ""
          receiptFileName = receiptFile.name
        }
      }

      const res = await fetch("/api/subscriptions/payment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planTier,
          currency,
          receiptUrl,
          receiptFileName,
          transactionRef,
          bankName: bank.bankName,
          notes,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to submit")
      }

      setStep("done")
    } catch (err) {
      setMessage((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const priceLabel = currency === "TZS"
    ? `TZS ${price.toLocaleString()}`
    : `$${price.toLocaleString()}`

  if (step === "done") {
    return (
      <div className="max-w-lg mx-auto text-center py-12 space-y-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Payment Submitted</h2>
        <p className="text-gray-500">
          Your membership application is under review.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-800 font-medium mb-1">
            <Clock className="h-4 w-4" />
            Expected review time: 2–24 hours
          </div>
          <p className="text-xs text-amber-700">
            Our team will verify your payment and activate your {plan.name} membership.
            You will receive a confirmation once approved.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/supplier/membership")}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          View Membership Status
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscribe to {plan.name}</h1>
        <p className="text-gray-500 mt-1">Complete payment to activate your membership</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800 font-medium">Payment Instructions</p>
        <p className="text-xs text-amber-700 mt-1">
          Transfer the exact amount to one of the bank accounts below, then submit your payment details for verification.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">1. Choose Currency</h2>
        <div className="flex gap-2">
          {(["USD", "TZS"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                currency === c
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="text-lg font-bold text-gray-900">{priceLabel}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">2. Bank Transfer Details</h2>
        <div className="flex gap-2">
          {availableBanks.map((b) => (
            <button
              key={b.bankName}
              onClick={() => setBank(b)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                bank.bankName === b.bankName
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {b.bankName}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Bank</span>
            <span className="font-medium text-gray-900">{bank.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Account Name</span>
            <span className="font-medium text-gray-900">{bank.accountName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Account Number</span>
            <span className="font-medium text-gray-900 flex items-center gap-2">
              {bank.accountNumber}
              <button onClick={() => navigator.clipboard.writeText(bank.accountNumber)} className="text-emerald-600 hover:text-emerald-700">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </span>
          </div>
          {bank.swiftCode && (
            <div className="flex justify-between">
              <span className="text-gray-500">SWIFT Code</span>
              <span className="font-medium text-gray-900">{bank.swiftCode}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Branch</span>
            <span className="font-medium text-gray-900">{bank.branch}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-bold text-emerald-600">{priceLabel}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">3. Submit Payment Proof</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Receipt</label>
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400 bg-gray-50">
            {receiptPreview ? (
              <img src={receiptPreview} alt="Receipt preview" className="h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload className="h-6 w-6" />
                <span className="text-sm">Click to upload receipt (PDF, JPG, PNG)</span>
              </div>
            )}
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileSelect} />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Reference</label>
          <input
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            placeholder="e.g. NMB-1234567890"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Any additional information..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          message.includes("Failed") || message.includes("error")
            ? "bg-red-50 text-red-700 border border-red-200"
            : "bg-blue-50 text-blue-700 border border-blue-200"
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        {submitting ? "Submitting..." : `Submit Payment for ${plan.name}`}
      </button>
    </div>
  )
}
