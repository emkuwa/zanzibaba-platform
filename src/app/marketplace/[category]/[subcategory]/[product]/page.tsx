import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs } from "@/components/ui/tabs"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import {
  Package, Star, Shield, MapPin, Check, Truck, Wallet, Heart, Share2,
  BarChart3, MessageSquare, PhoneCall, ChevronRight, Clock, Info,
  CheckCircle2, Minus, Plus, Store, Award
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

interface Props {
  params: Promise<{ category: string; subcategory: string; product: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await params
  const name = product.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${name} - Zanzibaba Marketplace`,
    description: `View details, pricing, and specifications for ${name.toLowerCase()} on Zanzibaba. Request a quote from verified suppliers in Zanzibar.`,
  }
}

export default async function ProductPage({ params }: Props) {
  const { category, subcategory, product: productSlug } = await params

  const productName = productSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  const catDisplay = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  const subDisplay = subcategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  const images = ["#", "#", "#", "#"]

  const related = [
    { name: "Portland Cement 32.5N (50kg)", price: "TSh 15,500", supplier: "Zanzibar Cement Ltd", rating: 4.5 },
    { name: "Super Pozzolan Cement (50kg)", price: "TSh 15,500", supplier: "Zanzibar Cement Ltd", rating: 4.6 },
    { name: "White Cement (50kg)", price: "TSh 32,000", supplier: "Swahili Build Mart", rating: 4.5 },
    { name: "Masonry Cement Type N (50kg)", price: "TSh 16,500", supplier: "BuildPro Solutions", rating: 4.4 },
  ]

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Marketplace", href: "/marketplace" },
            { label: catDisplay, href: `/marketplace/${category}` },
            { label: subDisplay, href: `/marketplace/${category}/${subcategory}` },
            { label: productName },
          ]}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <div className="flex h-[400px] items-center justify-center rounded-2xl bg-gradient-to-br from-zanzibar-100 via-zanzibar-50 to-ocean-50 sm:h-[500px]">
              <Package className="h-20 w-20 text-zanzibar-400" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 via-zanzibar-50 to-ocean-50 cursor-pointer transition-all hover:ring-2 hover:ring-zanzibar-500 ${i === 0 ? "ring-2 ring-zanzibar-500" : ""}`}
                >
                  <Package className="h-6 w-6 text-zanzibar-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{productName}</h1>
                  <Shield className="h-5 w-5 text-zanzibar-600 shrink-0" />
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <StarRating rating={4.7} size="lg" />
                  <span className="text-sm text-gray-500">(124 reviews)</span>
                </div>
              </div>
              <Badge variant="success" className="text-sm px-3 py-1">
                <CheckCircle2 className="mr-1 h-4 w-4" /> In Stock
              </Badge>
            </div>

            <div className="mt-6">
              <div className="text-3xl font-bold text-zanzibar-700">TSh 18,000</div>
              <p className="mt-1 text-sm text-gray-500">Per unit (50kg bag) · MOQ: 100 bags</p>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Delivery available across Zanzibar & Tanzania</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Estimated delivery: 2-5 business days</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-gray-600">Price includes delivery to Stone Town</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="flex-1 sm:flex-none">
                <MessageSquare className="mr-2 h-5 w-5" />
                Request Quote
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <PhoneCall className="h-5 w-5" />
                Contact via WhatsApp
              </Button>
              <Button size="lg" variant="ghost" className="gap-2">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="ghost" className="gap-2">
                <BarChart3 className="h-5 w-5" />
                Compare
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Supplier Card */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                      <Store className="h-6 w-6 text-zanzibar-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href="/suppliers/zanzibar-cement-ltd" className="font-semibold text-gray-900 hover:text-zanzibar-600">
                          Zanzibar Cement Ltd
                        </Link>
                        <Shield className="h-4 w-4 text-zanzibar-600" />
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating rating={4.8} size="sm" />
                        <span className="text-xs text-gray-500">124 reviews</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Stone Town, Zanzibar
                      </p>
                    </div>
                  </div>
                  <Badge variant="warning" className="shrink-0">
                    <Award className="mr-1 h-3 w-3" /> Premium
                  </Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Store className="mr-1.5 h-4 w-4" /> View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="mr-1.5 h-4 w-4" /> Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs
            tabs={[
              {
                id: "description",
                label: "Description",
                content: (
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      High-quality Portland Cement 42.5N manufactured to international standards. 
                      Suitable for general construction purposes including concrete, mortar, render, 
                      and block making. This product offers excellent workability and consistent strength development.
                    </p>
                    <h4 className="font-semibold text-gray-900">Key Features</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Strength class: 42.5N (normal hardening)</li>
                      <li>Complies with TZS 727 / EN 197-1 standards</li>
                      <li>Suitable for foundations, slabs, columns, beams</li>
                      <li>Available in 50kg paper bags</li>
                      <li>Bulk order discounts available</li>
                    </ul>
                  </div>
                ),
              },
              {
                id: "specifications",
                label: "Specifications",
                content: (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        { label: "Product Type", value: "Portland Cement 42.5N" },
                        { label: "Packaging", value: "50kg Paper Bag" },
                        { label: "Color", value: "Grey" },
                        { label: "Standards", value: "TZS 727 / EN 197-1" },
                        { label: "Shelf Life", value: "6 months (dry conditions)" },
                        { label: "Storage", value: "Keep dry, off ground" },
                        { label: "Country of Origin", value: "Tanzania" },
                        { label: "HS Code", value: "2523.10.00" },
                      ].map((spec) => (
                        <div key={spec.label} className="flex justify-between rounded-lg border border-gray-200 px-4 py-3">
                          <span className="text-sm text-gray-500">{spec.label}</span>
                          <span className="text-sm font-medium text-gray-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                id: "shipping",
                label: "Shipping",
                content: (
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      We offer reliable delivery services across Zanzibar and mainland Tanzania. 
                      Our logistics partners ensure timely delivery with order tracking available.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        { zone: "Zanzibar City", time: "1-2 days", cost: "TSh 500/bag" },
                        { zone: "Unguja Island", time: "2-3 days", cost: "TSh 800/bag" },
                        { zone: "Pemba Island", time: "3-5 days", cost: "TSh 1,200/bag" },
                      ].map((zone) => (
                        <div key={zone.zone} className="rounded-xl border border-gray-200 p-4">
                          <h4 className="font-semibold text-gray-900">{zone.zone}</h4>
                          <p className="mt-1 text-sm">{zone.time}</p>
                          <p className="text-sm font-medium text-zanzibar-600">{zone.cost}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                id: "reviews",
                label: "Reviews",
                content: (
                  <div className="space-y-6">
                    {[
                      { name: "Abdul R.", rating: 5, date: "March 2026", comment: "Excellent quality cement. Used for my foundation works and it performed perfectly. Delivery was prompt." },
                      { name: "Mariam J.", rating: 4, date: "February 2026", comment: "Good product, consistent quality. Pricing is competitive for the Zanzibar market." },
                      { name: "Joseph K.", rating: 5, date: "January 2026", comment: "Reliable supplier with great customer service. We source all our cement from them." },
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
            ]}
          />
        </div>

        {/* Related Products */}
        <Separator className="my-12" />
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((product) => (
              <Card key={product.name} className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-zanzibar-100 via-zanzibar-50 to-ocean-50">
                  <Package className="h-8 w-8 text-zanzibar-400" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">{product.name}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">{product.supplier}</p>
                  <div className="mt-1">
                    <StarRating rating={product.rating} size="sm" />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-zanzibar-700">{product.price}</span>
                    <Button size="sm" variant="outline">Quote</Button>
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
