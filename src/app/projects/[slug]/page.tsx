import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2, MapPin, Clock, DollarSign, Calendar, ChevronRight,
  FileText, Shield, Star, HardHat, Hotel, Home, Warehouse,
} from "lucide-react"

export const dynamic = "force-dynamic"

const STATUS_CONFIG: Record<string, { label: string; variant: "warning" | "secondary" | "default" | "danger"; color: string }> = {
  PLANNING: { label: "Planning", variant: "secondary", color: "bg-blue-50 text-blue-700 border-blue-200" },
  IN_PROGRESS: { label: "In Progress", variant: "warning", color: "bg-amber-50 text-amber-700 border-amber-200" },
  COMPLETED: { label: "Completed", variant: "default", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  OPEN_FOR_BIDS: { label: "Open for Bids", variant: "danger", color: "bg-red-50 text-red-700 border-red-200" },
}

const TYPE_ICONS: Record<string, typeof Building2> = {
  Residential: Home,
  "Residential Development": Home,
  Hospitality: Hotel,
  Commercial: Building2,
  Infrastructure: Warehouse,
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await prisma.project.findUnique({ where: { slug } })
  if (!project) return { title: "Project Not Found" }
  return {
    title: `${project.title} — Zanzibaba Projects`,
    description: project.description || `View ${project.title} on Zanzibaba.`,
  }
}

function formatBudget(budget: number | null): string {
  if (!budget) return "TBD"
  if (budget >= 1_000_000) return `$${(budget / 1_000_000).toFixed(1)} Million`
  if (budget >= 1_000) return `$${(budget / 1_000).toFixed(0)},000`
  return `$${budget}`
}

function formatDate(d: Date | null): string {
  if (!d) return "TBD"
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await prisma.project.findUnique({ where: { slug } })
  if (!project) notFound()

  const statusCfg = STATUS_CONFIG[project.status] || { label: project.status, variant: "secondary" as const, color: "bg-gray-50 text-gray-700 border-gray-200" }
  const Icon = TYPE_ICONS[project.projectType || ""] || Building2

  const typeLabels: Record<string, string> = {
    residential: "Residential",
    hospitality: "Hospitality",
    commercial: "Commercial",
    infrastructure: "Infrastructure",
  }

  const categoryMap: Record<string, Array<{ label: string; desc: string }>> = {
    residential: [
      { label: "Structural Works", desc: "Foundation, framing, roofing contractors needed" },
      { label: "MEP Systems", desc: "Electrical, plumbing, HVAC installation" },
      { label: "Finishing", desc: "Flooring, painting, tiling, joinery" },
    ],
    hospitality: [
      { label: "FF&E Procurement", desc: "Furniture, fixtures, and equipment sourcing" },
      { label: "Interior Fit-Out", desc: "Guest rooms, lobby, restaurant finishing" },
      { label: "Landscaping", desc: "Pool, garden, outdoor amenity construction" },
    ],
    commercial: [
      { label: "Facade & Glazing", desc: "Curtain wall, aluminum systems, glass installation" },
      { label: "MEP Systems", desc: "HVAC, electrical, fire protection, BMS" },
      { label: "Interior Finishing", desc: "Office fit-out, lobby, common areas" },
    ],
    infrastructure: [
      { label: "Civil Works", desc: "Roads, drainage, earthworks, foundations" },
      { label: "Structural", desc: "Bridges, retaining walls, reinforced concrete" },
      { label: "Utilities", desc: "Water, sewer, electrical distribution" },
    ],
  }

  const categories = categoryMap[project.category || ""] || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/projects" className="hover:text-zanzibar-600">Projects</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">{project.title}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-zanzibar-800 to-emerald-900 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                <Badge variant={statusCfg.variant} className="text-sm">{statusCfg.label}</Badge>
                {project.isFeatured && (
                  <Badge variant="warning">Featured</Badge>
                )}
              </div>
              <p className="mt-1 text-zanzibar-200">{project.projectType}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-zanzibar-200">
                {project.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {project.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" /> {formatBudget(project.budget ? Number(project.budget) : null)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {formatDate(project.timelineStart)} – {formatDate(project.timelineEnd)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {project.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {project.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Project Overview</h2>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sourcing Needs</h2>
              {categories.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.map((cat) => (
                    <div key={cat.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <h3 className="font-medium text-gray-900">{cat.label}</h3>
                      <p className="text-sm text-gray-500 mt-1">{cat.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Sourcing needs will be listed as the project progresses.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Participate</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zanzibar-100 text-zanzibar-600 font-bold">1</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Review the Project</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Understand the scope, timeline, and qualification requirements.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zanzibar-100 text-zanzibar-600 font-bold">2</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Register Interest</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Submit your company details and capability statement to the project owner.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zanzibar-100 text-zanzibar-600 font-bold">3</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Submit Proposal</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Qualified suppliers and contractors receive the RFP document with submission guidelines.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Project Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900">{project.projectType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${statusCfg.color}`}>{statusCfg.label}</span>
                </div>
                {project.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium text-gray-900">{project.location}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Budget</span>
                  <span className="font-medium text-gray-900">{formatBudget(project.budget ? Number(project.budget) : null)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Timeline</span>
                  <span className="font-medium text-gray-900">{formatDate(project.timelineStart)} – {formatDate(project.timelineEnd)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-zanzibar-600 hover:bg-zanzibar-700">
                  <FileText className="h-4 w-4 mr-2" /> Register Interest
                </Button>
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" /> View Requirements
                </Button>
              </div>
              <p className="mt-3 text-xs text-gray-400 text-center">
                Registration is free for verified businesses.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Related Opportunities</h3>
              <p className="text-sm text-gray-500">
                Browse similar opportunities in&nbsp;
                <Link href={`/projects?type=${project.projectType?.toLowerCase()}`} className="text-zanzibar-600 hover:underline">
                  {project.projectType}
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
