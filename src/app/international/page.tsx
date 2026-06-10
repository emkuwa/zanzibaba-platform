import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/layout/search-bar"
import {
  Globe, Star, Shield, MapPin, Award, Package, ChevronRight, Check,
  Ship, Plane, Truck, Building2, Store, Factory, DollarSign
} from "lucide-react"

export const metadata: Metadata = {
  title: "International Suppliers - Zanzibaba",
  description: "Source building materials directly from international manufacturers in China, Turkey, UAE, and India.",
}

const countries = [
  {
    name: "China", flag: "🇨🇳", slug: "china",
    capabilities: ["Steel & Structural", "Prefab & Modular", "HVAC & MEP", "Solar & Renewable", "Lighting & Electrical", "Sanitary & Plumbing", "Furniture & Joinery", "Finishes & Flooring"],
    description: "China is the world's largest manufacturer of building materials, offering competitive pricing and massive product variety. Source directly from verified Chinese manufacturers through Zanzibaba.",
  },
  {
    name: "Turkey", flag: "🇹🇷", slug: "turkey",
    capabilities: ["Cement & Concrete", "Doors & Windows", "Interior Finishes", "Ceramic & Porcelain", "Marble & Natural Stone", "Sanitary Ware", "Steel Products"],
    description: "Turkish building materials are known worldwide for their quality and design. From ceramic tiles to sanitary ware, Turkish manufacturers offer premium products at competitive prices.",
  },
  {
    name: "UAE", flag: "🇦🇪", slug: "uae",
    capabilities: ["Hospitality FF&E", "Luxury Materials", "Aluminum & Glass", "Elevators & Escalators", "HVAC Systems", "Prefab Buildings", "Steel Distribution"],
    description: "The UAE serves as a major hub for building materials distribution, offering high-quality products from international brands with fast shipping to East Africa.",
  },
  {
    name: "India", flag: "🇮🇳", slug: "india",
    capabilities: ["Structural Steel", "Cement & Binders", "Ceramic Tiles", "Marble & Granite", "Furniture & Interiors", "Sanitary Ware", "Electrical & Cables"],
    description: "India is a leading supplier of building materials to East Africa, offering competitive pricing on steel, cement, tiles, marble, and a wide range of construction products.",
  },
]

const benefits = [
  { icon: DollarSign, title: "Competitive Pricing", description: "Access factory-direct pricing from global manufacturers, often 20-40% below local rates." },
  { icon: Award, title: "Verified Suppliers", description: "Every international supplier is vetted and verified by Zanzibaba for authenticity and quality." },
  { icon: Ship, title: "Logistics Support", description: "End-to-end shipping and customs clearance support from origin to Zanzibar port." },
  { icon: Shield, title: "Secure Transactions", description: "Protected payments and dispute resolution for all international transactions." },
]

export default function InternationalPage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ocean-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="warning" className="mb-4 px-4 py-1.5 text-sm">
              <Globe className="mr-1.5 h-4 w-4" /> International Sourcing
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Source Directly from International Manufacturers
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Connect with verified manufacturers and exporters from China, Turkey, UAE, and India. 
              Access global product catalogs with local logistics support.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {countries.map((country) => (
              <Link
                key={country.slug}
                href={`/international/${country.slug}`}
                className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-zanzibar-200 hover:shadow-xl"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-5">
                    <span className="text-5xl">{country.flag}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 group-hover:text-zanzibar-600 transition-colors">{country.name}</h2>
                      <p className="mt-2 max-w-2xl text-sm text-gray-600 leading-relaxed">{country.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {country.capabilities.map((cap) => (
                          <Badge key={cap} variant="secondary" className="text-xs">{cap}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-sm text-gray-500">
                    <Globe className="h-4 w-4" />
                    <span>Sourcing Capabilities</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-zanzibar-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Browse Suppliers from {country.name} <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">Benefits of International Sourcing</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {benefits.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-500 to-zanzibar-700 shadow-lg">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{b.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{b.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-zanzibar-800 to-emerald-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white">Are You an International Supplier?</h2>
            <p className="mt-3 text-lg text-zanzibar-100">
              Join Zanzibaba and connect with buyers across East Africa. List your products and grow your business in one of Africa&apos;s fastest-growing markets.
            </p>
            <Link href="/auth/register" className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-gold-500 px-8 text-base font-semibold text-white shadow-lg hover:bg-gold-600">
              <Store className="h-5 w-5" /> Register as International Supplier
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
