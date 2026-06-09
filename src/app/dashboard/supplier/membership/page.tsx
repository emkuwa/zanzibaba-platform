import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  Crown, ShieldCheck, CheckCircle2, Clock, AlertTriangle,
  Calendar, DollarSign, ArrowUpRight, FileText, CreditCard,
} from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/payments/types"

const TIER_COLORS: Record<string, string> = {
  FREE: "bg-gray-100 text-gray-700 border-gray-300",
  VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-300",
  FOUNDING: "bg-amber-50 text-amber-700 border-amber-300",
}

const TIER_ICONS: Record<string, typeof Crown> = {
  FREE: Crown,
  VERIFIED: ShieldCheck,
  FOUNDING: Crown,
}

export default async function MembershipPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login")

  const [profile, subscriptions, payments, transactions] = await Promise.all([
    prisma.supplierProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        membershipTier: true,
        membershipExpiresAt: true,
        verificationStatus: true,
        verificationBadge: true,
        isFeatured: true,
      },
    }),
    prisma.subscription.findMany({
      where: { userId: session.user.id, status: "active" },
      orderBy: { createdAt: "desc" },
      take: 1,
    }),
    prisma.manualPayment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const tier = profile?.membershipTier || "FREE"
  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.tier === tier)
  const expiresAt = profile?.membershipExpiresAt
  const isExpired = expiresAt && expiresAt < new Date()
  const hasActiveSub = subscriptions.length > 0 && !isExpired
  const Icon = TIER_ICONS[tier]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membership</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your subscription plan</p>
        </div>
        {tier === "FREE" && (
          <Link
            href="/dashboard/supplier/plans"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Upgrade Plan
          </Link>
        )}
      </div>

      <div className={`rounded-xl border-2 p-6 ${TIER_COLORS[tier]}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white/80">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{currentPlan?.name || "Free"}</h2>
                {profile?.verificationBadge && (
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                )}
              </div>
              <p className="text-sm opacity-80 mt-1">{currentPlan?.description}</p>
              <div className="flex items-center gap-4 mt-3">
                {expiresAt ? (
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    {isExpired ? (
                      <>
                        <AlertTriangle className="h-4 w-4" />
                        <span>Expired {new Date(expiresAt).toLocaleDateString()}</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4" />
                        <span>Valid until {new Date(expiresAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Active</span>
                  </div>
                )}
                {profile?.isFeatured && (
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>Featured</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" />
            Plan Features
          </h3>
          <ul className="space-y-2">
            {currentPlan?.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {tier !== "FOUNDING" && (
            <Link
              href={`/dashboard/supplier/plans/payment?plan=${
                tier === "FREE" ? "VERIFIED" : "FOUNDING"
              }`}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              {tier === "FREE" ? "Upgrade to Verified" : "Upgrade to Founding"}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-400" />
            Payment History
          </h3>
          {payments.length === 0 ? (
            <p className="text-sm text-gray-400">No payment history yet.</p>
          ) : (
            <div className="space-y-3">
              {payments.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.plan}</p>
                    <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {p.currency === "TZS" ? "TZS" : "$"}{Number(p.amount).toLocaleString()}
                    </p>
                    <span className={`text-xs font-medium ${
                      p.status === "APPROVED" ? "text-emerald-600" :
                      p.status === "REJECTED" ? "text-red-600" :
                      p.status === "CLARIFICATION" ? "text-amber-600" :
                      "text-gray-400"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-gray-400" />
          Transaction History
        </h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-400">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-left py-3 font-medium">Type</th>
                  <th className="text-left py-3 font-medium">Amount</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 font-medium text-gray-900 capitalize">{t.type}</td>
                    <td className="py-3 text-gray-600">
                      {t.currency === "TZS" ? "TZS" : "$"}{Number(t.amount).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        t.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                        t.status === "pending" ? "bg-amber-50 text-amber-700" :
                        "bg-red-50 text-red-700"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
