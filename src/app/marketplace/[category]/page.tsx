import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import {
  Building2, Sofa, CookingPot, Shirt, Bath, Lightbulb, DoorOpen, Home, Zap,
  Thermometer, Trees, Waves, UtensilsCrossed, Package, Star, Shield, Check,
  ChevronRight, Filter, SlidersHorizontal, Grid3x3, List, MapPin, Warehouse,
  Container, Building, Store, HardHat, PencilRuler, Truck, MoveRight,
  ArrowUpDown, ChevronDown, FileText
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

const categoryMap: Record<string, { name: string; description: string; icon: any; subcategories: { name: string; slug: string; count: string }[] }> = {
  "building-materials": {
    name: "Building Materials",
    description: "Cement, steel, aggregates, bricks, blocks, and all core construction materials for any project size.",
    icon: Building2,
    subcategories: [
      { name: "Cement & Lime", slug: "cement-lime", count: "120+" },
      { name: "Steel & Reinforcement", slug: "steel-reinforcement", count: "85+" },
      { name: "Bricks & Blocks", slug: "bricks-blocks", count: "60+" },
      { name: "Aggregates & Sand", slug: "aggregates-sand", count: "40+" },
      { name: "Timber & Plywood", slug: "timber-plywood", count: "95+" },
      { name: "Glass & Glazing", slug: "glass-glazing", count: "55+" },
      { name: "Adhesives & Sealants", slug: "adhesives-sealants", count: "70+" },
      { name: "Waterproofing", slug: "waterproofing", count: "45+" },
    ],
  },
  "furniture": {
    name: "Furniture",
    description: "Residential and commercial furniture including sofas, beds, tables, chairs, and custom pieces.",
    icon: Sofa,
    subcategories: [
      { name: "Living Room", slug: "living-room", count: "200+" },
      { name: "Bedroom", slug: "bedroom", count: "180+" },
      { name: "Dining Room", slug: "dining-room", count: "120+" },
      { name: "Office Furniture", slug: "office-furniture", count: "150+" },
      { name: "Outdoor Furniture", slug: "outdoor-furniture", count: "90+" },
    ],
  },
  "kitchens": {
    name: "Kitchens",
    description: "Complete kitchen solutions from cabinets and countertops to appliances and fixtures.",
    icon: CookingPot,
    subcategories: [
      { name: "Kitchen Cabinets", slug: "kitchen-cabinets", count: "80+" },
      { name: "Countertops", slug: "countertops", count: "60+" },
      { name: "Kitchen Appliances", slug: "kitchen-appliances", count: "120+" },
      { name: "Sinks & Faucets", slug: "sinks-faucets", count: "70+" },
      { name: "Kitchen Storage", slug: "kitchen-storage", count: "50+" },
    ],
  },
}

const products = [
  { name: "Portland Cement 42.5N (50kg)", price: "TSh 18,000", supplier: "Zanzibar Cement Ltd", location: "Stone Town", rating: 4.7, reviews: 124, verified: true, moq: "100 bags" },
  { name: "Grade 60 Deformed Steel Bars 12mm", price: "TSh 85,000", supplier: "East African Steel Co", location: "Mombasa", rating: 4.9, reviews: 89, verified: true, moq: "1 ton" },
  { name: "Premium Ceramic Floor Tiles 60x60", price: "TSh 25,000", supplier: "Ocean View Interiors", location: "Michenzani", rating: 4.6, reviews: 156, verified: true, moq: "50 boxes" },
  { name: "River Sand (Per Ton)", price: "TSh 45,000", supplier: "Spice Island Hardware", location: "Kiponda", rating: 4.3, reviews: 67, verified: true, moq: "5 tons" },
  { name: "6mm Plywood Board (8x4ft)", price: "TSh 32,000", supplier: "Swahili Build Mart", location: "Mkunazini", rating: 4.5, reviews: 203, verified: true, moq: "20 sheets" },
  { name: "Double Glazed Window Unit", price: "TSh 180,000", supplier: "Modern Windows Ltd", location: "Fumba", rating: 4.4, reviews: 42, verified: false, moq: "10 units" },
  { name: "Bitumen Waterproofing Membrane", price: "TSh 95,000", supplier: "BuildPro Solutions", location: "Stone Town", rating: 4.2, reviews: 38, verified: true, moq: "1 roll" },
  { name: "Construction Nails 4 inch (Box)", price: "TSh 12,000", supplier: "Spice Island Hardware", location: "Kiponda", rating: 4.1, reviews: 95, verified: true, moq: "10 boxes" },
]

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = categoryMap[category]
  if (!cat) return { title: "Category Not Found - Zanzibaba" }
  return {
    title: `${cat.name} - Zanzibaba Marketplace`,
    description: cat.description,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = categoryMap[category]
  if (!cat) notFound()

  const Icon = cat.icon

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Marketplace", href: "/marketplace" }, { label: cat.name }]} />
      </div>

      {/* Category Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zanzibar-800 via-zanzibar-700 to-emerald-800 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">{cat.name}</h1>
              <p className="mt-1 text-zanzibar-100">{cat.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Subcategories */}
        <section className="py-8">
          <h2 className="text-lg font-semibold text-gray-900">Subcategories</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {cat.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/marketplace/${category}/${sub.slug}`}
                className="group rounded-lg border border-gray-200 p-4 text-center transition-all hover:border-zanzibar-200 hover:bg-zanzibar-50"
              >
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-zanzibar-600">{sub.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{sub.count}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* RFQ CTA for Category */}
        <section className="border-b bg-gradient-to-r from-zanzibar-50 to-gold-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-gray-900">
                Bulk quotes for <span className="text-zanzibar-600">{categoryMap[category]?.name || 'this category'}</span>?
              </p>
              <p className="text-sm text-gray-500">Post one RFQ, get multiple competitive quotes from verified suppliers.</p>
            </div>
            <Link href={`/rfq?category=${category}`}>
              <Button className="bg-gold-500 hover:bg-gold-600 text-white shrink-0">
                <FileText className="mr-2 h-4 w-4" /> Post RFQ
              </Button>
            </Link>
          </div>
        </section>

        {/* Filters & Products */}
        <div className="py-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" /> Filters
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
                <Check className="h-4 w-4" /> Verified Only
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-500">Location:</span>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                  All Locations <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-500">Price:</span>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                  All Prices <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                <ArrowUpDown className="h-4 w-4" /> Sort
              </button>
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

          {/* Results Info */}
          <div className="mt-4 text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{products.length}</span> products in {cat.name}
          </div>

          {/* Product Grid */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Card key={product.name} className="group overflow-hidden transition-all hover:shadow-lg">
                <Link href={`/marketplace/${category}/all/${product.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-zanzibar-100 via-zanzibar-50 to-ocean-50">
                    <Package className="h-10 w-10 text-zanzibar-400" />
                  </div>
                </Link>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-xs">{product.moq}</Badge>
                    {product.verified && (
                      <Shield className="h-4 w-4 text-zanzibar-600 shrink-0" />
                    )}
                  </div>
                  <Link href={`/marketplace/${category}/all/${product.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">{product.supplier}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" /> {product.location}
                  </div>
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
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="default" size="sm" className="bg-zanzibar-600">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="text-gray-400">...</span>
            <Button variant="outline" size="sm">12</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>

        {/* SEO Section */}
        <Separator />
        <section className="py-12">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900">Why Source {cat.name} on Zanzibaba?</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
              <p>
                Find the best {cat.name.toLowerCase()} suppliers in Zanzibar and East Africa. 
                Our platform connects you with verified vendors offering competitive prices, 
                bulk discounts, and reliable delivery across the archipelago.
              </p>
              <p>
                Every supplier is vetted, and product listings include detailed specifications, 
                pricing, and MOQ information. Post an RFQ to receive competitive quotes from 
                multiple suppliers, ensuring you get the best value for your project.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
