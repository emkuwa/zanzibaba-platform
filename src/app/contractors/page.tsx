import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/layout/search-bar"
import {
  Building2, Star, Shield, MapPin, Award, ChevronDown, Check,
  HardHat, Users, Ruler, Home
} from "lucide-react"

export const metadata: Metadata = {
  title: "Contractors Directory - Zanzibaba",
  description: "Find verified contractors in Zanzibar for residential, commercial, and hospitality construction projects.",
}

const contractors = [
  { name: "BuildRight Construction", location: "Stone Town", rating: 4.7, reviews: 89, verified: true, featured: true, projects: 45, specialties: ["Residential", "Commercial"] },
  { name: "Ocean Builders Ltd", location: "Michenzani", rating: 4.6, reviews: 72, verified: true, featured: true, projects: 38, specialties: ["Hospitality", "Residential"] },
  { name: "Swahili Construction Co", location: "Mkunazini", rating: 4.5, reviews: 56, verified: true, featured: false, projects: 62, specialties: ["Commercial", "Industrial"] },
  { name: "Pemba Development Corp", location: "Chake Chake", rating: 4.4, reviews: 34, verified: true, featured: false, projects: 28, specialties: ["Residential", "Infrastructure"] },
  { name: "Fumba Builders Group", location: "Fumba", rating: 4.8, reviews: 103, verified: true, featured: true, projects: 71, specialties: ["Residential", "Hospitality", "Commercial"] },
  { name: "Coastal Projects Ltd", location: "Kiponda", rating: 4.3, reviews: 41, verified: false, featured: false, projects: 19, specialties: ["Renovation", "Residential"] },
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

export default function ContractorsPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Find Reliable Contractors in Zanzibar
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Browse 150+ verified contractors specializing in residential, commercial, hospitality, and infrastructure projects.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Specialty:</span>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                All Specialties <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Location:</span>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                All Locations <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-zanzibar-600 focus:ring-zanzibar-500" />
              <Shield className="h-4 w-4 text-zanzibar-600" />
              Verified Only
            </label>
            <span className="ml-auto text-sm text-gray-500">
              <span className="font-medium text-gray-900">{contractors.length}</span> contractors found
            </span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contractors.map((c) => (
              <Card key={c.name} className="group transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                        <HardHat className="h-7 w-7 text-zanzibar-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link href={`/contractors/${c.name.toLowerCase().replace(/\s+/g, "-")}`} className="font-semibold text-gray-900 hover:text-zanzibar-600">
                            {c.name}
                          </Link>
                          {c.verified && <Shield className="h-4 w-4 text-zanzibar-600 shrink-0" />}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-3.5 w-3.5" /> {c.location}
                        </div>
                      </div>
                    </div>
                    {c.featured && (
                      <Badge variant="warning" className="text-xs">
                        <Award className="mr-1 h-3 w-3" /> Featured
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <StarRating rating={c.rating} />
                    <span className="text-xs text-gray-500">({c.reviews} reviews)</span>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
                    <Home className="h-4 w-4" />
                    <span>{c.projects} projects completed</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.specialties.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link href={`/contractors/${c.name.toLowerCase().replace(/\s+/g, "-")}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <HardHat className="mr-1.5 h-4 w-4" /> View Profile
                      </Button>
                    </Link>
                    <Button variant="default" size="sm" className="flex-1">Contact</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="default" size="sm" className="bg-zanzibar-600">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="text-gray-400">...</span>
            <Button variant="outline" size="sm">10</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
