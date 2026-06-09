import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import {
  Eye, FileText, ClipboardList, TrendingUp, Package, Crown, ShieldCheck,
  DollarSign, Calendar, ArrowRight, CheckCircle, AlertCircle, Clock, Star,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SUBSCRIPTION_PLANS } from "@/lib/payments/types"

async function getDashboardData(userId: string) {
  const profile = await prisma.supplierProfile.findUnique({
    where: { userId },
    include: {
      _count: { select: { products: true, quotes: true, orders: true } },
    },
  })

  const products = await prisma.product.findMany({
    where: { supplierId: profile?.id || "", isActive: true },
    orderBy: { viewsCount: "desc" },
    take: 5,
    select: { id: true, name: true, viewsCount: true, inquiryCount: true },
  })

  const rfqs = await prisma.rFQ.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      buyer: { select: { name: true } },
      category: { select: { name: true } },
    },
  })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  })

  return { profile, products, rfqs, userName: user?.name || "there" }
}

function getPlanName(tier: string) {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.tier === tier)
  return plan?.name || tier
}

export default async function SupplierOverview() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login")

  const { profile, products, rfqs, userName } = await getDashboardData(session.user.id)

  const membershipTier = profile?.membershipTier || "FREE"
  const isFree = membershipTier === "FREE"
  const productCount = profile?._count?.products ?? 0
  const quoteCount = profile?._count?.quotes ?? 0
  const orderCount = profile?._count?.orders ?? 0
  const profileViews = profile?.profileViews ?? 0

  const stats = [
    { label: "Profile Views", value: profileViews.toString(), change: profileViews > 0 ? "Lifetime views" : "", icon: Eye, color: "text-blue-600 bg-blue-50" },
    { label: "Products Listed", value: productCount.toString(), change: productCount > 0 ? "Active listings" : "", icon: Package, color: "text-zanzibar-600 bg-zanzibar-50" },
    { label: "Quotes Sent", value: quoteCount.toString(), change: quoteCount > 0 ? "Total sent" : "", icon: ClipboardList, color: "text-gold-600 bg-gold-50" },
    { label: "Orders", value: orderCount.toString(), change: orderCount > 0 ? "Total orders" : "", icon: TrendingUp, color: "text-ocean-600 bg-ocean-50" },
  ]

  return (
    <div className="space-y-6">
      {isFree && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-5 w-5 text-amber-300" />
              <span className="text-sm font-medium text-emerald-100">Free Plan</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Unlock Verified Supplier Benefits
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { icon: ShieldCheck, label: "Verified Badge" },
                { icon: Star, label: "Priority RFQs" },
                { icon: TrendingUp, label: "Better Visibility" },
                { icon: DollarSign, label: "Direct Buyer Access" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/90">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/supplier/plans">
              <Button className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold">
                Upgrade Now <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {userName}</h2>
          <p className="text-gray-500">Here&apos;s your supplier dashboard overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/supplier/products/new">
            <Button>
              <Package className="mr-1.5 h-4 w-4" /> Add Product
            </Button>
          </Link>
          <Link href="/dashboard/supplier/rfqs">
            <Button variant="outline">
              <FileText className="mr-1.5 h-4 w-4" /> View RFQs
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-1 text-xs text-gray-400">{stat.change}</p>
                  </div>
                  <div className={"flex h-10 w-10 items-center justify-center rounded-lg " + stat.color}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="font-semibold text-gray-900">Open RFQ Opportunities</h3>
            <Link href="/dashboard/supplier/rfqs" className="text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {rfqs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No open RFQs right now</p>
                <p className="text-gray-400 text-xs mt-1">Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rfqs.map((rfq) => (
                  <div key={rfq.id} className="rounded-lg border border-gray-200 p-4 hover:border-zanzibar-200 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 truncate">{rfq.title}</h4>
                          <Badge variant="success" className="shrink-0 text-[10px]">New</Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{rfq.buyer.name}</p>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <DollarSign className="h-3 w-3" /> {rfq.currency} {rfq.budgetMin?.toString() || "—"} - {rfq.budgetMax?.toString() || "—"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" /> {new Date(rfq.createdAt).toLocaleDateString()}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            {rfq.category.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Link href={`/dashboard/supplier/rfqs/${rfq.id}`}>
                          <Button size="sm" variant="outline">View</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-gray-900">Products</h3>
              <Link href="/dashboard/supplier/products" className="text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No products yet</p>
                  <p className="text-gray-400 text-xs mt-1">List your first product to get started</p>
                  <Link href="/dashboard/supplier/products/new">
                    <Button size="sm" className="mt-3">
                      <Package className="mr-1 h-3.5 w-3.5" /> Add Product
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-y border-gray-100">
                        <th className="px-4 py-2.5 text-left font-medium text-gray-500">Product</th>
                        <th className="px-4 py-2.5 text-right font-medium text-gray-500">Views</th>
                        <th className="px-4 py-2.5 text-right font-medium text-gray-500">Inq.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[140px]">{p.name}</td>
                          <td className="px-4 py-3 text-right text-gray-600">{p.viewsCount}</td>
                          <td className="px-4 py-3 text-right text-gray-600">{p.inquiryCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Membership</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={"flex items-center gap-3 rounded-lg p-3 " + (isFree ? "bg-gray-50" : "bg-amber-50")}>
                <Crown className={"h-8 w-8 " + (isFree ? "text-gray-400" : "text-amber-600")} />
                <div>
                  <p className="font-semibold text-gray-900">{getPlanName(membershipTier)}</p>
                  <p className="text-xs text-gray-500">
                    {membershipTier === "FREE" ? "Free plan" : profile?.membershipExpiresAt ? `Expires ${new Date(profile.membershipExpiresAt).toLocaleDateString()}` : "Lifetime access"}
                  </p>
                </div>
              </div>
              {isFree ? (
                <Link href="/dashboard/supplier/plans">
                  <Button variant="outline" className="w-full">
                    <Crown className="mr-1.5 h-4 w-4" /> View Plans
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard/supplier/membership">
                  <Button variant="outline" className="w-full">
                    <Crown className="mr-1.5 h-4 w-4" /> Manage Membership
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Verification</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={"flex items-center gap-3 rounded-lg p-3 " + (profile?.verificationStatus === "VERIFIED" ? "bg-emerald-50" : "bg-gray-50")}>
                <ShieldCheck className={"h-8 w-8 " + (profile?.verificationStatus === "VERIFIED" ? "text-emerald-600" : "text-gray-400")} />
                <div>
                  <p className="font-semibold text-gray-900">
                    {profile?.verificationStatus === "VERIFIED" ? "Verified Supplier" : profile?.verificationStatus === "PENDING" ? "Verification Pending" : "Not Verified"}
                  </p>
                  {profile?.verificationStatus === "VERIFIED" ? (
                    <Badge variant="success">Verified</Badge>
                  ) : profile?.verificationStatus === "PENDING" ? (
                    <Badge variant="warning">Pending</Badge>
                  ) : null}
                </div>
              </div>
              {profile?.verificationStatus !== "VERIFIED" && (
                <Link href="/dashboard/supplier/verification">
                  <Button variant="outline" className="w-full">
                    <ShieldCheck className="mr-1.5 h-4 w-4" /> Start Verification
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
