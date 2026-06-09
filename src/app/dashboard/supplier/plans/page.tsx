import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SUBSCRIPTION_PLANS } from "@/lib/payments/types"
import { Check } from "lucide-react"

export default async function PlansPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login")

  const profile = await prisma.supplierProfile.findUnique({
    where: { userId: session.user.id },
    select: { membershipTier: true, membershipExpiresAt: true },
  })

  const currentTier = profile?.membershipTier || "FREE"

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

              <div className="mt-auto">
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
                    className="block w-full py-2.5 text-center text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    {plan.tier === "FOUNDING" ? "Apply Now" : "Get Started"}
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
