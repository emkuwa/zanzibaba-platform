import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import {
  HardHat, Star, Shield, MapPin, Award, ChevronDown, Home,
  FileText, MessageSquare, Map, Check, Users
} from "lucide-react"

const locations = [
  "Stone Town", "Mkunazini", "Kiponda", "Fumba", "Michenzani",
  "Chake Chake", "Mtangani",
]

const locationInfo: Record<string, { description: string; region: string }> = {
  "stone-town": { description: "the historic heart of Zanzibar City", region: "Unguja" },
  "mkunazini": { description: "a central neighborhood in Zanzibar City", region: "Unguja" },
  "kiponda": { description: "a vibrant area in Zanzibar City", region: "Unguja" },
  "fumba": { description: "a rapidly developing area on the southwestern coast of Unguja", region: "Unguja" },
  "michenzani": { description: "a bustling neighborhood in Zanzibar City", region: "Unguja" },
  "chake-chake": { description: "the main town on Pemba Island", region: "Pemba" },
  "mtangani": { description: "a coastal area on the northeastern coast of Unguja", region: "Unguja" },
}

const contractors = [
  { name: "BuildRight Construction", location: "Stone Town", rating: 4.7, reviews: 89, verified: true, featured: true, projects: 45, specialties: ["Residential", "Commercial"] },
  { name: "Ocean Builders Ltd", location: "Michenzani", rating: 4.6, reviews: 72, verified: true, featured: true, projects: 38, specialties: ["Hospitality", "Residential"] },
  { name: "Swahili Construction Co", location: "Mkunazini", rating: 4.5, reviews: 56, verified: true, featured: false, projects: 62, specialties: ["Commercial", "Industrial"] },
  { name: "Pemba Development Corp", location: "Chake Chake", rating: 4.4, reviews: 34, verified: true, featured: false, projects: 28, specialties: ["Residential", "Infrastructure"] },
  { name: "Fumba Builders Group", location: "Fumba", rating: 4.8, reviews: 103, verified: true, featured: true, projects: 71, specialties: ["Residential", "Hospitality", "Commercial"] },
  { name: "Coastal Projects Ltd", location: "Kiponda", rating: 4.3, reviews: 41, verified: false, featured: false, projects: 19, specialties: ["Renovation", "Residential"] },
  { name: "Stone Town Heritage Builders", location: "Stone Town", rating: 4.5, reviews: 67, verified: true, featured: false, projects: 33, specialties: ["Heritage", "Residential", "Commercial"] },
  { name: "Mkunazini Development Group", location: "Mkunazini", rating: 4.2, reviews: 28, verified: false, featured: false, projects: 15, specialties: ["Renovation", "Commercial"] },
  { name: "Michenzani Construction Ltd", location: "Michenzani", rating: 4.6, reviews: 48, verified: true, featured: false, projects: 52, specialties: ["Residential", "Hospitality"] },
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
    title: `Contractors in ${locName}, Zanzibar | Zanzibaba`,
    description: `Find verified contractors in ${locName}, ${info.region}. Browse portfolios, ratings, and completed projects. Post your project and get quotes.`,
  }
}

export default async function ContractorsByLocationPage({ params }: Props) {
  const { location } = await params
  const locName = formatLocationName(location)
  const info = locationInfo[location]
  if (!info) notFound()

  const filteredContractors = contractors.filter(
    (c) => c.location.toLowerCase() === locName.toLowerCase()
  )

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Contractors", href: "/contractors" },
            { label: locName },
          ]}
        />
      </div>

      <section className="bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-12 lg:py-16 mt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Contractors in {locName}, Zanzibar
            </h1>
            <p className="mt-3 text-gray-300 text-lg">
              Find reliable contractors serving {locName} and surrounding areas for residential, commercial, and hospitality projects.
            </p>
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
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-zanzibar-600 focus:ring-zanzibar-500" />
              <Shield className="h-4 w-4 text-zanzibar-600" />
              Verified Only
            </label>
            <span className="ml-auto text-sm text-gray-500">
              <span className="font-medium text-gray-900">{filteredContractors.length}</span> contractors in {locName}
            </span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {filteredContractors.length === 0 ? (
                <div className="py-16 text-center">
                  <HardHat className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">No contractors found in {locName}</h3>
                  <p className="mt-2 text-sm text-gray-500">We are expanding our network. Post a project to attract contractors.</p>
                  <Link href="/projects/new" className="mt-4 inline-block">
                    <Button>
                      <FileText className="mr-2 h-4 w-4" /> Post a Project
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {filteredContractors.map((c) => (
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

                        <Separator className="my-4" />

                        <div className="flex gap-2">
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
                  <h3 className="font-semibold text-gray-900">Need a contractor in {locName}?</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Post a project and receive bids from qualified contractors in {locName} and across Zanzibar.
                  </p>
                  <Link href="/projects/new" className="mt-4 block">
                    <Button className="w-full gap-2">
                      <FileText className="h-4 w-4" /> Post a Project for Contractors in {locName}
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
              Contractors in {locName}, {info.region}
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
              <p>
                {locName} is {info.description}, with a growing demand for construction services.
                Our platform connects you with {filteredContractors.length} verified contractors in {locName}
                who specialize in residential, commercial, hospitality, and infrastructure projects.
              </p>
              <p>
                Each contractor profile includes ratings, completed project counts, and verified reviews
                from real clients. Post your project details and receive competitive bids from contractors
                who are ready to bring your vision to life.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
