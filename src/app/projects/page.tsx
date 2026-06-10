import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/layout/search-bar"
import {
  Building2, MapPin, Clock, ChevronDown, ChevronRight,
  DollarSign, HardHat, Home, Hotel, Warehouse, TreePine,
  Package, Handshake,
} from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Projects & Opportunities — Zanzibar Development | Zanzibaba",
  description: "Discover active construction projects, development opportunities, and bid openings in Zanzibar.",
}

const STATUS_CONFIG: Record<string, { label: string; variant: "warning" | "secondary" | "default" | "danger" }> = {
  PLANNING: { label: "Planning", variant: "secondary" },
  IN_PROGRESS: { label: "In Progress", variant: "warning" },
  COMPLETED: { label: "Completed", variant: "default" },
  OPEN_FOR_BIDS: { label: "Open for Bids", variant: "danger" },
}

const TYPE_ICONS: Record<string, typeof Building2> = {
  Residential: Home,
  "Residential Development": Home,
  Hospitality: Hotel,
  Commercial: Building2,
  Infrastructure: Warehouse,
  Mixed: Building2,
}

const PROJECT_TYPES = ["All Types", "Residential", "Hospitality", "Commercial", "Infrastructure"]

function formatBudget(budget: number | null): string {
  if (!budget) return "TBD"
  if (budget >= 1_000_000) return `$${(budget / 1_000_000).toFixed(1)}M`
  if (budget >= 1_000) return `$${(budget / 1_000).toFixed(0)}K`
  return `$${budget}`
}

function formatTimeline(start: Date | null, end: Date | null): string {
  if (!start && !end) return "TBD"
  const s = start ? String(start.getFullYear()) : ""
  const e = end ? String(end.getFullYear()) : ""
  if (s && e && s !== e) return `${s}-${e}`
  return s || e
}

export default async function ProjectsPage() {
  const total = await prisma.project.count()
  const projects = await prisma.project.findMany({
    where: { status: { not: "draft" } },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  })

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-zanzibar-900 via-emerald-900 to-zanzibar-900 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 mb-4">
              <Building2 className="h-4 w-4" />
              Development Intelligence
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Projects & Opportunities
            </h1>
            <p className="mt-4 text-lg text-zanzibar-200">
              Discover active construction projects, bid opportunities, and development intelligence for Zanzibar.
            </p>
            <div className="mt-8 mx-auto max-w-xl">
              <div className="rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Type:</span>
              {PROJECT_TYPES.map((t) => (
                <button
                  key={t}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    t === "All Types"
                      ? "bg-zanzibar-600 text-white border-zanzibar-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {t === "All Types" ? "All Types" : t}
                </button>
              ))}
            </div>
            <span className="ml-auto text-sm text-gray-500">
              <span className="font-medium text-gray-900">{total}</span> projects
            </span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
              <p className="mt-1 text-sm text-gray-500">Projects will appear here once listed.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const statusCfg = STATUS_CONFIG[project.status] || { label: project.status, variant: "secondary" as const }
                const Icon = TYPE_ICONS[project.projectType || ""] || Building2
                const budget = project.budget ? formatBudget(Number(project.budget)) : "TBD"
                const timeline = formatTimeline(project.timelineStart, project.timelineEnd)

                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="block group"
                  >
                    <div className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                          <Icon className="h-6 w-6 text-zanzibar-600" />
                        </div>
                        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{project.projectType}</p>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 shrink-0" /> {budget}
                        </span>
                        {project.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 shrink-0" /> {project.location}
                          </span>
                        )}
                        {timeline && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4 shrink-0" /> {timeline}
                          </span>
                        )}
                      </div>

                      {project.description && (
                        <p className="mt-3 text-sm text-gray-500 line-clamp-2">{project.description}</p>
                      )}

                      {project.isFeatured && (
                        <div className="mt-4">
                          <Badge variant="warning" className="text-xs">
                            Featured Opportunity
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <div className="mt-10 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="default" size="sm" className="bg-zanzibar-600">1</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-zanzibar-800 to-emerald-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white">List Your Project</h3>
              <p className="mt-2 text-zanzibar-100">Post your project requirements and receive bids from qualified contractors and suppliers across East Africa.</p>
              <Link href="/dashboard/buyer/projects/new" className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-gold-500 px-5 text-sm font-semibold text-white hover:bg-gold-600">
                List a Project <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white">Find Bidding Opportunities</h3>
              <p className="mt-2 text-zanzibar-100">Browse active projects seeking contractors, suppliers, and professional services. Get notified when new opportunities match your expertise.</p>
              <span className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-zanzibar-500 px-5 text-sm font-semibold text-white opacity-80">
                Set Up Alerts <ChevronRight className="h-4 w-4" />
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-gold-500/50">
              <h3 className="flex items-center gap-2 text-xl font-bold text-white">
                <Package className="h-5 w-5 text-gold-400" />
                Fulfillment by Zanzibaba
              </h3>
              <p className="mt-2 text-zanzibar-100">Let us handle your entire procurement — sourcing, negotiation, quality checks, and delivery. Ideal for complex projects and large orders.</p>
              <Link href="/fulfillment" className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-gold-500 px-5 text-sm font-semibold text-white hover:bg-gold-600">
                <Handshake className="h-4 w-4" /> Learn More <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
