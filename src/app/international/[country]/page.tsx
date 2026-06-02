import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Store, Star, Shield, MapPin, Package, Award, ChevronRight, Globe, Ship } from "lucide-react"

const countries: Record<string, { name: string; flag: string; description: string; suppliers: { name: string; rating: number; location: string; products: number }[]; categories: string[] }> = {
  china: {
    name: "China", flag: "🇨🇳",
    description: "Source from China's top building material manufacturers. From structural steel to luxury finishes, access the world's largest manufacturing ecosystem.",
    categories: ["Building Materials", "Furniture", "Lighting", "Sanitary", "Kitchens", "Electrical", "Prefab", "Flooring"],
    suppliers: [
      { name: "Shanghai Building Materials Corp", rating: 4.8, location: "Shanghai", products: 1200 },
      { name: "Guangdong Lighting Factory", rating: 4.6, location: "Guangzhou", products: 850 },
      { name: "Zhejiang Furniture Group", rating: 4.7, location: "Hangzhou", products: 650 },
      { name: "Foshan Sanitary Ware Ltd", rating: 4.5, location: "Foshan", products: 430 },
      { name: "Shenzhen Prefab Solutions", rating: 4.8, location: "Shenzhen", products: 210 },
      { name: "Beijing Steel Group", rating: 4.4, location: "Beijing", products: 560 },
    ],
  },
  turkey: {
    name: "Turkey", flag: "🇹🇷",
    description: "Turkish manufacturers are renowned for quality ceramics, marble, and sanitary ware. Connect with top suppliers from Istanbul, Ankara, and beyond.",
    categories: ["Ceramic Tiles", "Sanitary Ware", "Steel", "Marble & Stone", "Furniture", "Lighting", "HVAC"],
    suppliers: [
      { name: "Istanbul Ceramics Inc", rating: 4.7, location: "Istanbul", products: 340 },
      { name: "Anatolian Steel Export", rating: 4.8, location: "Ankara", products: 280 },
      { name: "Turkish Marble & Stone Co", rating: 4.6, location: "Afyon", products: 190 },
      { name: "Izmir Sanitary Ware Ltd", rating: 4.5, location: "Izmir", products: 220 },
    ],
  },
  uae: {
    name: "UAE", flag: "🇦🇪",
    description: "The UAE is a strategic hub for building materials distribution. Access international brands with fast shipping routes to Zanzibar.",
    categories: ["Aluminum & Glass", "Steel", "HVAC", "Elevators", "Building Materials", "Prefab", "Lighting"],
    suppliers: [
      { name: "Dubai Glass & Aluminium", rating: 4.7, location: "Dubai", products: 310 },
      { name: "Abu Dhabi Steel Trading", rating: 4.6, location: "Abu Dhabi", products: 240 },
      { name: "Sharjah Building Materials", rating: 4.5, location: "Sharjah", products: 420 },
      { name: "Ras Al Khaimah Cement", rating: 4.4, location: "Ras Al Khaimah", products: 85 },
    ],
  },
  india: {
    name: "India", flag: "🇮🇳",
    description: "India is a leading supplier of building materials to East Africa. Competitive pricing on steel, cement, tiles, marble, and construction products.",
    categories: ["Steel", "Cement", "Tiles", "Marble & Granite", "Furniture", "Sanitary", "Electrical"],
    suppliers: [
      { name: "Mumbai Steel Corporation", rating: 4.8, location: "Mumbai", products: 520 },
      { name: "Jaipur Marble Exports", rating: 4.7, location: "Jaipur", products: 180 },
      { name: "Delhi Building Materials Co", rating: 4.5, location: "Delhi", products: 390 },
      { name: "Bangalore Furniture Works", rating: 4.6, location: "Bangalore", products: 260 },
      { name: "Chennai Cement Exports", rating: 4.4, location: "Chennai", products: 95 },
    ],
  },
}

interface Props {
  params: Promise<{ country: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params
  const c = countries[country]
  if (!c) return { title: "Country Not Found - Zanzibaba" }
  return { title: `Suppliers from ${c.name} - Zanzibaba International`, description: c.description.slice(0, 160) }
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params
  const c = countries[country]
  if (!c) notFound()

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <span className="text-6xl">{c.flag}</span>
            <div>
              <h1 className="text-4xl font-bold text-white sm:text-5xl">Suppliers from {c.name}</h1>
              <p className="mt-2 max-w-2xl text-lg text-gray-300">{c.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "International", href: "/international" }, { label: c.name }]} className="mt-6" />

        <section className="py-6">
          <h2 className="text-lg font-semibold text-gray-900">Available Categories</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-sm px-3 py-1">{cat}</Badge>
            ))}
          </div>
        </section>

        <Separator />

        <section className="py-10">
          <h2 className="text-2xl font-bold text-gray-900">Verified Suppliers in {c.name}</h2>
          <p className="mt-1 text-gray-600">{c.suppliers.length} suppliers found</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {c.suppliers.map((s) => (
              <Card key={s.name} className="transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                      <Store className="h-6 w-6 text-zanzibar-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{s.name}</h3>
                        <Shield className="h-4 w-4 text-zanzibar-600 shrink-0" />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5" /> {s.location}, {c.name}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < Math.floor(s.rating) ? "fill-gold-400 text-gold-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600">{s.rating}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                        <Package className="h-3.5 w-3.5" /> {s.products} products
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">View Profile</Button>
                    <Button size="sm" className="flex-1">Contact</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
