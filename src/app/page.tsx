import Link from "next/link"
import type { Metadata } from "next"
import Image from "next/image"
import { SearchBar } from "@/components/layout/search-bar"
import { LazySection } from "@/components/ui/lazy-section"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import {
  Building2, Sofa, CookingPot, Shirt, Bath, Lightbulb, DoorOpen, Home, Zap,
  Thermometer, Trees, Waves, UtensilsCrossed, Package, Shield,
  ChevronRight, MapPin, Users, Store,
  Award, TrendingUp, FileText, MessageSquare, Globe, MoveRight,
  Building, Hotel, Warehouse, Container, ArrowRight,
  Sparkles, SearchX, ExternalLink, Layers,
  Target,
  Grid3x3, HelpCircle, CheckCircle2, BarChart3, Rocket, HardHat, Briefcase,
  Calculator, ClipboardList, Headset, Crown,
  DollarSign, Clock, Calendar, Newspaper, Handshake, Sun,
} from "lucide-react"

import { FeaturedSuppliersSection } from "@/components/growth/featured-suppliers-section"
import { HomepageOfferSection } from "@/components/growth/homepage-offer"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Zanzibar's Gateway to Global Suppliers & Opportunities | Zanzibaba",
  description:
    "Zanzibar's gateway to verified global suppliers, manufacturers, exporters, development projects and investment opportunities. Connecting developers, buyers and investors with industry leaders from East Africa and international markets.",
}

const categories = [
  { name: "Building Materials", slug: "building-materials", icon: Building2 },
  { name: "Furniture", slug: "furniture", icon: Sofa },
  { name: "Kitchens", slug: "kitchens", icon: CookingPot },
  { name: "Wardrobes", slug: "wardrobes", icon: Shirt },
  { name: "Sanitary & Plumbing", slug: "sanitary", icon: Bath },
  { name: "Lighting", slug: "lighting", icon: Lightbulb },
  { name: "Doors & Windows", slug: "doors-windows", icon: DoorOpen },
  { name: "Roofing", slug: "roofing", icon: Home },
  { name: "Electrical", slug: "electrical", icon: Zap },
  { name: "HVAC", slug: "hvac", icon: Thermometer },
  { name: "Landscaping", slug: "landscaping", icon: Trees },
  { name: "Pools", slug: "pools", icon: Waves },
  { name: "Hospitality", slug: "hospitality-equipment", icon: UtensilsCrossed },
  { name: "Prefab Houses", slug: "prefab-houses", icon: Warehouse },
  { name: "Modular Buildings", slug: "modular-buildings", icon: Container },
].filter((v, i, a) => a.findIndex(t => t.slug === v.slug) === i)


const whyZanzibaba = [
  { icon: Shield, title: "All Suppliers Verified", desc: "Every supplier undergoes a verification process — license checks, business registration, and background review before they can list." },
  { icon: MapPin, title: "Local Market Expertise", desc: "We understand Zanzibar's construction landscape. Our team knows local suppliers, pricing, logistics, and regulatory requirements." },
  { icon: Globe, title: "International Sourcing", desc: "Direct access to manufacturers from China, Turkey, UAE, and India. No middlemen, no markups — just factory-direct pricing." },
  { icon: FileText, title: "Smart RFQ Matching", desc: "Upload your requirements once and get matched with the right suppliers automatically. Receive 5+ competitive quotes within 24 hours." },
  { icon: Hotel, title: "Hospitality Specialization", desc: "Zanzibar's hospitality boom demands specialists. We focus on hotel-grade materials, FF&E, OS&E, and resort development supplies." },
  { icon: Building2, title: "Experience Center (Coming Soon)", desc: "Touch, feel, and compare samples before purchasing. Our Fumba showroom will feature kitchens, bathrooms, lighting, and prefab models." },
]

const howToStart = [
  { step: "01", title: "Describe Your Project", desc: "Upload BOQ, floor plans, drawings, or inspiration images — whatever you have." },
  { step: "02", title: "Get Matched", desc: "Our system matches your requirements to verified suppliers and contractors automatically." },
  { step: "03", title: "Compare Quotes", desc: "Review competitive quotes side-by-side. Compare pricing, timelines, and supplier ratings." },
  { step: "04", title: "Order with Confidence", desc: "Proceed with the best offer. Every supplier is verified and every transaction is tracked." },
]

