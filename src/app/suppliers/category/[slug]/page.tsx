import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import {
  Store, Star, Shield, MapPin, Award, Package, ChevronDown, Filter,
  FileText, Building2, Sofa, CookingPot, Shirt, Bath, Lightbulb, DoorOpen,
  Home, Zap, Thermometer, Trees, Waves, UtensilsCrossed, Warehouse, Container,
  MessageSquare, Check
} from "lucide-react"

const categoryMap: Record<string, { name: string; description: string; icon: any }> = {
  "building-materials": { name: "Building Materials", description: "Cement, steel, aggregates, bricks, blocks, and all core construction materials for any project size.", icon: Building2 },
  "furniture": { name: "Furniture", description: "Residential and commercial furniture including sofas, beds, tables, chairs, and custom pieces.", icon: Sofa },
  "kitchens": { name: "Kitchens", description: "Complete kitchen solutions from cabinets and countertops to appliances and fixtures.", icon: CookingPot },
  "wardrobes": { name: "Wardrobes", description: "Custom and ready-made wardrobe solutions for bedrooms and dressing rooms.", icon: Shirt },
  "sanitary": { name: "Sanitary & Plumbing", description: "Bathroom fixtures, sanitary ware, pipes, fittings, and plumbing supplies.", icon: Bath },
  "lighting": { name: "Lighting", description: "Indoor and outdoor lighting fixtures, bulbs, chandeliers, and smart lighting.", icon: Lightbulb },
  "doors-windows": { name: "Doors & Windows", description: "Interior and exterior doors, windows, sliding systems, and accessories.", icon: DoorOpen },
  "roofing": { name: "Roofing", description: "Roofing sheets, tiles, insulation, gutters, and complete roofing systems.", icon: Home },
  "electrical": { name: "Electrical", description: "Cables, switches, sockets, panels, and all electrical installation materials.", icon: Zap },
  "hvac": { name: "HVAC", description: "Air conditioning, ventilation, heating systems, and climate control solutions.", icon: Thermometer },
  "landscaping": { name: "Landscaping", description: "Garden materials, paving stones, outdoor tiles, and landscape supplies.", icon: Trees },
  "pools": { name: "Pools", description: "Swimming pool equipment, liners, pumps, filters, and maintenance supplies.", icon: Waves },
  "hospitality-equipment": { name: "Hospitality Equipment", description: "Commercial kitchen equipment, hotel supplies, and hospitality fixtures.", icon: UtensilsCrossed },
  "prefab-houses": { name: "Prefab Houses", description: "Prefabricated houses, container homes, and modular building solutions.", icon: Warehouse },
  "modular-buildings": { name: "Modular Buildings", description: "Commercial modular buildings, offices, and expandable container units.", icon: Container },
}

