"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Zap, UserCircle, Globe, Package, Share2, Search, FileText, PenTool,
  ArrowRight, CheckCircle, AlertCircle, Clock, TrendingUp, Award,
  Target, Star, BarChart3
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GrowthDashboard } from "@/lib/ai-growth/types"

const defaultDashboard: GrowthDashboard = {
  profileStrength: { score: 0, max: 100 },
  seoScore: { score: 10, max: 100 },
  productCompleteness: { score: 0, max: 100 },
  socialContentStatus: { total: 0, published: 0, draft: 0 },
  websiteStatus: { exists: false, pages: 0, published: false },
  leadPerformance: { total: 0, thisMonth: 0, conversionRate: 0 },
  recommendations: [
    { category: "profile", priority: "high", message: "Create your supplier profile", action: "Get discovered by buyers" },
    { category: "website", priority: "high", message: "Build your mini website", action: "Establish your online presence" },
    { category: "catalog", priority: "high", message: "List your products", action: "Start receiving inquiries" },
  ],
  moduleStatus: { profile: false, website: false, catalog: false, social: false, seo: false, quotes: false, marketing: false },
}

const modules = [
  { key: "profile" as const, label: "Profile Generator", href: "/dashboard/supplier/growth/profile", icon: UserCircle, desc: "AI-powered profile with SEO & keywords", tier: "free" },
  { key: "website" as const, label: "Mini Website", href: "/dashboard/supplier/growth/website", icon: Globe, desc: "yourname.zanzibaba.com", tier: "premium" },
  { key: "catalog" as const, label: "Catalog Generator", href: "/dashboard/supplier/growth/catalog", icon: Package, desc: "Bulk import with AI descriptions", tier: "growth" },
  { key: "social" as const, label: "Social Content", href: "/dashboard/supplier/growth/social", icon: Share2, desc: "Weekly content calendar", tier: "growth" },
  { key: "seo" as const, label: "SEO Assistant", href: "/dashboard/supplier/growth/seo", icon: Search, desc: "Rank on Google", tier: "growth" },
  { key: "quotes" as const, label: "Quote Assistant", href: "/dashboard/supplier/growth/quotes", icon: FileText, desc: "Professional proposals", tier: "growth" },
  { key: "marketing" as const, label: "Marketing Assets", href: "/dashboard/supplier/growth/marketing", icon: PenTool, desc: "Brochures & flyers", tier: "premium" },
]

const tierColors: Record<string, string> = {
  free: "bg-green-100 text-green-700",
  growth: "bg-zanzibar-100 text-zanzibar-700",
  premium: "bg-gold-100 text-gold-700",
}

function ScoreCircle({ score, max, label }: { score: number; max: number; label: string }) {
  const pct = Math.round((score / max) * 100)
  const color = pct >= 70 ? "text-green-600" : pct >= 40 ? "text-yellow-600" : "text-red-600"
  const bg = pct >= 70 ? "stroke-green-500" : pct >= 40 ? "stroke-yellow-500" : "stroke-red-500"
  return (
    <div className="text-center">
      <div className="relative inline-flex items-center justify-center">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.5" fill="none" className={bg} strokeWidth="3" strokeDasharray={`${pct * 0.31} 100`} strokeLinecap="round" />
        </svg>
        <span className={`absolute text-sm font-bold ${color}`}>{pct}%</span>
      </div>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  )
}

export default function GrowthOverviewPage() {
  const [dashboard] = useState<GrowthDashboard>(defaultDashboard)
  const d = dashboard

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Growth Platform</h2>
          <p className="text-sm text-gray-500">Build your digital presence, attract buyers, and grow your business</p>
        </div>
        <Badge variant="warning" className="text-xs gap-1">
          <Zap className="h-3 w-3" /> Free Tier Active
        </Badge>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCircle score={d.profileStrength.score} max={d.profileStrength.max} label="Profile Strength" />
        <ScoreCircle score={d.seoScore.score} max={d.seoScore.max} label="SEO Score" />
        <ScoreCircle score={d.productCompleteness.score} max={d.productCompleteness.max} label="Product Score" />
        <ScoreCircle score={d.leadPerformance.conversionRate} max={100} label="Conversion Rate" />
      </div>

      {/* Modules Grid */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Growth Tools</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((mod) => {
            const Icon = mod.icon
            const active = d.moduleStatus[mod.key]
            return (
              <Link key={mod.key} href={mod.href}>
                <Card className="h-full hover:border-zanzibar-200 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zanzibar-50">
                        <Icon className="h-5 w-5 text-zanzibar-600" />
                      </div>
                      {active ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tierColors[mod.tier]}`}>
                          {mod.tier === "free" ? "Free" : mod.tier === "growth" ? "Growth" : "Premium"}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{mod.label}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{mod.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      {d.recommendations.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-zanzibar-600" />
              <h3 className="font-semibold text-gray-900">Growth Recommendations</h3>
            </div>
            <div className="space-y-2">
              {d.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                  {rec.priority === "high" ? (
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  ) : rec.priority === "medium" ? (
                    <Clock className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  ) : (
                    <ArrowRight className="h-5 w-5 text-zanzibar-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{rec.message}</p>
                    <p className="text-xs text-gray-500">{rec.action}</p>
                  </div>
                  <Badge variant={rec.priority === "high" ? "danger" : rec.priority === "medium" ? "warning" : "secondary"} className="text-[10px] shrink-0">
                    {rec.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Status */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-5 w-5 text-zanzibar-600" />
            <h3 className="font-semibold text-gray-900">Adoption Progress</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((mod) => {
              const active = d.moduleStatus[mod.key]
              const Icon = mod.icon
              return (
                <div key={mod.key} className={`flex items-center gap-3 rounded-lg p-3 ${active ? "bg-green-50" : "bg-gray-50"}`}>
                  <Icon className={`h-5 w-5 ${active ? "text-green-600" : "text-gray-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{mod.label}</p>
                    <p className="text-xs text-gray-500">{active ? "Completed" : "Not started"}</p>
                  </div>
                  {active && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
