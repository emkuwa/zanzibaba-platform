import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/layout/search-bar"
import {
  Building2, MapPin, Clock, Users, ChevronDown, ChevronRight, Filter, Check,
  DollarSign, HardHat, Home, Hotel, Warehouse, TreePine
} from "lucide-react"

export const metadata: Metadata = {
  title: "Project Marketplace - Zanzibaba",
  description: "Discover and list building projects in Zanzibar. Find contractors, suppliers, and investment opportunities.",
}

const projects = [
  { title: "Fumba Town Phase III", type: "Residential Development", typeIcon: Home, budget: "$12M", location: "Fumba", timeline: "2026-2028", status: "In Progress" as const, statusColor: "warning" as const },
  { title: "Meliá Zanzibar Expansion", type: "Hospitality", typeIcon: Hotel, budget: "$8M", location: "Mtangani", timeline: "2025-2027", status: "Planning" as const, statusColor: "secondary" as const },
  { title: "Stone Town Heritage Hotel", type: "Hospitality", typeIcon: Hotel, budget: "$5M", location: "Stone Town", timeline: "2024-2026", status: "Completed" as const, statusColor: "default" as const },
  { title: "Michenzani Office Complex", type: "Commercial", typeIcon: Building2, budget: "$3.5M", location: "Michenzani", timeline: "2025-2026", status: "In Progress" as const, statusColor: "warning" as const },
  { title: "Kiponda Luxury Apartments", type: "Residential", typeIcon: Home, budget: "$4.2M", location: "Kiponda", timeline: "2025-2027", status: "In Progress" as const, statusColor: "warning" as const },
  { title: "Nungwi Eco-Resort", type: "Hospitality", typeIcon: TreePine, budget: "$6.5M", location: "Nungwi", timeline: "2026-2028", status: "Planning" as const, statusColor: "secondary" as const },
  { title: "Fumba School Complex", type: "Infrastructure", typeIcon: Building2, budget: "$1.8M", location: "Fumba", timeline: "2024-2025", status: "Completed" as const, statusColor: "default" as const },
  { title: "Pemba Port Upgrade", type: "Infrastructure", typeIcon: Warehouse, budget: "$15M", location: "Pemba", timeline: "2026-2030", status: "Planning" as const, statusColor: "secondary" as const },
  { title: "Mkunazini Mixed-Use Tower", type: "Commercial", typeIcon: Building2, budget: "$9M", location: "Mkunazini", timeline: "2026-2029", status: "Planning" as const, statusColor: "secondary" as const },
]

export default function ProjectsPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Discover & List Building Projects in Zanzibar
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Find construction projects seeking contractors, suppliers, and partners. Or list your project to attract qualified bidders.
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
              <span className="text-sm text-gray-500">Project Type:</span>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                All Types <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Budget:</span>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                Any Budget <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                All Status <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="ml-auto text-sm text-gray-500">
              <span className="font-medium text-gray-900">{projects.length}</span> projects
            </span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const Icon = project.typeIcon
              return (
                <Card key={project.title} className="transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                        <Icon className="h-6 w-6 text-zanzibar-600" />
                      </div>
                      <Badge variant={project.statusColor}>{project.status}</Badge>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.type}</p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> {project.budget}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {project.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {project.timeline}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                      <Button size="sm" className="flex-1">Bid on Project</Button>
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
            <Button variant="outline" size="sm">8</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-zanzibar-800 to-emerald-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white">List Your Project</h3>
              <p className="mt-2 text-zanzibar-100">Post your project requirements and receive bids from qualified contractors and suppliers.</p>
              <Link href="/projects/new" className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-gold-500 px-5 text-sm font-semibold text-white hover:bg-gold-600">
                List a Project <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white">Find Projects to Bid</h3>
              <p className="mt-2 text-zanzibar-100">Browse active projects and submit your bid to win new contracts in Zanzibar.</p>
              <Link href="/projects" className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-zanzibar-500 px-5 text-sm font-semibold text-white hover:bg-zanzibar-600">
                Browse Projects <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
