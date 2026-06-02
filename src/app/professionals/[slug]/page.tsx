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
  PencilRuler, Star, Shield, MapPin, Award, Phone, Mail, Globe,
  Users, Check, MessageSquare, Share2, Compass, HardHat, BookOpen,
  GraduationCap, Briefcase, FileText, CalendarDays
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

const proData: Record<string, {
  name: string; title: string; badge: "Architect" | "Engineer" | "Surveyor";
  rating: number; reviews: number; verified: boolean; experience: number; location: string;
  credentials: string[]; description: string
}> = {
  "dr-fatma-hassan": {
    name: "Dr. Fatma Hassan", title: "Registered Architect", badge: "Architect",
    rating: 4.9, reviews: 56, verified: true, experience: 15, location: "Stone Town, Zanzibar",
    credentials: ["PhD Architecture - UDSM", "BArch - University of Nairobi", "AAR - Architects Association of Tanzania", "Registered with CRB"],
    description: "Dr. Fatma Hassan is an award-winning architect with 15 years of experience designing residential, hospitality, and commercial projects across Zanzibar and East Africa. Her work blends Swahili architectural heritage with modern sustainable design principles.",
  },
}

const badgeStyles = {
  Architect: "bg-blue-50 text-blue-600 border-blue-200",
  Engineer: "bg-amber-50 text-amber-600 border-amber-200",
  Surveyor: "bg-green-50 text-green-600 border-green-200",
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = proData[slug]
  if (!p) return { title: "Professional Not Found - Zanzibaba" }
  return { title: `${p.name} - ${p.title} - Zanzibaba Professionals`, description: p.description.slice(0, 160) }
}

export default async function ProfessionalProfile({ params }: Props) {
  const { slug } = await params
  const p = proData[slug]
  if (!p) notFound()

  return (
    <div className="flex flex-col">
      <div className="h-48 bg-gradient-to-r from-gray-800 via-zanzibar-800 to-gray-900 sm:h-56" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-zanzibar-100 to-zanzibar-200 shadow-xl">
              <span className="text-2xl font-bold text-zanzibar-600">
                {p.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{p.name}</h1>
                {p.verified && <Badge variant="default" className="text-sm px-3 py-1"><Shield className="mr-1 h-4 w-4" /> Verified</Badge>}
              </div>
              <Badge variant="outline" className={`mt-1 ${badgeStyles[p.badge]}`}>{p.title}</Badge>
              <div className="mt-1 flex items-center gap-3">
                <StarRating rating={p.rating} size="lg" />
                <span className="text-sm text-gray-500">({p.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {p.location}</span>
                <span>{p.experience} years experience</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2 sm:mt-0">
            <Button className="gap-2"><MessageSquare className="h-4 w-4" /> Contact</Button>
            <Button variant="outline" className="gap-2"><Share2 className="h-4 w-4" /></Button>
          </div>
        </div>

        <Breadcrumb items={[{ label: "Professionals", href: "/professionals" }, { label: p.name }]} className="mt-6" />
      </div>

      <section className="border-y border-gray-200 bg-gray-50 mt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-6 py-4 text-sm">
            <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-gray-400" /><span className="text-gray-500">{p.experience} years experience</span></div>
            <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-gray-400" /><span className="text-gray-500">{p.credentials.length} certifications</span></div>
            <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-gray-400" /><span className="text-gray-500">Portfolio: 24 projects</span></div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Tabs
          tabs={[
            {
              id: "portfolio",
              label: "Portfolio",
              content: (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { title: "Meliá Zanzibar Resort", type: "Hospitality", year: "2025" },
                    { title: "Fumba Eco-Villas", type: "Residential", year: "2024" },
                    { title: "Stone Town Gallery", type: "Cultural", year: "2023" },
                    { title: "Michenzani Office Park", type: "Commercial", year: "2024" },
                    { title: "Kendwa Beach House", type: "Residential", year: "2023" },
                    { title: "Zanzibar Heritage Hotel", type: "Hospitality", year: "2022" },
                  ].map((item) => (
                    <Card key={item.title} className="group overflow-hidden transition-all hover:shadow-lg">
                      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-zanzibar-100 via-zanzibar-50 to-ocean-50">
                        <PencilRuler className="h-8 w-8 text-zanzibar-400" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.type} · {item.year}</p>
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
                  <p>{p.description}</p>
                  <h4 className="font-semibold text-gray-900">Credentials & Certifications</h4>
                  <ul className="space-y-2">
                    {p.credentials.map((cred) => (
                      <li key={cred} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-zanzibar-600 shrink-0" />
                        <span>{cred}</span>
                      </li>
                    ))}
                  </ul>
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
                      <div className="text-4xl font-bold text-gray-900">{p.rating}</div>
                      <StarRating rating={p.rating} size="sm" />
                      <div className="mt-1 text-sm text-gray-500">{p.reviews} reviews</div>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="w-8 text-gray-500">{star} ★</span>
                          <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full rounded-full bg-gold-400" style={{ width: `${star === 5 ? 65 : star === 4 ? 25 : 10}%` }} />
                          </div>
                          <span className="w-8 text-right text-gray-500">{star === 5 ? "65%" : star === 4 ? "25%" : "10%"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {[
                    { name: "Ahmed S.", rating: 5, comment: "Dr. Fatma designed our resort with incredible attention to local aesthetics and sustainability." },
                    { name: "Mariam J.", rating: 5, comment: "Professional, creative, and deeply knowledgeable about Zanzibar architecture." },
                  ].map((r) => (
                    <div key={r.name} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex items-center justify-between"><span className="font-semibold text-gray-900">{r.name}</span></div>
                      <StarRating rating={r.rating} size="sm" />
                      <p className="mt-2 text-sm text-gray-600">{r.comment}</p>
                    </div>
                  ))}
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
                        <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium text-gray-900">+255 777 345 678</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50 text-zanzibar-600"><Mail className="h-5 w-5" /></div>
                        <div><p className="text-sm text-gray-500">Email</p><p className="font-medium text-gray-900">fatma.hassan@arch.co.tz</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50 text-zanzibar-600"><Globe className="h-5 w-5" /></div>
                        <div><p className="text-sm text-gray-500">Website</p><p className="font-medium text-zanzibar-600">www.fatmahassanarchitects.com</p></div>
                      </div>
                    </div>
                    <Button className="w-full gap-2"><MessageSquare className="h-4 w-4" /> Send Message</Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Send a Message</h4>
                    <Input label="Your Name" id="name" placeholder="Enter your name" />
                    <Input label="Email" id="email" type="email" placeholder="Enter your email" />
                    <div className="space-y-1">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <textarea id="message" rows={4} className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500" placeholder="Describe your project..." />
                    </div>
                    <Button className="w-full">Send Message</Button>
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
