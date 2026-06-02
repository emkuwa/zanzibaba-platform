import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import {
  HardHat, Star, Shield, MapPin, Award, Phone, Mail, Globe,
  Users, Check, MessageSquare, Share2, Building2, Home,
  CalendarDays, Ruler, FileText
} from "lucide-react"

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3 w-3"
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${s} ${i < Math.floor(rating) ? "fill-gold-400 text-gold-400" : "text-gray-200"}`} />
      ))}
      <span className={`ml-1.5 font-medium text-gray-600 ${size === "sm" ? "text-xs" : "text-sm"}`}>{rating}</span>
    </div>
  )
}

const contractorData: Record<string, {
  name: string; rating: number; reviews: number; verified: boolean; featured: boolean;
  location: string; established: string; employees: string; projects: number; teamSize: string;
  specialties: string[]; areas: string[]; description: string
}> = {
  "buildright-construction": {
    name: "BuildRight Construction", rating: 4.7, reviews: 89, verified: true, featured: true,
    location: "Stone Town, Zanzibar", established: "2018", employees: "80-120", projects: 45, teamSize: "15-25 per project",
    specialties: ["Residential", "Commercial", "Renovation"],
    areas: ["Zanzibar", "Dar es Salaam"],
    description: "BuildRight Construction is a premier general contracting firm based in Stone Town, Zanzibar. We specialize in residential and commercial construction, delivering high-quality projects on time and within budget. Our team of experienced engineers, architects, and craftsmen ensures excellence in every project.",
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = contractorData[slug]
  if (!c) return { title: "Contractor Not Found - Zanzibaba" }
  return { title: `${c.name} - Zanzibaba Contractor`, description: c.description.slice(0, 160) }
}

export default async function ContractorProfile({ params }: Props) {
  const { slug } = await params
  const c = contractorData[slug]
  if (!c) notFound()

  return (
    <div className="flex flex-col">
      <div className="h-48 bg-gradient-to-r from-zanzibar-800 via-emerald-800 to-zanzibar-700 sm:h-64" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-zanzibar-100 to-zanzibar-200 shadow-xl">
              <HardHat className="h-10 w-10 text-zanzibar-600" />
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{c.name}</h1>
                {c.verified && <Badge variant="default" className="text-sm px-3 py-1"><Shield className="mr-1 h-4 w-4" /> Verified</Badge>}
                {c.featured && <Badge variant="warning" className="text-sm px-3 py-1"><Award className="mr-1 h-4 w-4" /> Featured</Badge>}
              </div>
              <div className="mt-1 flex items-center gap-3">
                <StarRating rating={c.rating} size="lg" />
                <span className="text-sm text-gray-500">({c.reviews} reviews)</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" /> {c.location}
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2 sm:mt-0">
            <Button className="gap-2"><MessageSquare className="h-4 w-4" /> Request Quote</Button>
            <Button variant="outline" className="gap-2"><Share2 className="h-4 w-4" /></Button>
          </div>
        </div>

        <Breadcrumb items={[{ label: "Contractors", href: "/contractors" }, { label: c.name }]} className="mt-6" />
      </div>

      <section className="border-y border-gray-200 bg-gray-50 mt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-6 py-4 text-sm">
            <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gray-400" /><span className="text-gray-500">Est. <span className="text-gray-700">{c.established}</span></span></div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-gray-400" /><span className="text-gray-500">{c.employees} employees</span></div>
            <div className="flex items-center gap-2"><Ruler className="h-4 w-4 text-gray-400" /><span className="text-gray-500">{c.projects} projects completed</span></div>
            <div className="flex items-center gap-2"><Home className="h-4 w-4 text-gray-400" /><span className="text-gray-500">Team: {c.teamSize}</span></div>
            <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-gray-400" /><span className="text-gray-500">Areas: {c.areas.join(", ")}</span></div>
          </div>
          <div className="flex flex-wrap gap-1.5 pb-4">
            {c.specialties.map((s) => (<Badge key={s} variant="secondary">{s}</Badge>))}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Tabs
          tabs={[
            {
              id: "projects",
              label: "Projects",
              content: (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { title: "Fumba Town Phase III", type: "Residential", budget: "$12M", status: "In Progress" },
                    { title: "Meliá Zanzibar Expansion", type: "Hospitality", budget: "$8M", status: "Completed" },
                    { title: "Stone Town Heritage Hotel", type: "Hospitality", budget: "$5M", status: "Completed" },
                    { title: "Michenzani Office Complex", type: "Commercial", budget: "$3.5M", status: "Completed" },
                    { title: "Kiponda Luxury Apartments", type: "Residential", budget: "$4.2M", status: "In Progress" },
                    { title: "Fumba School Building", type: "Infrastructure", budget: "$1.8M", status: "Completed" },
                  ].map((project) => (
                    <Card key={project.title} className="transition-all hover:shadow-lg">
                      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Building2 className="h-8 w-8 text-gray-400" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900">{project.title}</h3>
                          <Badge variant={project.status === "Completed" ? "success" : "warning"} className="text-xs">{project.status}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{project.type} · {project.budget}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ),
            },
            {
              id: "about",
              label: "About",
              content: (
                <div className="max-w-3xl space-y-4 text-gray-600 leading-relaxed">
                  <p>{c.description}</p>
                  <p>We bring together decades of construction experience with modern project management practices. Every project is backed by our commitment to quality, safety, and client satisfaction.</p>
                </div>
              ),
            },
            {
              id: "reviews",
              label: "Reviews",
              content: (
                <div className="max-w-3xl space-y-6">
                  <div className="flex items-center gap-6 rounded-xl border border-gray-200 p-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{c.rating}</div>
                      <StarRating rating={c.rating} size="sm" />
                      <div className="mt-1 text-sm text-gray-500">{c.reviews} reviews</div>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="w-8 text-gray-500">{star} ★</span>
                          <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full rounded-full bg-gold-400" style={{ width: `${star === 5 ? 55 : star === 4 ? 30 : 15}%` }} />
                          </div>
                          <span className="w-8 text-right text-gray-500">{star === 5 ? "55%" : star === 4 ? "30%" : "15%"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: "contact",
              label: "Contact",
              content: (
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="space-y-6">
                    <h4 className="font-semibold text-gray-900">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50 text-zanzibar-600"><Phone className="h-5 w-5" /></div>
                        <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium text-gray-900">+255 777 234 567</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50 text-zanzibar-600"><Mail className="h-5 w-5" /></div>
                        <div><p className="text-sm text-gray-500">Email</p><p className="font-medium text-gray-900">info@buildright.co.tz</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50 text-zanzibar-600"><MapPin className="h-5 w-5" /></div>
                        <div><p className="text-sm text-gray-500">Address</p><p className="font-medium text-gray-900">Mkunazini Road, Stone Town</p></div>
                      </div>
                    </div>
                    <Button className="w-full gap-2"><MessageSquare className="h-4 w-4" /> Send Message</Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Request a Quote</h4>
                    <Input label="Your Name" id="name" placeholder="Enter your name" />
                    <Input label="Email" id="email" type="email" placeholder="Enter your email" />
                    <Input label="Phone" id="phone" type="tel" placeholder="Enter your phone" />
                    <div className="space-y-1">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Project Details</label>
                      <textarea id="message" rows={4} className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500" placeholder="Describe your project..." />
                    </div>
                    <Button className="w-full">Request Quote</Button>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