const suppliers = [
  { name: "Zanzibar Cement Ltd", location: "Stone Town", rating: 4.8, reviews: 124, verified: true, featured: true, products: 85, tier: "Premium" as const, categories: ["building-materials"] },
  { name: "Swahili Build Mart", location: "Mkunazini", rating: 4.7, reviews: 203, verified: true, featured: true, products: 320, tier: "Premium" as const, categories: ["building-materials", "furniture", "lighting"] },
  { name: "Ocean View Interiors", location: "Michenzani", rating: 4.6, reviews: 89, verified: true, featured: false, products: 156, tier: "Professional" as const, categories: ["furniture", "lighting", "doors-windows"] },
  { name: "East African Steel Co", location: "Mombasa", rating: 4.9, reviews: 156, verified: true, featured: true, products: 210, tier: "Premium" as const, categories: ["building-materials", "roofing"] },
  { name: "Spice Island Hardware", location: "Kiponda", rating: 4.5, reviews: 67, verified: true, featured: false, products: 450, tier: "Professional" as const, categories: ["building-materials", "sanitary", "electrical", "doors-windows"] },
  { name: "BuildPro Solutions", location: "Stone Town", rating: 4.4, reviews: 42, verified: true, featured: false, products: 98, tier: "Basic" as const, categories: ["building-materials", "roofing"] },
  { name: "Modern Interiors Ltd", location: "Michenzani", rating: 4.7, reviews: 55, verified: true, featured: false, products: 134, tier: "Professional" as const, categories: ["furniture", "kitchens", "wardrobes"] },
  { name: "Tropical Roofing Solutions", location: "Fumba", rating: 4.3, reviews: 38, verified: false, featured: false, products: 67, tier: "Basic" as const, categories: ["roofing"] },
  { name: "Green Energy Solutions", location: "Stone Town", rating: 4.6, reviews: 72, verified: true, featured: false, products: 45, tier: "Professional" as const, categories: ["electrical", "hvac"] },
  { name: "Cool Breeze HVAC", location: "Kiponda", rating: 4.4, reviews: 63, verified: true, featured: false, products: 52, tier: "Basic" as const, categories: ["hvac"] },
  { name: "Modular Homes Ltd", location: "Fumba", rating: 4.8, reviews: 91, verified: true, featured: true, products: 28, tier: "Premium" as const, categories: ["prefab-houses", "modular-buildings"] },
  { name: "Premium Paints Tanzania", location: "Mkunazini", rating: 4.5, reviews: 47, verified: true, featured: false, products: 175, tier: "Professional" as const, categories: ["building-materials"] },
  { name: "Luxury Kitchen Studio", location: "Stone Town", rating: 4.7, reviews: 38, verified: true, featured: false, products: 64, tier: "Professional" as const, categories: ["kitchens", "furniture"] },
  { name: "Pemba Pools & Spas", location: "Michenzani", rating: 4.2, reviews: 21, verified: false, featured: false, products: 33, tier: "Basic" as const, categories: ["pools", "landscaping"] },
  { name: "Stone Town Lighting Co", location: "Stone Town", rating: 4.5, reviews: 44, verified: true, featured: false, products: 280, tier: "Professional" as const, categories: ["lighting", "electrical"] },
  { name: "Hospitality Equipment ZNZ", location: "Mkunazini", rating: 4.6, reviews: 57, verified: true, featured: false, products: 190, tier: "Professional" as const, categories: ["hospitality-equipment", "kitchens"] },
  { name: "Garden & Landscape Supplies", location: "Fumba", rating: 4.3, reviews: 29, verified: false, featured: false, products: 120, tier: "Basic" as const, categories: ["landscaping"] },
  { name: "Marine & Container Homes", location: "Kiponda", rating: 4.6, reviews: 33, verified: true, featured: true, products: 15, tier: "Premium" as const, categories: ["modular-buildings", "prefab-houses"] },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? "fill-gold-400 text-gold-400" : "text-gray-200"}`} />
      ))}
      <span className="ml-1.5 text-sm font-medium text-gray-600">{rating}</span>
    </div>
  )
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = categoryMap[slug]
  if (!cat) return { title: "Category Not Found - Zanzibaba" }
  return {
    title: `${cat.name} Suppliers in Zanzibar | Zanzibaba`,
    description: `Find verified ${cat.name.toLowerCase()} suppliers in Zanzibar. Browse company profiles, ratings, and product catalogs. Get competitive quotes for your project.`,
  }
}

export default async function SuppliersByCategoryPage({ params }: Props) {
  const { slug } = await params
  const cat = categoryMap[slug]
  if (!cat) notFound()

  const Icon = cat.icon
  const filteredSuppliers = suppliers.filter((s) => s.categories.includes(slug))

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Suppliers", href: "/suppliers" },
            { label: cat.name },
          ]}
        />
      </div>

      <section className="bg-gradient-to-br from-zanzibar-800 via-zanzibar-700 to-emerald-800 py-12 lg:py-16 mt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Find {cat.name} Suppliers in Zanzibar
              </h1>
              <p className="mt-1 text-zanzibar-100">{cat.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Location:</span>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                All Locations <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Membership:</span>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                All Tiers <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-zanzibar-600 focus:ring-zanzibar-500" />
              <Shield className="h-4 w-4 text-zanzibar-600" />
              Verified Only
            </label>
            <span className="ml-auto text-sm text-gray-500">
              <span className="font-medium text-gray-900">{filteredSuppliers.length}</span> suppliers found
            </span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredSuppliers.length === 0 ? (
            <div className="py-16 text-center">
              <Store className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No suppliers found</h3>
              <p className="mt-2 text-sm text-gray-500">No suppliers listed in this category yet.</p>
              <Link href="/rfq" className="mt-4 inline-block">
                <Button>
                  <FileText className="mr-2 h-4 w-4" /> Post an RFQ
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.name} className="group transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                          <Store className="h-7 w-7 text-zanzibar-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link href={`/suppliers/${supplier.name.toLowerCase().replace(/\s+/g, "-")}`} className="font-semibold text-gray-900 hover:text-zanzibar-600">
                              {supplier.name}
                            </Link>
                            {supplier.verified && <Shield className="h-4 w-4 text-zanzibar-600 shrink-0" />}
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-3.5 w-3.5" /> {supplier.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {supplier.featured && (
                          <Badge variant="warning" className="text-xs">
                            <Award className="mr-1 h-3 w-3" /> Featured
                          </Badge>
                        )}
                        <Badge variant={supplier.tier === "Premium" ? "default" : "secondary"} className="text-xs">
                          {supplier.tier}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <StarRating rating={supplier.rating} />
                      <span className="text-xs text-gray-500">({supplier.reviews} reviews)</span>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
                      <Package className="h-4 w-4" />
                      <span>{supplier.products} products listed</span>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex gap-2">
                      <Link href={`/suppliers/${supplier.name.toLowerCase().replace(/\s+/g, "-")}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Store className="mr-1.5 h-4 w-4" /> View Profile
                        </Button>
                      </Link>
                      <Button variant="default" size="sm" className="flex-1">
                        <MessageSquare className="mr-1.5 h-4 w-4" /> Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredSuppliers.length > 6 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="default" size="sm" className="bg-zanzibar-600">1</Button>
              {filteredSuppliers.length > 6 && <Button variant="outline" size="sm">2</Button>}
              {filteredSuppliers.length > 12 && (
                <>
                  <span className="text-gray-400">...</span>
                  <Button variant="outline" size="sm">{Math.ceil(filteredSuppliers.length / 6)}</Button>
                </>
              )}
              <Button variant="outline" size="sm">Next</Button>
            </div>
          )}
        </div>
      </section>

      <section className="border-y bg-gradient-to-r from-zanzibar-50 to-gold-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-gray-900">
                Need {cat.name.toLowerCase()} for your project?
              </p>
              <p className="text-sm text-gray-500">Post one RFQ and get multiple competitive quotes from verified suppliers.</p>
            </div>
            <Link href={`/rfq?category=${slug}`}>
              <Button className="bg-gold-500 hover:bg-gold-600 text-white shrink-0 gap-2">
                <FileText className="h-4 w-4" /> Post RFQ for {cat.name}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900">Why Source {cat.name} from Zanzibaba?</h2>
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
        </div>
      </section>
    </div>
  )
}
