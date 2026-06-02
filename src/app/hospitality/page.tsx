import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/layout/search-bar"
import {
  Building2, Star, Shield, MapPin, Award, UtensilsCrossed, Hotel,
  Waves, Sofa, Shirt, Bath, ChefHat, Trees, Package, ChevronRight,
  Quote, Users, MessageSquare
} from "lucide-react"

export const metadata: Metadata = {
  title: "Hospitality Solutions - Zanzibaba",
  description: "Complete hospitality sourcing solutions for hotels, resorts, and restaurants in Zanzibar.",
}

const subcategories = [
  { name: "Hotel Furniture", icon: Sofa, count: "320+" },
  { name: "Commercial Kitchen", icon: ChefHat, count: "180+" },
  { name: "Laundry Equipment", icon: Shirt, count: "90+" },
  { name: "Housekeeping", icon: Bath, count: "150+" },
  { name: "Pool & Recreation", icon: Waves, count: "70+" },
  { name: "Restaurant Furniture", icon: UtensilsCrossed, count: "210+" },
  { name: "Bar Equipment", icon: Quote, count: "110+" },
  { name: "Spa Equipment", icon: Trees, count: "60+" },
]

export default function HospitalityPage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-zanzibar-950 to-emerald-950 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-ocean-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="warning" className="mb-4 px-4 py-1.5 text-sm">
              <Hotel className="mr-1.5 h-4 w-4" /> Hospitality Solutions
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Hospitality Solutions for Zanzibar&apos;s Growing Tourism Sector
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Source everything your hotel, resort, or restaurant needs — from furniture and kitchen equipment 
              to pool systems and spa amenities. One platform, endless possibilities.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Hospitality Categories</h2>
          <p className="mt-1 text-gray-600">Everything you need to outfit your hospitality project</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {subcategories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.name}
                  href={`/marketplace/hospitality/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-zanzibar-200 hover:shadow-lg hover:shadow-zanzibar-100/50"
                >
                  <div className="mx-auto mb-3 inline-flex rounded-lg bg-zanzibar-50 p-3 text-zanzibar-600 group-hover:bg-zanzibar-100">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{cat.count} items</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Hospitality Suppliers</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { name: "Zanzibar Hotel Supplies", rating: 4.8, products: "450+", location: "Stone Town" },
              { name: "Resort Furnishings Ltd", rating: 4.7, products: "280+", location: "Michenzani" },
              { name: "Coastal Kitchen Equipment", rating: 4.6, products: "190+", location: "Fumba" },
            ].map((s) => (
              <Card key={s.name} className="transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                      <Hotel className="h-6 w-6 text-zanzibar-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{s.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5" /> {s.location}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> {s.rating}</span>
                    <span>{s.products} products</span>
                    <Shield className="h-4 w-4 text-zanzibar-600" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">View Profile</Button>
                    <Button size="sm" className="flex-1">Contact</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-zanzibar-800 to-emerald-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white">Source for Your Hotel Project</h2>
            <p className="mt-3 text-lg text-zanzibar-100">
              Post a single RFQ for all your hospitality needs and receive consolidated quotes from multiple suppliers.
            </p>
            <Link href="/rfq" className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-gold-500 px-8 text-base font-semibold text-white shadow-lg hover:bg-gold-600">
              <FileText className="h-5 w-5" /> Post Your Requirements
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function FileText(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  )
}
