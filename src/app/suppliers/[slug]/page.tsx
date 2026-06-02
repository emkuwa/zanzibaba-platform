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
import { VerificationBadge } from "@/components/ui/verification-badge"
import { FeaturedBadge } from "@/components/ui/featured-badge"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import {
  Store, Star, Shield, MapPin, Package, Award, Phone, Mail, Globe,
  Users, Clock, Check, MessageSquare, Share2, ChevronRight, Building2,
  CalendarDays, FileText
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

const supplierData: Record<string, {
  name: string
  rating: number
  reviews: number
  verified: boolean
  featured: boolean
  location: string
  established: string
  employees: string
  areas: string[]
  description: string
}> = {
  "zanzibar-cement-ltd": {
    name: "Zanzibar Cement Ltd",
    rating: 4.8,
    reviews: 124,
    verified: true,
    featured: true,
    location: "Stone Town, Zanzibar",
    established: "2015",
    employees: "50-100",
    areas: ["Zanzibar", "Dar es Salaam", "Mombasa"],
    description: "Zanzibar Cement Ltd is the leading cement supplier in the Zanzibar archipelago. We source high-quality cement from reputable manufacturers and distribute across all districts of Unguja and Pemba. Our commitment to quality and reliable delivery has made us the preferred partner for major construction projects.",
  },
}

const products = [
  { name: "Portland Cement 42.5N (50kg)", price: "TSh 18,000", rating: 4.7 },
  { name: "Portland Cement 32.5N (50kg)", price: "TSh 15,500", rating: 4.5 },
  { name: "White Cement (50kg)", price: "TSh 32,000", rating: 4.6 },
  { name: "Super Pozzolan Cement (50kg)", price: "TSh 15,500", rating: 4.6 },
  { name: "Masonry Cement Type N (50kg)", price: "TSh 16,500", rating: 4.4 },
  { name: "Cement Render Mix (25kg)", price: "TSh 8,500", rating: 4.3 },
]

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const s = supplierData[slug]
  if (!s) return { title: "Supplier Not Found - Zanzibaba" }
  return {
    title: `${s.name} - Zanzibaba Supplier`,
    description: s.description.slice(0, 160),
  }
}

export default async function SupplierProfile({ params }: Props) {
  const { slug } = await params
  const s = supplierData[slug]
  if (!s) notFound()

  return (
    <div className="flex flex-col">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-zanzibar-800 via-emerald-800 to-zanzibar-700 sm:h-64" />

      {/* Supplier Header */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-zanzibar-100 to-zanzibar-200 shadow-xl">
              <Store className="h-10 w-10 text-zanzibar-600" />
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{s.name}</h1>
                {s.verified && <VerificationBadge type="supplier" size="lg" verified />}
                {s.featured && <FeaturedBadge tier="featured" size="md" />}
              </div>
              <div className="mt-1 flex items-center gap-3">
                <StarRating rating={s.rating} size="lg" />
                <span className="text-sm text-gray-500">({s.reviews} reviews)</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" /> {s.location}
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2 sm:mt-0">
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" /> Contact Supplier
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Breadcrumb
          items={[
            { label: "Suppliers", href: "/suppliers" },
            { label: s.name },
          ]}
          className="mt-6"
        />
      </div>

      {/* Info Bar */}
      <section className="border-y border-gray-200 bg-gray-50 mt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-6 py-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">Est. <span className="text-gray-700">{s.established}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">{s.employees} employees</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">Service Areas: {s.areas.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">{products.length} products listed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Tabs
          tabs={[
            {
              id: "products",
              label: "Products",
              content: (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <Card key={product.name} className="group overflow-hidden transition-all hover:shadow-lg">
                      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-zanzibar-100 via-zanzibar-50 to-ocean-50">
                        <Package className="h-8 w-8 text-zanzibar-400" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">
                          {product.name}
                        </h3>
                        <StarRating rating={product.rating} size="sm" />
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-lg font-bold text-zanzibar-700">{product.price}</span>
                          <Button size="sm" variant="outline">Quote</Button>
                        </div>
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
                  <p>{s.description}</p>
                  <p>We pride ourselves on maintaining strong relationships with top cement manufacturers and providing our customers with consistent quality and competitive pricing. Our fleet of delivery trucks ensures timely delivery across Zanzibar.</p>
                  <h4 className="font-semibold text-gray-900">Why Choose Us</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>10+ years of industry experience in Zanzibar</li>
                    <li>Verified by Zanzibaba platform</li>
                    <li>Bulk discounts for large projects</li>
                    <li>Reliable delivery across all districts</li>
                    <li>Flexible payment terms for regular customers</li>
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
                      <div className="text-4xl font-bold text-gray-900">{s.rating}</div>
                      <StarRating rating={s.rating} size="sm" />
                      <div className="mt-1 text-sm text-gray-500">{s.reviews} reviews</div>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="w-8 text-gray-500">{star} ★</span>
                          <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full rounded-full bg-gold-400" style={{ width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2}%` }} />
                          </div>
                          <span className="w-8 text-right text-gray-500">
                            {star === 5 ? "60%" : star === 4 ? "25%" : star === 3 ? "10%" : "5%"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {[
                    { name: "Abdul R.", rating: 5, date: "March 2026", comment: "Excellent quality cement. Used for my foundation works and it performed perfectly." },
                    { name: "Mariam J.", rating: 4, date: "February 2026", comment: "Good product, consistent quality. Pricing is competitive." },
                    { name: "Joseph K.", rating: 5, date: "January 2026", comment: "Reliable supplier with great customer service." },
                  ].map((review) => (
                    <div key={review.name} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{review.name}</span>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                      <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
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
                    <div>
                      <h4 className="font-semibold text-gray-900">Contact Information</h4>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50 text-zanzibar-600">
                            <Phone className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">Phone</p>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">+255 777 123 456</p>
                              <WhatsAppButton
                                phoneNumber="+255777123456"
                                message="Hi! I'm interested in your products on Zanzibaba."
                                variant="ghost"
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50 text-zanzibar-600">
                            <Mail className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">info@zanzibarcement.co.tz</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50 text-zanzibar-600">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium text-gray-900">Mkunazini Street, Stone Town, Zanzibar</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50 text-zanzibar-600">
                            <Globe className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Website</p>
                            <p className="font-medium text-zanzibar-600">www.zanzibarcement.co.tz</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full gap-2">
                      <MessageSquare className="h-4 w-4" /> Send Message
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Send a Quick Message</h4>
                    <Input label="Your Name" id="name" placeholder="Enter your name" />
                    <Input label="Email" id="email" type="email" placeholder="Enter your email" />
                    <Input label="Phone" id="phone" type="tel" placeholder="Enter your phone" />
                    <div className="space-y-1">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <textarea
                        id="message"
                        rows={4}
                        className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
                        placeholder="I'm interested in your products..."
                      />
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