const international = [
  {
    country: "China", flag: "🇨🇳", slug: "china", capabilities: "Strategic sourcing",
    items: [
      { icon: Container, label: "Steel & Structures" },
      { icon: Warehouse, label: "Prefab & Modular" },
      { icon: Thermometer, label: "HVAC Systems" },
      { icon: Sun, label: "Solar Energy" },
    ],
  },
  {
    country: "Turkey", flag: "🇹🇷", slug: "turkey", capabilities: "Premium finishes",
    items: [
      { icon: Building2, label: "Cement & Building Materials" },
      { icon: Grid3x3, label: "Ceramic & Marble" },
      { icon: DoorOpen, label: "Doors & Interior" },
      { icon: Sparkles, label: "Interior Finishes" },
    ],
  },
  {
    country: "UAE", flag: "🇦🇪", slug: "uae", capabilities: "Luxury hospitality",
    items: [
      { icon: Hotel, label: "Hospitality FF&E" },
      { icon: Award, label: "Luxury Materials" },
      { icon: Building2, label: "Elevators & Aluminium" },
      { icon: Zap, label: "MEP Systems" },
    ],
  },
  {
    country: "India", flag: "🇮🇳", slug: "india", capabilities: "Industrial scale",
    items: [
      { icon: Container, label: "Structural Steel" },
      { icon: Building2, label: "Cement & Construction" },
      { icon: Zap, label: "Electrical Products" },
      { icon: Bath, label: "Sanitary & Plumbing" },
    ],
  },
]



const globalPartners = [
  { name: "CNBM", fullName: "China National Building Materials Group", country: "🇨🇳 China", category: "Building Materials, Cement, Glass", desc: "One of the world's largest building materials conglomerates. Strategic sourcing partner for cement, glass, fiberglass, and advanced construction materials." },
  { name: "George Group", country: "🇦🇪 UAE", category: "Hospitality FF&E, OS&E", desc: "Leading hospitality procurement partner. Specializes in FF&E, OS&E, and turnkey solutions for hotels and resorts across the Middle East and Africa." },
  { name: "Foshan Partners", fullName: "Foshan Building Materials Alliance", country: "🇨🇳 China", category: "Ceramics, Tiles, Sanitary Ware", desc: "Network of premium manufacturers from Foshan, China's ceramic capital. Direct factory access to tiles, sanitary ware, and finishing materials." },
  { name: "Prefab Global", fullName: "International Prefab Partners", country: "🌍 Global Network", category: "Modular Buildings, Prefab Housing", desc: "Global consortium of prefab and modular construction manufacturers. Container homes, panelized systems, and turnkey prefab solutions." },
]

const audiences = [
  { icon: Hotel, title: "Hotel Developers", desc: "Source premium FF&E, OS&E, and construction materials for new builds and expansions. Get competitive quotes from verified hospitality suppliers." },
  { icon: Building, title: "Resort Developers", desc: "Find everything for beachfront resort projects — from structural materials to interior finishes, landscaping, and pool equipment." },
  { icon: Home, title: "Villa Developers", desc: "Access a curated network of suppliers for high-end villas and residential projects. Tiles, kitchens, bathrooms, lighting, and custom joinery." },
  { icon: Building2, title: "Commercial Developers", desc: "Procure materials for commercial buildings, retail spaces, and mixed-use developments. Multi-supplier quotes for large-volume orders." },
  { icon: Target, title: "Government Projects", desc: "Sourcing platform for public sector construction, infrastructure, and institutional projects. Transparent procurement with verified suppliers." },
  { icon: HardHat, title: "Contractors & Builders", desc: "Source materials across all trades — structural, MEP, finishes. Upload BOQs and receive quotes from multiple suppliers in one place." },
  { icon: Users, title: "Procurement Teams", desc: "Manage project procurement from RFQ to delivery. Centralized supplier management, quote comparison, and order tracking." },
  { icon: Briefcase, title: "Project Managers", desc: "Keep projects on schedule with streamlined material sourcing. Real-time quotes, supplier coordination, and procurement workflows." },
  { icon: UtensilsCrossed, title: "Hospitality Operators", desc: "Specialized procurement for hotels, resorts, and restaurants. Bedding, tableware, kitchen equipment, furniture, FF&E, and decor." },
  { icon: Globe, title: "Investors & Developers", desc: "Navigate Zanzibar's construction market with confidence. Verified suppliers, local expertise, and transparent pricing for your investment projects." },
]

const supplierBenefits = [
  { icon: Globe, title: "International Sourcing Access", desc: "Your products reach buyers from China, UAE, Turkey, and India. No other platform connects Zanzibar suppliers to global procurement networks." },
  { icon: MapPin, title: "Zanzibar Project Visibility", desc: "Get discovered by developers and contractors actively sourcing for real projects — from boutique hotels to large-scale residential developments." },
  { icon: FileText, title: "RFQ Opportunities", desc: "Receive qualified RFQs matched to your product categories. No cold calls, no spam — just real project requirements from verified buyers." },
  { icon: Users, title: "Direct Developer Exposure", desc: "Present your products directly to developers, architects, and project managers making procurement decisions for multi-million dollar projects." },
  { icon: Hotel, title: "Hospitality Project Opportunities", desc: "Zanzibar's tourism boom means constant demand for hospitality-grade materials. Position your business for this growing sector." },
  { icon: Award, title: "Verified Supplier Advantage", desc: "Stand out with a verified badge. Trusted suppliers win more RFQs and build long-term relationships with serious buyers." },
]

