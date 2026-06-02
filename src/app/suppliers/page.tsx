import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SearchBar } from "@/components/layout/search-bar"
import {
  Store, Star, Shield, MapPin, Award, Package, ChevronDown, Filter,
  Search, Check, MessageSquare, Users, HardHat
} from "lucide-react"

export const metadata: Metadata = {
  title: "Suppliers Directory - Zanzibaba",
  description: "Find verified building material suppliers in Zanzibar. Browse company profiles, ratings, and product catalogs.",
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

export default function SuppliersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Find Trusted Suppliers in Zanzibar
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Connect with 500+ verified companies offering building materials, furniture, fixtures, and services across the archipelago.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Supplier CTA Banner */}
      <section className="bg-gradient-to-r from-zanzibar-800 to-emerald-800 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/auth/register/supplier" className="inline-flex items-center gap-1.5 rounded-lg bg-gold-500 px-4 py-2 font-semibold text-white hover:bg-gold-600 transition-colors shadow-md">
              <Store className="h-4 w-4" /> Join Free
            </Link>
            <Link href="/dashboard/supplier/verification" className="inline-flex items-center gap-1.5 text-zanzibar-100 hover:text-white transition-colors">
              <Shield className="h-4 w-4" /> Get Verified
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-1.5 text-zanzibar-100 hover:text-white transition-colors">
              <Award className="h-4 w-4" /> Become Featured
            </Link>
            <span className="inline-flex items-center gap-1.5 text-zanzibar-200">
              <MessageSquare className="h-4 w-4" /> Receive RFQs
            </span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Category:</span>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                All Categories <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
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
              <span className="font-medium text-gray-900">{suppliers.length}</span> suppliers found
            </span>
          </div>
        </div>
      </section>

      {/* Supplier Grid */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
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

          {/* Bottom CTA */}
          <div className="mt-10 rounded-2xl bg-gradient-to-r from-zanzibar-800 to-emerald-800 p-8 text-center">
            <h3 className="text-xl font-bold text-white">Not Listed Yet?</h3>
            <p className="mt-2 text-sm text-zanzibar-200 max-w-lg mx-auto">
              Join Zanzibaba&apos;s Founding Supplier Program. Get priority visibility, verification support, 
              and direct access to RFQ opportunities from developers and contractors across Zanzibar.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link href="/auth/register/supplier" className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 font-semibold text-white hover:bg-gold-600 transition-colors shadow-lg">
                <Store className="h-5 w-5" /> Join Free — List Your Products
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-medium text-white hover:bg-white/10 transition-colors">
                <Award className="h-5 w-5" /> View Pricing & Benefits
              </Link>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="default" size="sm" className="bg-zanzibar-600">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="text-gray-400">...</span>
            <Button variant="outline" size="sm">18</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
