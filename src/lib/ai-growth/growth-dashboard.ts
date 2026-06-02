import type { GrowthDashboard, ModuleStatus } from "./types"

export function computeGrowthDashboard(params: {
  profileExists: boolean
  websiteExists: boolean
  productsCount: number
  productsWithDescriptions: number
  productsWithPrices: number
  socialPostsTotal: number
  socialPostsPublished: number
  leadsTotal: number
  leadsThisMonth: number
  quotesSent: number
  profileScore?: number
  seoScore?: number
}): GrowthDashboard {
  const profileStrength = {
    score: calculateProfileStrength(params),
    max: 100,
  }
  const seoScore = {
    score: params.seoScore ?? calculateSEOScore(params),
    max: 100,
  }
  const productCompleteness = {
    score: calculateProductScore(params),
    max: 100,
  }
  const recommendations: GrowthDashboard["recommendations"] = []

  if (!params.profileExists) {
    recommendations.push({ category: "profile", priority: "high", message: "Your supplier profile is not yet created", action: "Create your profile using the AI Profile Generator to get discovered." })
  }
  if (!params.websiteExists) {
    recommendations.push({ category: "website", priority: "high", message: "You haven't created your mini website", action: "Generate a free mini website at yourname.zanzibaba.com" })
  }
  if (params.productsCount === 0) {
    recommendations.push({ category: "catalog", priority: "high", message: "No products listed", action: "Use the AI Catalog Generator to bulk import your products." })
  } else {
    if (productCompleteness.score < 60) {
      recommendations.push({ category: "catalog", priority: "medium", message: `${params.productsCount} products listed but ${params.productsWithDescriptions}/${params.productsCount} have descriptions`, action: "Enhance product descriptions for better search visibility." })
    }
  }
  if (params.socialPostsTotal === 0) {
    recommendations.push({ category: "social", priority: "medium", message: "No social media content created", action: "Generate a weekly content calendar to promote your products." })
  }
  if (seoScore.score < 50) {
    recommendations.push({ category: "seo", priority: "medium", message: "SEO score is low", action: "Create product pages, blog articles, and FAQs to improve Google ranking." })
  }
  if (params.quotesSent === 0) {
    recommendations.push({ category: "quotes", priority: "low", message: "No quotes sent yet", action: "Respond to RFQs with professional AI-generated quotes." })
  }
  if (params.leadsThisMonth === 0) {
    recommendations.push({ category: "leads", priority: "low", message: "No leads this month", action: "Complete your profile and products to attract more buyers." })
  }

  return {
    profileStrength, seoScore, productCompleteness,
    socialContentStatus: { total: params.socialPostsTotal, published: params.socialPostsPublished, draft: params.socialPostsTotal - params.socialPostsPublished },
    websiteStatus: { exists: params.websiteExists, pages: params.websiteExists ? 5 : 0, published: params.websiteExists },
    leadPerformance: { total: params.leadsTotal, thisMonth: params.leadsThisMonth, conversionRate: params.leadsTotal > 0 ? Math.round((params.quotesSent / params.leadsTotal) * 100) : 0 },
    recommendations,
    moduleStatus: computeModuleStatus(params),
  }
}

function calculateProfileStrength(p: { profileExists: boolean; profileScore?: number }): number {
  if (p.profileScore !== undefined) return p.profileScore
  return p.profileExists ? 60 : 0
}

function calculateSEOScore(p: { seoScore?: number; productsCount: number }): number {
  if (p.seoScore !== undefined) return p.seoScore
  let score = 10
  if (p.productsCount > 0) score += 20
  if (p.productsCount > 5) score += 15
  if (p.productsCount > 20) score += 20
  return Math.min(score, 85)
}

function calculateProductScore(p: { productsCount: number; productsWithDescriptions: number; productsWithPrices: number }): number {
  if (p.productsCount === 0) return 0
  const descScore = p.productsWithDescriptions / p.productsCount * 50
  const priceScore = p.productsWithPrices / p.productsCount * 30
  const countScore = Math.min(p.productsCount / 20, 1) * 20
  return Math.round(descScore + priceScore + countScore)
}

function computeModuleStatus(p: {
  profileExists: boolean; websiteExists: boolean; productsCount: number
  socialPostsTotal: number; seoScore?: number; quotesSent: number
}): ModuleStatus {
  return {
    profile: p.profileExists,
    website: p.websiteExists,
    catalog: p.productsCount > 0,
    social: p.socialPostsTotal > 0,
    seo: (p.seoScore ?? 0) > 30,
    quotes: p.quotesSent > 0,
    marketing: false,
  }
}
