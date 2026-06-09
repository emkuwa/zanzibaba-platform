import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SUBSCRIPTION_PLANS } from "@/lib/payments/types"
import { Check, Crown, Clock, ArrowRight } from "lucide-react"

async function getFoundingCount() {
  try {
    return await prisma.supplierProfile.count({ where: { membershipTier: "FOUNDING" } })
  } catch {
    return 0
  }
}

export default async function PlansPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login")

  const [profile, foundingCount] = await Promise.all([
    prisma.supplierProfile.findUnique({
      where: { userId: session.user.id },
      select: { membershipTier: true, membershipExpiresAt: true },
    }),
    getFoundingCount(),
  ])

  const currentTier = profile?.membershipTier || "FREE"
  const foundingRemaining = 100 - foundingCount

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
        <p className="text-gray-500 mt-1">Choose a plan to grow your business on Zanzibaba</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentTier === plan.tier
          const isPaid = plan.tier === "VERIFIED" || plan.tier === "FOUNDING"
          const isDowngrade = plan.tier === "FREE" && currentTier !== "FREE"

          return (
            <div
              key={plan.tier}
              className={`relative rounded-xl border-2 p-6 flex flex-col ${
                isCurrent
                  ? "border-emerald-500 bg-emerald-50"
                  : plan.highlighted && plan.tier === "FOUNDING"
                  ? "border-amber-400 bg-gradient-to-b from-amber-50 to-white"
                  : plan.highlighted
                  ? "border-amber-400 bg-white"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
                  plan.badge === "Exclusive" ? "bg-amber-500" : "bg-emerald-500"
                }`}>
                  {plan.badge}
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                  Current Plan
                </div>
              )}

              {plan.tier === "FOUNDING" && foundingRemaining > 0 && (
                <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded-lg px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {foundingRemaining} of 100 founding positions remaining
                </div>
              )}

              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.oneTimePrice ? (
                  <div>
                    <span className="text-3xl font-bold text-gray-900">${plan.oneTimePrice}</span>
                    <span className="text-gray-500 text-sm"> one-time</span>
                  </div>
                ) : plan.monthlyPrice === 0 ? (
                  <span className="text-3xl font-bold text-gray-900">Free</span>
                ) : (
                  <div>
                    <span className="text-3xl font-bold text-gray-900">${plan.monthlyPrice}</span>
                    <span className="text-gray-500 text-sm">/mo</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-2">
                {isCurrent ? (
                  <div className="w-full py-2.5 text-center text-sm font-medium text-emerald-700 bg-emerald-100 rounded-lg">
                    {isPaid && profile?.membershipExpiresAt
                      ? `Active until ${new Date(profile.membershipExpiresAt).toLocaleDateString()}`
                      : "Currently Active"}
                  </div>
                ) : isDowngrade ? (
                  <div className="w-full py-2.5 text-center text-sm font-medium text-gray-500 bg-gray-100 rounded-lg">
                    Contact support to downgrade
                  </div>
                ) : plan.tier === "FREE" ? (
                  <Link
                    href="/dashboard/supplier"
                    className="block w-full py-2.5 text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Your Current Plan
                  </Link>
                ) : (
                  <Link
                    href={`/dashboard/supplier/plans/payment?plan=${plan.tier}`}
                    className={`block w-full py-2.5 text-center text-sm font-medium text-white rounded-lg transition-colors ${
                      plan.tier === "FOUNDING"
                        ? "bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-500/30"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {plan.tier === "FOUNDING" ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Crown className="h-4 w-4" /> Apply for Founding <ArrowRight className="h-4 w-4" />
                      </span>
                    ) : "Get Started"}
                  </Link>
                )}
                {plan.tier === "FOUNDING" && currentTier !== "FOUNDING" && (
                  <Link
                    href="/become-supplier"
                    className="block w-full text-center text-xs text-amber-600 hover:text-amber-700 underline underline-offset-2"
                  >
                    See full Founding benefits &rarr;
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
