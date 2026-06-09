import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAdminMemberships } from "@/lib/payments/stats"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const TIER_BADGES: Record<string, string> = {
  FREE: "bg-gray-100 text-gray-700",
  VERIFIED: "bg-emerald-50 text-emerald-700",
  FOUNDING: "bg-amber-50 text-amber-700",
}

const STATUS_BADGES: Record<string, string> = {
  VERIFIED: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  UNVERIFIED: "bg-gray-100 text-gray-500",
}

export default async function MembershipsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/auth/login")

  const memberships = await getAdminMemberships()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Memberships</h1>
          <p className="text-gray-500">Supplier membership tiers and verification status</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{memberships.length}</p>
            <p className="text-xs text-gray-500">Total Suppliers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{memberships.filter((m) => m.membershipTier === "VERIFIED").length}</p>
            <p className="text-xs text-gray-500">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{memberships.filter((m) => m.membershipTier === "FOUNDING").length}</p>
            <p className="text-xs text-gray-500">Founding</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-400">{memberships.filter((m) => m.membershipTier === "FREE").length}</p>
            <p className="text-xs text-gray-500">Free</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {memberships.length === 0 ? (
            <p className="text-sm text-gray-400 px-6 py-8 text-center">No suppliers registered yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="text-left py-4 px-6 font-medium">Company</th>
                  <th className="text-left py-4 px-6 font-medium">Email</th>
                  <th className="text-left py-4 px-6 font-medium">Tier</th>
                  <th className="text-left py-4 px-6 font-medium">Verification</th>
                  <th className="text-left py-4 px-6 font-medium">Badge</th>
                  <th className="text-left py-4 px-6 font-medium">Featured</th>
                  <th className="text-left py-4 px-6 font-medium">Expires</th>
                  <th className="text-left py-4 px-6 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((m) => (
                  <tr key={m.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{m.companyName}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{m.userEmail}</td>
                    <td className="py-4 px-6">
                      <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium", TIER_BADGES[m.membershipTier] || "bg-gray-100 text-gray-700")}>
                        {m.membershipTier}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium", STATUS_BADGES[m.verificationStatus] || "bg-gray-100 text-gray-500")}>
                        {m.verificationStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {m.verificationBadge ? (
                        <span className="text-emerald-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {m.isFeatured ? (
                        <span className="text-amber-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {m.membershipExpiresAt ? new Date(m.membershipExpiresAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
