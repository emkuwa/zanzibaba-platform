import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/layout/search-bar"
import {
  PencilRuler, Star, Shield, MapPin, ChevronDown, Award, Compass,
  Users, HardHat, FileText
} from "lucide-react"

export const metadata: Metadata = {
  title: "Professionals Directory - Zanzibaba",
  description: "Find architects, engineers, and surveyors in Zanzibar for your construction and development projects.",
}

const professionals = [
  { name: "Dr. Fatma Hassan", title: "Architect", rating: 4.9, reviews: 56, verified: true, experience: 15, location: "Stone Town", badge: "Architect" as const },
  { name: "James Mwangi", title: "Structural Engineer", rating: 4.8, reviews: 42, verified: true, experience: 12, location: "Michenzani", badge: "Engineer" as const },
  { name: "Amina Suleiman", title: "Quantity Surveyor", rating: 4.7, reviews: 38, verified: true, experience: 10, location: "Mkunazini", badge: "Surveyor" as const },
  { name: "David Ochieng", title: "Architect", rating: 4.6, reviews: 31, verified: true, experience: 8, location: "Fumba", badge: "Architect" as const },
  { name: "Sarah Johnson", title: "Interior Designer", rating: 4.8, reviews: 47, verified: true, experience: 9, location: "Kiponda", badge: "Architect" as const },
  { name: "Mohammed Ali", title: "Civil Engineer", rating: 4.5, reviews: 29, verified: false, experience: 14, location: "Stone Town", badge: "Engineer" as const },
]

const titleConfig = {
  Architect: { icon: PencilRuler, color: "bg-blue-50 text-blue-600 border-blue-200" },
  Engineer: { icon: HardHat, color: "bg-amber-50 text-amber-600 border-amber-200" },
  Surveyor: { icon: Compass, color: "bg-green-50 text-green-600 border-green-200" },
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

export default function ProfessionalsPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Find Trusted Building Professionals
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Connect with top architects, engineers, and surveyors in Zanzibar for your next project.
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
              <span className="text-sm text-gray-500">Type:</span>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                All Types <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-zanzibar-600 focus:ring-zanzibar-500" />
              <Shield className="h-4 w-4 text-zanzibar-600" />
              Verified Only
            </label>
            <span className="ml-auto text-sm text-gray-500">
              <span className="font-medium text-gray-900">{professionals.length}</span> professionals found
            </span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {professionals.map((pro) => {
              const config = titleConfig[pro.badge]
              const Icon = config.icon
              return (
                <Card key={pro.name} className="group transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                          <span className="text-xl font-bold text-zanzibar-600">
                            {pro.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link href={`/professionals/${pro.name.toLowerCase().replace(/\s+/g, "-")}`} className="font-semibold text-gray-900 hover:text-zanzibar-600">
                              {pro.name}
                            </Link>
                            {pro.verified && <Shield className="h-4 w-4 text-zanzibar-600 shrink-0" />}
                          </div>
                          <Badge variant="outline" className={`mt-1 ${config.color}`}>
                            <Icon className="mr-1 h-3 w-3" /> {pro.title}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <StarRating rating={pro.rating} />
                      <span className="text-xs text-gray-500">({pro.reviews} reviews)</span>
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {pro.location}</span>
                      <span>{pro.experience} years exp.</span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link href={`/professionals/${pro.name.toLowerCase().replace(/\s+/g, "-")}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                      </Link>
                      <Button variant="default" size="sm" className="flex-1">Contact</Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="default" size="sm" className="bg-zanzibar-600">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="text-gray-400">...</span>
            <Button variant="outline" size="sm">6</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
