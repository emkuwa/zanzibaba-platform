import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/layout/search-bar"
import {
  Warehouse, Container, Building2, Home, Star, Shield, MapPin,
  Award, Package, ChevronRight, Clock, Check, Zap, TrendingUp,
  HardHat, Hotel, TreePine
} from "lucide-react"

export const metadata: Metadata = {
  title: "Prefab & Modular Marketplace - Zanzibaba",
  description: "Explore prefab and modular building solutions for East Africa. Container houses, modular homes, panel houses, and more.",
}

const categories = [
  { name: "Container Houses", icon: Container, count: "60+" },
  { name: "Modular Homes", icon: Home, count: "45+" },
  { name: "Panel Houses", icon: Building2, count: "35+" },
  { name: "Tiny Houses", icon: Home, count: "25+" },
  { name: "Prefab Villas", icon: Hotel, count: "30+" },
  { name: "Prefab Resorts", icon: TreePine, count: "20+" },
  { name: "Prefab Hotels", icon: Building2, count: "15+" },
  { name: "Steel Frame Houses", icon: HardHat, count: "40+" },
]

const benefits = [
  { icon: Clock, title: "Speed", description: "Build 50-70% faster than traditional construction with factory-prefabricated components." },
  { icon: Zap, title: "Cost Effective", description: "Reduce construction costs by up to 30% with standardized manufacturing and less waste." },
  { icon: Award, title: "Quality", description: "Factory-controlled production ensures consistent quality, precision, and durability." },
]

export default function PrefabPage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zanzibar-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="warning" className="mb-4 px-4 py-1.5 text-sm">
              <Warehouse className="mr-1.5 h-4 w-4" /> Prefab & Modular
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Prefab & Modular Solutions for East Africa
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Discover fast, cost-effective, and high-quality prefab building solutions. From container houses 
              to modular resorts — build smarter with Zanzibaba.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Prefab Categories</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.name}
                  href={`/marketplace/prefab/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-zanzibar-200 hover:shadow-lg hover:shadow-zanzibar-100/50"
                >
                  <div className="mx-auto mb-3 inline-flex rounded-lg bg-zanzibar-50 p-3 text-zanzibar-600 group-hover:bg-zanzibar-100">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{cat.count} listings</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">Why Choose Prefab?</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {benefits.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.title} className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-zanzibar-500 to-zanzibar-700 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">{b.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{b.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Project Gallery</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "2-Bedroom Container House", type: "Container House", size: "40ft container" },
              { title: "Beach Resort Modular Villas", type: "Modular Resort", size: "12 units" },
              { title: "Steel Frame Office Complex", type: "Commercial", size: "3,000 sqft" },
              { title: "Prefab School Block", type: "Panel House", size: "4 classrooms" },
              { title: "Tiny House Eco Cabin", type: "Tiny House", size: "250 sqft" },
              { title: "Luxury Prefab Villa", type: "Prefab Villa", size: "2,500 sqft" },
            ].map((item) => (
              <Card key={item.title} className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <Container className="h-10 w-10 text-gray-400" />
                </div>
                <CardContent className="p-5">
                  <Badge variant="outline" className="mb-2">{item.type}</Badge>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{item.size}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
