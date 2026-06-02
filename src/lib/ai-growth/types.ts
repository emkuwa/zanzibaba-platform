export interface ProfileDraft {
  companyName: string
  companyOverview: string
  aboutUs: string
  mission: string
  seoDescription: string
  categories: { slug: string; name: string }[]
  keywords: string[]
  profileSummary: string
  tagline: string
}

export interface MiniWebsitePage {
  headline: string
  content: string
  sections?: { type: string; content: string }[]
}

export interface MiniWebsiteProduct {
  name: string
  description: string
  cta: string
}

export interface MiniWebsiteProject {
  name: string
  description: string
  imageUrl?: string
}

export interface MiniWebsite {
  slug: string
  companyName: string
  tagline: string
  industry: string
  pages: {
    home: MiniWebsitePage & { subheadline: string; heroCta: string }
    about: MiniWebsitePage & { mission: string; values: string[] }
    products: { headline: string; items: MiniWebsiteProduct[] }
    projects: { headline: string; items: MiniWebsiteProject[] }
    contact: { headline: string; phone: string; email: string; address: string; cta: string }
  }
  seo: { title: string; description: string; keywords: string[] }
  published: boolean
  publishedAt?: string
  theme: string
}

export interface CatalogProduct {
  name: string
  description: string
  category: string
  categorySlug: string
  specifications: { label: string; value: string }[]
  seoTitle: string
  seoDescription: string
  price?: number
  currency?: string
  unit?: string
  moq?: number
  brand?: string
  imageUrl?: string
}

export interface CatalogResult {
  products: CatalogProduct[]
  totalProducts: number
  source: string
}

export interface SocialPost {
  platform: "facebook" | "instagram" | "linkedin"
  type: "product" | "educational" | "promotional" | "company"
  title: string
  content: string
  hashtags: string[]
  imagePrompt?: string
  scheduledDate: string
  status: "draft" | "scheduled" | "published"
}

export interface SocialCalendar {
  weekStart: string
  theme: string
  posts: SocialPost[]
}

export interface SEOContent {
  categoryPages: { title: string; content: string; slug: string; metaDescription: string }[]
  productPages: { title: string; content: string; slug: string; metaDescription: string }[]
  blogArticles: { title: string; content: string; slug: string; excerpt: string; keywords: string[] }[]
  faqs: { question: string; answer: string }[]
  keywordSuggestions: { keyword: string; volume: string; difficulty: string }[]
}

export interface QuoteItem {
  description: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
}

export interface QuoteDraft {
  quoteNumber: string
  date: string
  validUntil: string
  supplierName: string
  clientName: string
  projectName: string
  items: QuoteItem[]
  subtotal: number
  tax: number
  total: number
  currency: string
  terms: string
  coverLetter: string
  deliveryInfo: string
}

export interface MarketingAsset {
  type: "profile" | "brochure" | "flyer" | "sales-sheet" | "capability-statement"
  title: string
  headline: string
  about: string
  products: { name: string; description: string }[]
  achievements: string[]
  contact: { phone: string; email: string; website: string }
  cta: string
}

export interface ModuleStatus {
  profile: boolean
  website: boolean
  catalog: boolean
  social: boolean
  seo: boolean
  quotes: boolean
  marketing: boolean
}

export interface GrowthDashboard {
  profileStrength: { score: number; max: number }
  seoScore: { score: number; max: number }
  productCompleteness: { score: number; max: number }
  socialContentStatus: { total: number; published: number; draft: number }
  websiteStatus: { exists: boolean; pages: number; published: boolean }
  leadPerformance: { total: number; thisMonth: number; conversionRate: number }
  recommendations: { category: string; priority: "high" | "medium" | "low"; message: string; action: string }[]
  moduleStatus: ModuleStatus
}
