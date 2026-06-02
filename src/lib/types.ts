export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface CategoryItem {
  name: string
  slug: string
  icon: string
  imageUrl?: string
  count?: number
  children?: CategoryItem[]
}

export interface SupplierCard {
  id: string
  companyName: string
  companyLogoUrl: string | null
  city: string | null
  avgRating: number
  reviewCount: number
  verificationBadge: boolean
  isFeatured: boolean
  slug: string
  products?: { images: string[] }[]
}

export interface ProductCard {
  id: string
  name: string
  slug: string
  price: number | null
  images: string[]
  supplier: {
    companyName: string
    slug: string
    verificationBadge: boolean
    avgRating: number
  }
  category: {
    name: string
    slug: string
  }
}

export interface RFQFormData {
  categoryId: string
  title: string
  description: string
  quantity: number
  unit: string
  budgetMin: number
  budgetMax: number
  currency: string
  deliveryLocation: string
  deliveryTimeline: string
  documents: File[]
}

export interface DashboardStat {
  label: string
  value: string | number
  change?: string
  changeType?: "up" | "down"
  icon: string
}

export interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
  href?: string
}

export interface MembershipPlan {
  tier: "free" | "basic" | "professional" | "enterprise"
  name: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}
