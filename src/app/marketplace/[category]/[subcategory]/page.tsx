import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import {
  Package, Star, Shield, MapPin, ChevronDown, ArrowUpDown,
  Grid3x3, List, Filter, Check
} from "lucide-react"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-gold-400 text-gold-400" : "text-gray-200"}`} />
      ))}
    </div>
  )
}

const subcategoryNames: Record<string, string> = {
  "cement-lime": "Cement & Lime",
  "steel-reinforcement": "Steel & Reinforcement",
  "bricks-blocks": "Bricks & Blocks",
  "aggregates-sand": "Aggregates & Sand",
  "timber-plywood": "Timber & Plywood",
  "glass-glazing": "Glass & Glazing",
  "adhesives-sealants": "Adhesives & Sealants",
  "waterproofing": "Waterproofing",
  "living-room": "Living Room Furniture",
  "bedroom": "Bedroom Furniture",
  "dining-room": "Dining Room Furniture",
  "office-furniture": "Office Furniture",
  "outdoor-furniture": "Outdoor Furniture",
  "kitchen-cabinets": "Kitchen Cabinets",
  "countertops": "Countertops",
  "kitchen-appliances": "Kitchen Appliances",
  "sinks-faucets": "Sinks & Faucets",
  "kitchen-storage": "Kitchen Storage",
}

const products = [
  { name: "Portland Cement 42.5N (50kg)", price: "TSh 18,000", supplier: "Zanzibar Cement Ltd", rating: 4.7, reviews: 124, verified: true, moq: "100 bags" },
  { name: "White Cement (50kg)", price: "TSh 32,000", supplier: "Swahili Build Mart", rating: 4.5, reviews: 67, verified: true, moq: "50 bags" },
  { name: "Quicklime (25kg Bag)", price: "TSh 12,500", supplier: "Spice Island Hardware", rating: 4.3, reviews: 42, verified: true, moq: "20 bags" },
  { name: "Masonry Cement Type N (50kg)", price: "TSh 16,500", supplier: "BuildPro Solutions", rating: 4.4, reviews: 38, verified: false, moq: "100 bags" },
  { name: "Hydrated Lime (20kg)", price: "TSh 9,800", supplier: "East African Lime Ltd", rating: 4.2, reviews: 29, verified: true, moq: "50 bags" },
  { name: "Super Pozzolan Cement (50kg)", price: "TSh 15,500", supplier: "Zanzibar Cement Ltd", rating: 4.6, reviews: 88, verified: true, moq: "100 bags" },
  { name: "Cement Render Mix (25kg)", price: "TSh 8,500", supplier: "Modern Build Supplies", rating: 4.1, reviews: 35, verified: false, moq: "40 bags" },
  { name: "Colored Cement (Various)", price: "TSh 22,000", supplier: "Ocean View Interiors", rating: 4.0, reviews: 22, verified: true, moq: "30 bags" },
]

interface Props {
  params: Promise<{ category: string; subcategory: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await params
  const subName = subcategoryNames[subcategory] || subcategory
  const catDisplay = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${subName} - ${catDisplay} - Zanzibaba Marketplace`,
    description: `Browse ${subName.toLowerCase()} products and suppliers in Zanzibar. Find competitive prices and quality materials for your project.`,
  }
}

export default async function SubcategoryPage({ params }: Props) {
  const { category, subcategory } = await params
  const subName = subcategoryNames[subcategory]
  if (!subName) notFound()

  const catDisplay = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Marketplace", href: "/marketplace" },
            { label: catDisplay, href: `/marketplace/${category}` },
            { label: subName },
          ]}
        />
      </div>

      {/* Header */}
      <section className="border-b bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{subName}</h1>
          <p className="mt-1 text-gray-600">
            Browse {subName.toLowerCase()} products from verified suppliers in Zanzibar and East Africa.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
              <Check className="h-4 w-4" /> Verified Only
            </Button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort:</span>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                Best Match <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">{products.length}</span> products
            </span>
            <div className="flex items-center rounded-lg border border-gray-200">
              <button className="rounded-l-lg p-2 text-zanzibar-600 bg-zanzibar-50">
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button className="rounded-r-lg p-2 text-gray-400 hover:text-gray-600">
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.name} className="group overflow-hidden transition-all hover:shadow-lg">
              <Link href={`/marketplace/${category}/${subcategory}/${product.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-zanzibar-100 via-zanzibar-50 to-ocean-50">
                  <Package className="h-10 w-10 text-zanzibar-400" />
                </div>
              </Link>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="text-xs">{product.moq}</Badge>
                  {product.verified && <Shield className="h-4 w-4 text-zanzibar-600 shrink-0" />}
                </div>
                <Link href={`/marketplace/${category}/${subcategory}/${product.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-gray-500">{product.supplier}</p>
                <div className="mt-2 flex items-center gap-2">
                  <StarRating rating={product.rating} />
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-zanzibar-700">{product.price}</span>
                  <Button size="sm">Request Quote</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex items-center justify-center gap-2 pb-12">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="default" size="sm" className="bg-zanzibar-600">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <span className="text-gray-400">...</span>
          <Button variant="outline" size="sm">8</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  )
}
