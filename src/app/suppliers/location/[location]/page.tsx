import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import {
  Store, Star, Shield, MapPin, Award, Package, ChevronDown,
  FileText, MessageSquare, Map, Check
} from "lucide-react"

const locations = [
  "Stone Town", "Mkunazini", "Kiponda", "Fumba", "Michenzani",
  "Mombasa", "Dar es Salaam", "Chake Chake", "Mtangani",
]

const locationInfo: Record<string, { description: string; region: string }> = {
  "stone-town": { description: "the historic heart of Zanzibar City", region: "Unguja" },
  "mkunazini": { description: "a central neighborhood in Zanzibar City", region: "Unguja" },
  "kiponda": { description: "a vibrant area in Zanzibar City", region: "Unguja" },
  "fumba": { description: "a rapidly developing area on the southwestern coast of Unguja", region: "Unguja" },
  "michenzani": { description: "a bustling neighborhood in Zanzibar City", region: "Unguja" },
  "mombasa": { description: "the major port city on the Kenyan coast", region: "Kenya Coast" },
  "dar-es-salaam": { description: "Tanzania's largest city and commercial capital", region: "Dar es Salaam" },
  "chake-chake": { description: "the main town on Pemba Island", region: "Pemba" },
  "mtangani": { description: "a coastal area on the northeastern coast of Unguja", region: "Unguja" },
}

const suppliers = [
  { name: "Zanzibar Cement Ltd", location: "Stone Town", rating: 4.8, reviews: 124, verified: true, featured: true, products: 85, tier: "Premium" as const },
  { name: "Swahili Build Mart", location: "Mkunazini", rating: 4.7, reviews: 203, verified: true, featured: true, products: 320, tier: "Premium" as const },
  { name: "Ocean View Interiors", location: "Michenzani", rating: 4.6, reviews: 89, verified: true, featured: false, products: 156, tier: "Professional" as const },
  { name: "East African Steel Co", location: "Mombasa", rating: 4.9, reviews: 156, verified: true, featured: true, products: 210, tier: "Premium" as const },
  { name: "Spice Island Hardware", location: "Kiponda", rating: 4.5, reviews: 67, verified: true, featured: false, products: 450, tier: "Professional" as const },
  { name: "BuildPro Solutions", location: "Stone Town", rating: 4.4, reviews: 42, verified: true, featured: false, products: 98, tier: "Basic" as const },
  { name: "Modern Interiors Ltd", location: "Michenzani", rating: 4.7, reviews: 55, verified: true, featured: false, products: 134, tier: "Professional" as const },
  { name: "Tropical Roofing Solutions", location: "Fumba", rating: 4.3, reviews: 38, verified: false, featured: false, products: 67, tier: "Basic" as const },
  { name: "Green Energy Solutions", location: "Stone Town", rating: 4.6, reviews: 72, verified: true, featured: false, products: 45, tier: "Professional" as const },
  { name: "Cool Breeze HVAC", location: "Kiponda", rating: 4.4, reviews: 63, verified: true, featured: false, products: 52, tier: "Basic" as const },
  { name: "Modular Homes Ltd", location: "Fumba", rating: 4.8, reviews: 91, verified: true, featured: true, products: 28, tier: "Premium" as const },
  { name: "Premium Paints Tanzania", location: "Mkunazini", rating: 4.5, reviews: 47, verified: true, featured: false, products: 175, tier: "Professional" as const },
  { name: "Luxury Kitchen Studio", location: "Stone Town", rating: 4.7, reviews: 38, verified: true, featured: false, products: 64, tier: "Professional" as const },
  { name: "Pemba Pools & Spas", location: "Michenzani", rating: 4.2, reviews: 21, verified: false, featured: false, products: 33, tier: "Basic" as const },
  { name: "Stone Town Lighting Co", location: "Stone Town", rating: 4.5, reviews: 44, verified: true, featured: false, products: 280, tier: "Professional" as const },
  { name: "Hospitality Equipment ZNZ", location: "Mkunazini", rating: 4.6, reviews: 57, verified: true, featured: false, products: 190, tier: "Professional" as const },
  { name: "Garden & Landscape Supplies", location: "Fumba", rating: 4.3, reviews: 29, verified: false, featured: false, products: 120, tier: "Basic" as const },
  { name: "Marine & Container Homes", location: "Kiponda", rating: 4.6, reviews: 33, verified: true, featured: true, products: 15, tier: "Premium" as const },
]