const trustItems = [
  "Project Procurement", "Supplier Verification", "RFQ Matching System", "International Sourcing",
  "Local Market Expertise", "Hospitality Specialists",
]


export default async function HomePage() {
  const [strategicCount, verifiedCount, projectCount, countryCount, supplierCount, contractorCount, professionalCount, developerCount, foundingCount, articleCount, featuredProjects, latestArticles] = await Promise.all([
    prisma.discoveredLead.count({
      where: {
        tier: "A",
        activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
        dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
      },
    }),
    prisma.discoveredLead.count({
      where: {
        verifiedCompany: true,
        activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
        dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
      },
    }),
    prisma.project.count({ where: { status: { not: "draft" } } }),
    prisma.discoveredLead.groupBy({ by: ["country"], _count: true, where: { tier: { in: ["A", "B"] }, activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] }, dataClassification: { notIn: ["TEST", "SYNTHETIC"] } } }).then((r) => r.length).catch(() => 0),
    prisma.discoveredLead.count({
      where: {
        tier: { in: ["A", "B"] },
        activationStatus: { in: ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"] },
        dataClassification: { notIn: ["TEST", "SYNTHETIC"] },
      },
    }),
    prisma.contractorProfile.count(),
    prisma.professionalProfile.count(),
    prisma.buyerProfile.count(),
    prisma.foundingSupplier.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.project.findMany({
      where: { isFeatured: true, status: { not: "draft" } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 6,
    }),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#032B44] via-[#0B6E6E] to-[#0FA958]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white/3 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8 lg:pb-14 lg:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-readable-shadow text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Zanzibar&apos;s Gateway to Global Suppliers,<br />
              <span className="text-[#F59E0B]">Projects and Opportunities.</span>
            </h1>
            <p className="mt-4 text-lg font-medium text-emerald-100 sm:text-xl">
              Connecting developers, buyers and investors with verified manufacturers, suppliers and industry leaders from East Africa and international markets.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-emerald-200">
              {[
                { label: "Verified Strategic Suppliers", href: "/strategic-suppliers" },
                { label: "International Manufacturers & Exporters", href: "/international" },
                { label: "Development Projects & Opportunities", href: "/projects" },
                { label: "Contractors & Industry Professionals", href: "/contractors" },
                { label: "Fulfillment by Materials.Zanzibaba", href: "/fulfillment" },
              ].map((point) => (
                point.href ? (
                  <Link key={point.label} href={point.href} className="flex items-center gap-1.5 hover:text-emerald-100 transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-[#F59E0B]" />
                    {point.label}
                  </Link>
                ) : (
                  <span key={point.label} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#F59E0B]" />
                    {point.label}
                  </span>
                )
              ))}
            </div>
            <div className="mt-8 mx-auto max-w-3xl">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-lg backdrop-blur-sm">
                <SearchBar />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold-500 px-7 text-base font-bold text-white shadow-lg shadow-gold-500/30 transition-all hover:bg-gold-600 hover:shadow-xl hover:scale-[1.02]"
              >
                <Building2 className="h-5 w-5" />
                Explore Projects & Opportunities
              </Link>
              <Link
                href="/suppliers"
                className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-amber-400/50 px-6 text-sm font-semibold text-white transition-all hover:bg-amber-500/20 hover:border-amber-300"
              >
                <Store className="h-4 w-4" />
                Browse Supplier Network
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Positioning */}
      <section className="border-b border-gray-100 bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Zanzibaba</span>
            <span className="flex items-center gap-1.5 text-gray-600">
              <Building2 className="h-3.5 w-3.5 text-zanzibar-500" />
              Discovery Platform
            </span>
            <span className="hidden h-4 w-px bg-gray-300 sm:block" />
            <span className="flex items-center gap-1.5 text-gray-600">
              <Briefcase className="h-3.5 w-3.5 text-zanzibar-500" />
              Opportunity Platform
            </span>
            <span className="hidden h-4 w-px bg-gray-300 sm:block" />
            <span className="flex items-center gap-1.5 text-gray-600">
              <Handshake className="h-3.5 w-3.5 text-zanzibar-500" />
              Procurement Partner
            </span>
            <span className="hidden h-4 w-px bg-gray-300 sm:block" />
            <span className="flex items-center gap-1.5 text-gray-600">
              <Package className="h-3.5 w-3.5 text-gold-500" />
              <span className="text-gold-700 font-medium">Materials.Zanzibaba</span>
              <span className="text-gray-400">—</span>
              Fulfillment Engine
            </span>
          </div>
        </div>
      </section>

      {/* Development Snapshot */}
      <section className="border-b border-gray-100 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-5">
            <BarChart3 className="h-4 w-4 text-zanzibar-600" />
            <span className="text-sm font-semibold uppercase tracking-widest text-zanzibar-700">Zanzibar Development Snapshot</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Strategic Suppliers", value: strategicCount, icon: Crown },
              { label: "Verified Companies", value: verifiedCount, icon: Shield },
              { label: "Development Projects", value: projectCount, icon: ClipboardList },
              { label: "Countries Covered", value: countryCount, icon: Globe },
            ].map((m) => {
              const Icon = m.icon
              return (
                <div key={m.label} className="flex flex-col items-center rounded-xl bg-gray-50 px-2 py-4 text-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zanzibar-100 text-zanzibar-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-1.5 text-lg font-bold text-gray-900">{m.value}</p>
                  <p className="text-[10px] text-gray-500">{m.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Global Procurement Network */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zanzibar-900 via-zanzibar-800 to-emerald-900 py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="warning" className="mb-3 px-4 py-1.5 text-sm">
              <Globe className="mr-1.5 h-4 w-4" />
              Global Procurement Network
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Source from International Manufacturers</h2>
            <p className="mt-2 text-base text-zanzibar-200 max-w-3xl mx-auto">
              Direct access to verified manufacturers and exporters from the world&apos;s leading 
              building materials markets. No middlemen. Factory-direct pricing.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {international.map((c) => {
              const containerClasses = "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5"
              return (
                <div key={c.slug} className={containerClasses}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{c.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{c.country}</h3>
                      <p className="text-xs text-zanzibar-300">{c.capabilities}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {c.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.label} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs text-zanzibar-200">
                          <Icon className="h-3.5 w-3.5 text-gold-400" />
                          {item.label}
                        </div>
                      )
                    })}
                  </div>
                  <Link
                    href={`/international/${c.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    Browse Suppliers <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Materials.Zanzibaba CTA in Procurement Network */}
          <div className="mt-8 text-center">
            <Link
              href="/fulfillment"
              className="inline-flex items-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/10 px-6 py-3 text-sm font-medium text-gold-300 hover:bg-gold-500/20 transition-colors"
            >
              <Package className="h-4 w-4" />
              Need help sourcing from these markets? Let Materials.Zanzibaba handle procurement <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Founding Global Partners */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100 via-white to-white" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="default" className="mb-3 px-4 py-1.5 text-sm bg-zanzibar-100 text-zanzibar-700 border-0">
              <Award className="mr-1.5 h-3.5 w-3.5" />
              Founding Global Partners
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Strategic Sourcing Partners</h2>
            <p className="mt-2 text-base text-gray-500 max-w-3xl mx-auto">
              Backed by leading global manufacturers and industry partners. These strategic relationships 
              give Zanzibaba members direct access to world-class materials and supply chains.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {globalPartners.map((partner) => (
              <div key={partner.name} className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-zanzibar-200 hover:shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zanzibar-100 to-zanzibar-200 text-xl font-bold text-zanzibar-600">
                    {partner.name.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{partner.name}</h3>
                      <span className="text-xs text-gray-400">{partner.country}</span>
                    </div>
                    {partner.fullName && (
                      <p className="text-xs text-gray-500 font-medium">{partner.fullName}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {partner.category.split(",").map((c) => (
                        <span key={c.trim()} className="inline-flex items-center rounded-full bg-zanzibar-50 px-2.5 py-0.5 text-[10px] font-medium text-zanzibar-700">
                          {c.trim()}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">{partner.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/fulfillment" className="inline-flex items-center gap-2 text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700">
              <Package className="h-4 w-4" />
          Source via Materials.Zanzibaba Fulfillment <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <FeaturedSuppliersSection />

      {/* Featured Projects & Opportunities */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge variant="default" className="mb-3 px-4 py-1.5 text-sm bg-zanzibar-100 text-zanzibar-700 border-0">
                <Building2 className="mr-1.5 h-3.5 w-3.5" />
                Featured Projects & Opportunities
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Active Development Projects</h2>
              <p className="mt-1 text-base text-gray-500">Discover investment opportunities and active projects across Zanzibar and East Africa</p>
            </div>
            <Link href="/projects" className="hidden items-center gap-1 text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700 sm:flex">
              View All Projects <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {featuredProjects.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-gray-200 bg-gray-50">
              <Building2 className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">Featured projects coming soon.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => {
                const budget = project.budget
                  ? Number(project.budget) >= 1000000
                    ? `$${(Number(project.budget) / 1000000).toFixed(1)}M`
                    : `$${(Number(project.budget) / 1000).toFixed(0)}K`
                  : "TBD"
                const timeline = project.timelineStart || project.timelineEnd
                  ? `${project.timelineStart ? project.timelineStart.getFullYear() : ""}${project.timelineStart && project.timelineEnd ? "-" : ""}${project.timelineEnd ? project.timelineEnd.getFullYear() : ""}`
                  : null
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="group block"
                  >
                    <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-zanzibar-100 to-zanzibar-200 text-zanzibar-600">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <Badge variant="warning" className="text-[10px]">
                          Featured
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">{project.projectType}</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {project.location || "Zanzibar"}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" /> {budget}
                        </span>
                        {timeline && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {timeline}
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <p className="mt-2 text-xs text-gray-500 line-clamp-2">{project.description}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Link href="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700">
              View All Projects <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News & Market Intelligence */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge variant="default" className="mb-3 px-4 py-1.5 text-sm bg-emerald-100 text-emerald-700 border-0">
                <Newspaper className="mr-1.5 h-3.5 w-3.5" />
                Latest News & Market Intelligence
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Zanzibar Development Insights</h2>
              <p className="mt-1 text-base text-gray-500">Market intelligence, project announcements, and sector updates</p>
            </div>
            <Link href="/blog" className="hidden items-center gap-1 text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700 sm:flex">
              View All Articles <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {latestArticles.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-gray-200 bg-white">
              <Newspaper className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">Market intelligence articles coming soon.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group block"
                >
                  <article className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                    <div className="h-40 bg-gradient-to-br from-zanzibar-100 to-emerald-50 flex items-center justify-center">
                      <Newspaper className="h-8 w-8 text-zanzibar-400" />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        {article.category && (
                          <span className="rounded-full bg-zanzibar-50 px-2 py-0.5 text-[10px] font-medium text-zanzibar-700">
                            {article.category}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2 flex-1">{article.excerpt}</p>
                      )}
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-zanzibar-600">
                        Read More <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700">
              View All Articles <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Intro — tagline + description + search moved out of hero */}
      <section className="relative bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Source Everything Your Project Needs
          </p>
          <p className="mt-2 text-sm font-semibold tracking-widest uppercase text-emerald-700">
            Source Locally. Procure Globally. Deliver with Confidence.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Connect with verified suppliers, contractors, manufacturers, logistics providers,
            and procurement partners across Zanzibar, Tanzania, and international markets.
            From concept to delivery — manage every stage of project procurement in one platform.
          </p>
          <div className="mt-8 mx-auto max-w-3xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm ring-1 ring-gray-100">
              <SearchBar />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/projects"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 transition-colors hover:border-emerald-500 hover:bg-emerald-50"
            >
              <Building2 className="h-4 w-4" />
              Browse Active Projects
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 transition-colors hover:border-emerald-500 hover:bg-emerald-50"
            >
              <Store className="h-4 w-4" />
              Browse Marketplace
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-sm text-gray-500">Procurement for:</span>
            {["Hotel FF&E", "Resort Supply", "Infrastructure", "Hospitality", "Commercial"].map((tag) => (
              <Link
                key={tag}
                href={`/marketplace?q=${tag.toLowerCase()}`}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-600 transition-colors hover:border-emerald-500 hover:text-emerald-700"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* Launch Phase — Founding Program Active */}
      <section className="py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-zanzibar-800 via-zanzibar-700 to-emerald-800 shadow-2xl">
            <div className="relative px-6 py-10 sm:px-10 sm:py-12 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent" />
              <Badge variant="warning" className="relative mb-4 px-5 py-1.5 text-sm font-semibold">
                <Rocket className="mr-1.5 h-4 w-4" />
                Founding Supplier Program Active
              </Badge>
              <h2 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Be Among the First 100 Suppliers on Zanzibaba
              </h2>
              <p className="relative mx-auto mt-3 max-w-2xl text-base text-zanzibar-100">
                Founding Suppliers get priority visibility, a lifetime "Founding Supplier" badge, 
                free verification, and exclusive marketplace benefits — all for a one-time fee.
              </p>
              <p className="relative mt-4 text-lg font-bold text-gold-300">
                $199 One-Time &bull; No Recurring Fees
              </p>
              <div className="relative mt-6 grid gap-3 sm:grid-cols-3 max-w-lg mx-auto">
                {[
                  { label: "Founding Suppliers", target: "100", current: foundingCount },
                  { label: "Founding Contractors", target: "50", current: Math.min(foundingCount, 50) },
                  { label: "Founding Professionals", target: "40", current: Math.min(Math.round(foundingCount * 0.4), 40) },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-gold-300">{item.current}</div>
                    <div className="text-xs text-zanzibar-200 mt-0.5">/ {item.target} {item.label}</div>
                  </div>
                ))}
              </div>
              <div className="relative mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/become-supplier" className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold-500 px-7 text-base font-bold text-white shadow-lg shadow-gold-500/30 transition-all hover:bg-gold-600 hover:shadow-xl hover:scale-[1.02]">
                  <Crown className="h-5 w-5" /> See Founding Benefits &rsaquo;
                </Link>
                <Link href="/auth/register/supplier" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10">
                  <Users className="h-4 w-4" /> Register Free Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Build Your Project Budget */}
      <section className="relative overflow-hidden py-14">
        <div className="absolute inset-0">
          <Image src="/images/hero/rfq-upload.jpg" alt="Project procurement with BOQ on laptop" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="overlay-readable absolute inset-0" />
        <div className="heading-vignette absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="glass-panel-strong mx-auto max-w-4xl p-8 sm:p-10 text-center mb-10">
              <Badge variant="warning" className="mb-3 px-4 py-1.5 text-sm">
                <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
                Build Your Project Budget
              </Badge>
              <h2 className="text-readable-shadow text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Plan, Budget, and Source Your Next Project
              </h2>
              <p className="text-readable-shadow mt-3 text-base text-zanzibar-100 max-w-3xl mx-auto">
                Whether you&apos;re developing a hotel, building villas, or equipping a resort — start 
                with a clear project budget and material schedule. Our procurement team supports 
                you from concept to delivery.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  icon: Calculator, title: "Estimate Project Costs",
                  href: "/estimate",
                  desc: "Get instant USD budget ranges for villas, hotels, resorts, offices and warehouses across Zanzibar and mainland Tanzania — based on our daily material price index.",
                  items: ["Hospitality projects (per key)", "Villa construction (per sqm)", "Commercial developments", "Renovation & fit-out"]
                },
                {
                  icon: ClipboardList, title: "Generate Material Schedule",
                  href: "/dashboard/buyer/boq",
                  desc: "Upload a BOQ or define your project scope and we generate a complete material schedule — quantities, regional unit costs, totals — ready for procurement.",
                  items: ["BOQ & scope-based schedule generation", "Quantities priced against regional index", "Exportable as Excel or PDF", "Linked to the same project budget"]
                },
                {
                  icon: FileText, title: "Upload BOQs & Drawings",
                  href: "/dashboard/buyer/boq",
                  desc: "Paste or upload your Bill of Quantities. We parse it, match each line to a canonical material, price it against the regional index, and produce a ready-to-RFQ schedule.",
                  items: ["BOQ spreadsheet & paste upload", "Auto matching to 85+ materials", "Top-3 supplier suggestions per line", "Export as priced schedule"]
                },
                {
                  icon: Headset, title: "Request Procurement Support",
                  href: "/contact",
                  desc: "Need hands-on procurement management? Our team provides end-to-end support — from supplier negotiation to logistics coordination.",
                  items: ["Dedicated procurement manager", "Supplier negotiation support", "Logistics & shipping coordination", "Quality inspection services"]
                },
              ].map((card) => {
                const Icon = card.icon
                return (
                  <Link key={card.title} href={card.href} className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5 block">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-500/20 text-gold-300">
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">{card.title}</h3>
                    <p className="mt-1.5 text-sm text-zanzibar-100 leading-relaxed">{card.desc}</p>
                    <ul className="mt-4 space-y-1.5">
                      {card.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Link>
                )
              })}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/estimate"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold-500 px-7 text-base font-bold text-white shadow-lg shadow-gold-500/30 transition-all hover:bg-gold-600 hover:shadow-xl"
              >
                <Calculator className="h-5 w-5" />
                Run Free Cost Estimator
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/prices"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <BarChart3 className="h-4 w-4" />
                View Material Prices
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <Headset className="h-4 w-4" />
                Talk to Procurement Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses Zanzibaba */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="default" className="mb-3 px-4 py-1.5 text-sm bg-zanzibar-100 text-zanzibar-700 border-0">
              <Users className="mr-1.5 h-3.5 w-3.5" />
              For Project Developers &amp; Buyers
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Who Uses Zanzibaba for Procurement</h2>
            <p className="mt-2 text-base text-gray-500 max-w-2xl mx-auto">
              From hotel chains to government infrastructure — developers, procurement teams, and project managers source everything here
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {audiences.map((a) => {
              const Icon = a.icon
              return (
                <div key={a.title} className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-zanzibar-100 to-zanzibar-200 text-zanzibar-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-semibold text-gray-900">{a.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{a.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Zanzibaba */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="default" className="mb-3 px-4 py-1 text-sm bg-zanzibar-100 text-zanzibar-700 border-0">
              <HelpCircle className="mr-1.5 h-3.5 w-3.5" />
              Why Zanzibaba?
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Built for Project Procurement</h2>
            <p className="mt-2 text-base text-gray-500 max-w-2xl mx-auto">
              Stop piecing together suppliers from Google, Facebook, and WhatsApp groups. 
              Zanzibaba gives you a single platform to plan, budget, source, and deliver your projects.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyZanzibaba.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-zanzibar-100 to-zanzibar-200 text-zanzibar-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: SearchX, title: "Don't search randomly on Google", desc: "Endless tabs, unverified claims, no quality guarantee." },
                { icon: MessageSquare, title: "Don't trust Facebook groups", desc: "No vetting, no accountability, no dispute resolution." },
                { icon: ExternalLink, title: "Use Zanzibaba — the professional way", desc: "Verified suppliers, competitive quotes, project tracking." },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Suppliers Are Joining */}
      <LazySection>
        <section className="relative overflow-hidden py-12 sm:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zanzibar-100 via-white to-white" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="default" className="mb-3 px-4 py-1.5 text-sm bg-emerald-100 text-emerald-700 border-0">
                <Award className="mr-1.5 h-3.5 w-3.5" />
                Why Suppliers Are Joining
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Grow Your Business with Zanzibaba</h2>
              <p className="mt-2 text-base text-gray-500 max-w-2xl mx-auto">
                Zanzibar&apos;s most ambitious suppliers are already on the platform. Here&apos;s why.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {supplierBenefits.map((b) => {
                const Icon = b.icon
                return (
                  <div key={b.title} className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md hover:border-emerald-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-semibold text-gray-900">{b.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/register/supplier"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-zanzibar-600 px-7 text-base font-semibold text-white shadow-lg hover:bg-zanzibar-700 transition-colors"
              >
                <Store className="h-5 w-5" />
                Join Free — List Your Products <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/become-supplier"
                className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-amber-400 bg-white px-7 text-base font-semibold text-amber-700 shadow-lg hover:bg-amber-50 transition-colors"
              >
                <Crown className="h-5 w-5" />
                Become a Founding Supplier <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Position Your Business */}
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-zanzibar-900 via-zanzibar-800 to-emerald-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="warning" className="mb-4 px-5 py-1.5 text-sm font-semibold">
              <TrendingUp className="mr-1.5 h-4 w-4" />
              Growth Opportunity
            </Badge>
            <h2 className="text-readable-shadow text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Position Your Business for<br />
              <span className="text-[#F59E0B]">Zanzibar's Growth</span>
            </h2>
            <p className="text-readable-shadow mt-4 text-base text-zanzibar-100 max-w-2xl mx-auto">
              Zanzibar is experiencing unprecedented development — new hotels, resorts, infrastructure, 
              and commercial projects. Position your business at the forefront of this transformation.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 max-w-lg mx-auto">
              {[
                { label: "Active Projects", value: projectCount },
                { label: "Strategic Suppliers", value: strategicCount },
                { label: "Markets Covered", value: countryCount },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-gold-300">{item.value}</div>
                  <div className="text-xs text-zanzibar-200 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/become-supplier"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold-500 px-7 text-base font-bold text-white shadow-lg shadow-gold-500/30 transition-all hover:bg-gold-600 hover:shadow-xl hover:scale-[1.02]"
              >
                <Crown className="h-5 w-5" />
                Become a Founding Industry Partner
              </Link>
              <Link
                href="/auth/register/supplier"
                className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-white/20 px-6 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                <Store className="h-4 w-4" />
                Register Your Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Need Us To Handle Everything? — Fulfillment CTA */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-zanzibar-800 via-zanzibar-700 to-emerald-800 shadow-2xl">
            <div className="relative px-6 py-10 sm:px-12 sm:py-14">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent" />
              <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <Badge variant="warning" className="mb-4 px-4 py-1.5 text-sm font-semibold">
                    <Package className="mr-1.5 h-4 w-4" />
                    Fulfillment by Materials.Zanzibaba
                  </Badge>
                  <h2 className="text-readable-shadow text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    The 20/80 Fulfillment Model
                  </h2>
                  <p className="text-readable-shadow mt-4 text-base text-zanzibar-100 max-w-xl">
                    Contact suppliers directly for 80% of your procurement needs, or let 
                    <span className="font-semibold text-gold-300"> Materials.Zanzibaba</span> manage 
                    sourcing, supplier coordination and procurement for your project.
                  </p>
                  <div className="mt-5 flex gap-4 items-center">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center backdrop-blur-sm">
                      <div className="text-3xl font-bold text-emerald-400">80%</div>
                      <div className="text-[10px] text-zanzibar-300 mt-0.5">Supplier Marketplace</div>
                    </div>
                    <div className="text-lg text-zanzibar-300 font-bold">+</div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center backdrop-blur-sm">
                      <div className="text-3xl font-bold text-gold-400">20%</div>
                      <div className="text-[10px] text-zanzibar-300 mt-0.5">Fulfillment by Materials.Zanzibaba</div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    {[
                      "Contact suppliers directly on the marketplace — no fees, no markups",
                      "Or let Materials.Zanzibaba handle full procurement from sourcing to delivery",
                      "Dedicated procurement manager for large-scale projects",
                      "Quality inspection, logistics coordination, and supplier negotiation",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-zanzibar-100">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-end">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm text-center md:text-left max-w-sm">
                    <Package className="h-10 w-10 text-gold-300" />
                    <h3 className="mt-3 text-lg font-bold text-white">Let's Talk About Your Project</h3>
                    <p className="mt-1 text-sm text-zanzibar-200">
                      Tell us what you need and we'll put together a sourcing plan and timeline.
                    </p>
                    <div className="mt-5 flex flex-col gap-3">
                      <Link
                        href="/fulfillment"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 text-base font-bold text-white shadow-lg shadow-gold-500/30 transition-all hover:bg-gold-600 hover:shadow-xl hover:scale-[1.02]"
                      >
                        <Package className="h-5 w-5" />
                        Learn About Fulfillment
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                      <Link
                        href="/rfq"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                      >
                        <FileText className="h-4 w-4" />
                        Submit a Request
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Browse by Category</h2>
              <p className="mt-1 text-base text-gray-500">Procurement categories for hospitality, construction, and development projects</p>
            </div>
            <Link href="/marketplace" className="hidden items-center gap-1 text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700 sm:flex">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.slug}
                  href={`/marketplace/${cat.slug}`}
                  className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white px-3 py-4 text-center transition-all hover:border-zanzibar-200 hover:shadow-md"
                >
                  <div className="mb-2 inline-flex rounded-lg bg-zanzibar-50 p-2.5 text-zanzibar-600 transition-colors group-hover:bg-zanzibar-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 leading-tight">{cat.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>




      {/* Trust Strip */}
      <section className="border-y border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Built for Trust. Engineered for Results.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Platform Metrics */}
      <LazySection>
        <section className="bg-gradient-to-br from-zanzibar-900 to-emerald-900 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Zanzibar's Development Platform</h2>
              <p className="mt-1 text-base text-zanzibar-200">Connecting the entire development ecosystem in one place</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { icon: Store, label: "Suppliers & Manufacturers", value: supplierCount, desc: "Verified suppliers serving the Zanzibar market" },
                { icon: HardHat, label: "Contractors & Builders", value: contractorCount, desc: "Qualified contractors for projects of all sizes" },
                { icon: Briefcase, label: "Professionals & Consultants", value: professionalCount, desc: "Architects, engineers, and industry experts" },
                { icon: Building2, label: "Developers & Investors", value: developerCount, desc: "Active developers driving Zanzibar's growth" },
                { icon: ClipboardList, label: "Active Projects", value: projectCount, desc: "Development projects and investment opportunities" },
                { icon: FileText, label: "Market Intelligence", value: articleCount, desc: "Published articles and development insights" },
              ].map((m) => {
                const Icon = m.icon
                return (
                  <div key={m.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20 text-gold-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-white">{m.value}</p>
                    <p className="mt-1 text-sm font-medium text-zanzibar-200">{m.label}</p>
                    <p className="mt-1 text-xs text-zanzibar-300">{m.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </LazySection>

      <HomepageOfferSection />

      {/* End CTA — Start Sourcing or Join as Supplier */}
      <section className="border-t border-gray-200 bg-gradient-to-br from-zanzibar-900 to-emerald-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Ready to Get Started?</h2>
            <p className="mt-2 text-base text-zanzibar-200">
              Browse the marketplace for your project needs, or join as a supplier and grow your business.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/marketplace"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold-500 px-7 text-base font-bold text-white shadow-lg shadow-gold-500/30 transition-all hover:bg-gold-600 hover:shadow-xl"
              >
                <Store className="h-5 w-5" />
                Start Sourcing
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/become-supplier"
                className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-amber-400/50 px-6 text-base font-semibold text-white transition-all hover:bg-amber-500/20 hover:border-amber-300"
              >
                <Crown className="h-5 w-5" />
                Join as Supplier
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
