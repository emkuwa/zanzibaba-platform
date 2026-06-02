import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/layout/search-bar"
import { CategoryNav } from "@/components/layout/category-nav"
import {
  Building2, Sofa, CookingPot, Shirt, Bath, Lightbulb, DoorOpen, Home, Zap,
  Thermometer, Trees, Waves, UtensilsCrossed, Package, Star, Shield, FileText,
  ChevronRight, Warehouse, Container, Building, Hotel, HardHat, PencilRuler,
  Truck
} from "lucide-react"

export const metadata: Metadata = {
  title: "Marketplace - Zanzibaba",
  description: "Browse thousands of building materials, furniture, kitchens, and more from verified suppliers in Zanzibar.",
}

const allCategories = [
  { name: "Building Materials", slug: "building-materials", icon: Building2, count: "2,400+" },
  { name: "Furniture", slug: "furniture", icon: Sofa, count: "1,800+" },
    { name: "Kitchens", slug: "kitchens", icon: CookingPot, count: "600+" },
  { name: "Wardrobes", slug: "wardrobes", icon: Shirt, count: "400+" },
  { name: "Sanitary & Plumbing", slug: "sanitary", icon: Bath, count: "900+" },
  { name: "Lighting", slug: "lighting", icon: Lightbulb, count: "1,200+" },
  { name: "Doors & Windows", slug: "doors-windows", icon: DoorOpen, count: "700+" },
  { name: "Roofing", slug: "roofing", icon: Home, count: "300+" },
  { name: "Electrical", slug: "electrical", icon: Zap, count: "850+" },
  { name: "HVAC", slug: "hvac", icon: Thermometer, count: "250+" },
  { name: "Landscaping", slug: "landscaping", icon: Trees, count: "180+" },
  { name: "Pools", slug: "pools", icon: Waves, count: "120+" },
  { name: "Hospitality Equipment", slug: "hospitality-equipment", icon: UtensilsCrossed, count: "500+" },
  { name: "Prefab Houses", slug: "prefab-houses", icon: Warehouse, count: "200+" },
  { name: "Modular Buildings", slug: "modular-buildings", icon: Container, count: "150+" },
  { name: "Tools & Equipment", slug: "tools-equipment", icon: HardHat, count: "1,100+" },
  { name: "Paints & Finishes", slug: "paints-finishes", icon: PencilRuler, count: "650+" },
  { name: "Security Systems", slug: "security", icon: Shield, count: "300+" },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-gold-400 text-gold-400" : "text-gray-200"}`} />
      ))}
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Building Materials Marketplace
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Browse thousands of products across 18+ categories. Source directly from verified suppliers across East Africa and beyond.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <CategoryNav className="border-b border-gray-200" />

      {/* Categories Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">All Categories</h2>
          <p className="mt-1 text-gray-600">Explore our comprehensive range of product categories</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {allCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.slug}
                  href={`/marketplace/${cat.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-zanzibar-200 hover:shadow-lg hover:shadow-zanzibar-100/50"
                >
                  <div className="mx-auto mb-3 inline-flex rounded-lg bg-zanzibar-50 p-3 text-zanzibar-600 group-hover:bg-zanzibar-100">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{cat.count}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-1 text-gray-600">Top-rated products from leading suppliers</p>
            </div>
            <Link href="/marketplace?sort=featured" className="hidden items-center gap-1 text-sm font-medium text-zanzibar-600 sm:flex">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Premium Portland Cement 50kg", price: "TSh 18,000", supplier: "Zanzibar Cement Ltd", rating: 4.7 },
              { name: "Italian Marble Tiles 80x80", price: "TSh 85,000", supplier: "Ocean View Interiors", rating: 4.9 },
              { name: "Complete Kitchen Set 10ft", price: "TSh 2,500,000", supplier: "Swahili Build Mart", rating: 4.6 },
              { name: "3-Bedroom Prefab House Kit", price: "TSh 45,000,000", supplier: "Modular Homes Ltd", rating: 4.8 },
            ].map((product) => (
              <Card key={product.name} className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-zanzibar-100 via-zanzibar-50 to-ocean-50">
                  <Package className="h-10 w-10 text-zanzibar-400" />
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.supplier}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-gray-500">{product.rating}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-zanzibar-700">{product.price}</span>
                    <Button size="sm" variant="outline">Quote</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* RFQ CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-zanzibar-800 to-emerald-800 py-16">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white">Need a Custom Quote?</h2>
            <p className="mt-3 text-lg text-zanzibar-100">
              Post your requirements and receive competitive quotes from multiple suppliers within 24 hours.
            </p>
            <Link
              href="/rfq"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-gold-500 px-8 text-base font-semibold text-white shadow-lg hover:bg-gold-600"
            >
              <FileText className="h-5 w-5" />
              Post an RFQ
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900">The Most Comprehensive Building Marketplace in Zanzibar</h2>
            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
              <p>
                Zanzibaba brings together the entire building and construction ecosystem in one platform. 
                From cement and steel to luxury kitchens and prefab homes, our marketplace connects you 
                with verified suppliers across Zanzibar, mainland Tanzania, and international markets.
              </p>
              <p>
                Whether you are a contractor sourcing materials for a large development, a homeowner 
                planning a renovation, or a hospitality developer furnishing a resort, you will find 
                everything you need on Zanzibaba. Every supplier is vetted, every product is categorized, 
                and every transaction is supported by our platform.
              </p>
              <p>
                Post an RFQ for bulk pricing, compare suppliers side by side, and connect directly via 
                WhatsApp or our in-platform messaging. Join thousands of businesses already building 
                with Zanzibaba.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