function formatLocationName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

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
  params: Promise<{ location: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params
  const locName = formatLocationName(location)
  const info = locationInfo[location]
  if (!info) return { title: "Location Not Found - Zanzibaba" }
  return {
    title: `${locName} Building Material Suppliers | Zanzibaba`,
    description: `Find verified building material suppliers in ${locName}, ${info.region}. Browse company profiles, product catalogs, and get competitive quotes.`,
  }
}

export default async function SuppliersByLocationPage({ params }: Props) {
  const { location } = await params
  const locName = formatLocationName(location)
  const info = locationInfo[location]
  if (!info) notFound()

  const filteredSuppliers = suppliers.filter(
    (s) => s.location.toLowerCase() === locName.toLowerCase()
  )

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Suppliers", href: "/suppliers" },
            { label: locName },
          ]}
        />
      </div>

      <section className="bg-gradient-to-br from-zanzibar-800 via-zanzibar-700 to-emerald-800 py-12 lg:py-16 mt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Building Material Suppliers in {locName}, Zanzibar
            </h1>
            <p className="mt-3 text-zanzibar-100 text-lg">
              Connect with trusted suppliers serving {locName} and surrounding areas.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Category:</span>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                All Categories <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-zanzibar-600 focus:ring-zanzibar-500" />
              <Shield className="h-4 w-4 text-zanzibar-600" />
              Verified Only
            </label>
            <span className="ml-auto text-sm text-gray-500">
              <span className="font-medium text-gray-900">{filteredSuppliers.length}</span> suppliers in {locName}
            </span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {filteredSuppliers.length === 0 ? (
                <div className="py-16 text-center">
                  <Store className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">No suppliers found in {locName}</h3>
                  <p className="mt-2 text-sm text-gray-500">We are expanding our network. Check back soon.</p>
                  <Link href="/rfq" className="mt-4 inline-block">
                    <Button>
                      <FileText className="mr-2 h-4 w-4" /> Post an RFQ
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
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
                          <Badge variant={supplier.tier === "Premium" ? "default" : "secondary"} className="text-xs">
                            {supplier.tier}
                          </Badge>
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
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="mt-1 text-sm text-gray-500">{locName}, {info.region}</p>
                  <div className="mt-4 flex h-48 items-center justify-center rounded-lg bg-gray-100">
                    <div className="text-center">
                      <Map className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Map of {locName}</p>
                      <p className="text-xs text-gray-400">Interactive map loading...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-zanzibar-50 to-gold-50 border-zanzibar-100">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900">Can&apos;t find what you need?</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Post an RFQ and get quotes from suppliers across Zanzibar and East Africa.
                  </p>
                  <Link href="/rfq" className="mt-4 block">
                    <Button className="w-full gap-2">
                      <FileText className="h-4 w-4" /> Post an RFQ
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900">
              Building Material Suppliers in {locName}, {info.region}
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
              <p>
                {locName} is {info.description}, home to a growing community of building material
                suppliers serving the local construction industry. Whether you are building a new home,
                renovating a hotel, or developing commercial property, you will find reliable suppliers
                in {locName} offering everything from cement and steel to tiles and plumbing fixtures.
              </p>
              <p>
                Zanzibaba connects you with {filteredSuppliers.length} verified suppliers in {locName}.
                Browse company profiles, compare ratings and product catalogs, and contact suppliers
                directly to get the best prices for your project.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
