import Link from "next/link"
import type { Metadata } from "next"
import Image from "next/image"
import { SearchBar } from "@/components/layout/search-bar"
import { LazySection } from "@/components/ui/lazy-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Building2, Sofa, CookingPot, Shirt, Bath, Lightbulb, DoorOpen, Home, Zap,
  Thermometer, Trees, Waves, UtensilsCrossed, Package, Star, Shield,
  ChevronRight, MapPin, Users, Store,
  Award, TrendingUp, FileText, MessageSquare, Globe, MoveRight,
  Building, Hotel, Warehouse, Container, Clock, Mail, ArrowRight,
  Sparkles, Phone, Ruler, Timer, Handshake,
  SearchX, ExternalLink, Layers,
  BookOpen, Target, ZapIcon,
  Grid3x3, HelpCircle, CheckCircle2, BarChart3, Rocket, UserPlus, HardHat, Briefcase,
  Calculator, ClipboardList, Headset,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Zanzibaba - Project Procurement & Sourcing Platform for Zanzibar",
  description:
    "Zanzibar's project procurement and sourcing platform for hotel developers, resort owners, villa developers, and commercial projects. Source FF&E, OS&E, building materials, and hospitality supplies locally and globally.",
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

const suppliers = [
  { name: "Zanzibar Cement Ltd", rating: 4.8, reviews: 124, location: "Stone Town", verified: true, featured: true, years: 18, categories: "Building Materials", response: "<2h", international: false },
  { name: "Swahili Build Mart", rating: 4.7, reviews: 203, location: "Mkunazini", verified: true, featured: true, years: 12, categories: "Building Materials, Hardware", response: "<1h", international: false },
  { name: "East African Steel Co", rating: 4.9, reviews: 156, location: "Mombasa", verified: true, featured: true, years: 25, categories: "Steel, Roofing, Structure", response: "<3h", international: true },
  { name: "Ocean View Interiors", rating: 4.6, reviews: 89, location: "Michenzani", verified: true, featured: false, years: 8, categories: "Furniture, Interiors", response: "<2h", international: false },
  { name: "Green Energy Solutions", rating: 4.5, reviews: 72, location: "Stone Town", verified: true, featured: false, years: 6, categories: "Solar, Electrical", response: "<4h", international: false },
  { name: "Premium Paints Tanzania", rating: 4.7, reviews: 98, location: "Dar es Salaam", verified: true, featured: true, years: 15, categories: "Finishes, Paints", response: "<1h", international: false },
  { name: "Modern Interiors Ltd", rating: 4.7, reviews: 134, location: "Dar es Salaam", verified: true, featured: false, years: 10, categories: "Furniture, Wardrobes, Kitchens", response: "<2h", international: false },
  { name: "Spice Island Hardware", rating: 4.5, reviews: 67, location: "Kiponda", verified: true, featured: false, years: 22, categories: "Hardware, Plumbing", response: "<1h", international: false },
]

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

const projects = [
  { title: "Fumba Town Phase III", type: "Residential Development", budget: "$12M", location: "Fumba", status: "Sourcing", desc: "Seeking suppliers for 200+ residential units — tiles, fittings, fixtures." },
  { title: "Meliá Zanzibar Expansion", type: "Hospitality", budget: "$8M", location: "Mtangani", desc: "Hotel expansion requiring premium FF&E, bathroom fixtures, lighting." },
  { title: "Stone Town Heritage Hotel", type: "Hospitality", budget: "$5M", location: "Stone Town", desc: "Boutique hotel fit-out — custom furniture, finishes, decor elements." },
  { title: "Nungwi Beach Resort", type: "Hospitality", budget: "$15M", location: "Nungwi", desc: "New beachfront resort — structural materials, roofing, joinery." },
]

const international = [
  {
    country: "China", flag: "🇨🇳", slug: "china", suppliers: "200+", products: "10,000+",
    items: [
      { icon: Building2, label: "Building Materials" },
      { icon: CookingPot, label: "Kitchens" },
      { icon: Sofa, label: "Furniture" },
      { icon: Warehouse, label: "Prefab Houses" },
    ],
  },
  {
    country: "Turkey", flag: "🇹🇷", slug: "turkey", suppliers: "120+", products: "5,000+",
    items: [
      { icon: Grid3x3, label: "Ceramics & Tiles" },
      { icon: DoorOpen, label: "Doors" },
      { icon: Sparkles, label: "Interior Finishes" },
    ],
  },
  {
    country: "UAE", flag: "🇦🇪", slug: "uae", suppliers: "80+", products: "3,500+",
    items: [
      { icon: Hotel, label: "Hospitality Solutions" },
      { icon: Award, label: "Luxury Materials" },
    ],
  },
  {
    country: "India", flag: "🇮🇳", slug: "india", suppliers: "150+", products: "7,000+",
    items: [
      { icon: Zap, label: "Electrical" },
      { icon: Bath, label: "Sanitary" },
      { icon: Building2, label: "Construction Products" },
    ],
  },
]

const testimonials = [
  { quote: "We sourced materials for our entire Meliá expansion through Zanzibaba. The RFQ feature connected us with 12 verified suppliers in under 48 hours.", name: "Ahmed S.", title: "Project Director, Meliá Zanzibar" },
  { quote: "As a general contractor, vetting suppliers was our biggest bottleneck. Zanzibaba eliminated that — now we source everything from one trusted platform.", name: "Fatma H.", title: "CEO, BuildRight Construction" },
  { quote: "The international sourcing capability is a game-changer. We're importing tiles from Turkey and furniture from China — all through Zanzibaba's network.", name: "James M.", title: "Architect, Studio ZNZ" },
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-gold-400 text-gold-400" : "text-gray-200"}`} />
      ))}
      <span className="ml-1 text-xs font-medium text-gray-500">{rating}</span>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950">
        <Image
          src="/images/hero/hero-bg.jpg"
          alt="Zanzibaba marketplace"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="overlay-readable absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zanzibar-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zanzibar-600/30 bg-zanzibar-900/50 px-4 py-1.5 text-sm text-zanzibar-200 backdrop-blur-sm">
              <Rocket className="h-3.5 w-3.5 text-gold-400" />
              Founding Supplier Program Now Open — Join During Launch Phase
            </div>
            <p className="text-readable-shadow text-2xl font-bold tracking-tight text-white sm:text-3xl mb-3">
              Source Everything Your Project Needs
            </p>
            <p className="text-readable-shadow text-sm font-medium tracking-widest uppercase text-gold-400 mb-3">
              Source Locally. Procure Globally. Deliver with Confidence.
            </p>
            <h1 className="text-readable-shadow text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Zanzibar&apos;s Project Procurement{" "}
              <span className="bg-gradient-to-r from-zanzibar-300 to-gold-300 bg-clip-text text-transparent">
                Ecosystem
              </span>
            </h1>
            <p className="text-readable-shadow mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-100 sm:text-xl">
              Connect with verified suppliers, contractors, manufacturers, logistics providers, 
              and procurement partners across Zanzibar, Tanzania, and international markets. 
              From concept to delivery — manage every stage of project procurement in one platform.
            </p>
            <div className="mt-8 mx-auto max-w-3xl">
              <div className="rounded-2xl border border-zanzibar-500/30 bg-zanzibar-900/40 p-2 shadow-xl shadow-zanzibar-900/50 ring-1 ring-zanzibar-500/20 backdrop-blur-sm">
                <SearchBar />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/rfq"
                className="inline-flex h-14 items-center gap-2.5 rounded-xl bg-gold-500 px-8 text-base font-bold text-white shadow-lg shadow-gold-500/30 transition-all hover:bg-gold-600 hover:shadow-xl hover:scale-[1.02]"
              >
                <FileText className="h-5 w-5" />
                Upload BOQ — Start Procurement
              </Link>
              <Link
                href="/projects"
                className="inline-flex h-14 items-center gap-2 rounded-xl border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <Building2 className="h-5 w-5" />
                Browse Active Projects
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-gray-500">Procurement for:</span>
              {["Hotel FF&E", "Resort Supply", "Infrastructure", "Hospitality", "Commercial"].map((tag) => (
                <Link
                  key={tag}
                  href={`/marketplace?q=${tag.toLowerCase()}`}
                  className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-400 transition-colors hover:border-zanzibar-500 hover:text-zanzibar-400"
                >
                  {tag}
                </Link>
              ))}
            </div>
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
                We Are Currently Accepting Founding Members
              </h2>
              <p className="relative mx-auto mt-3 max-w-2xl text-base text-zanzibar-100">
                Zanzibaba is in launch phase. Founding Suppliers, Contractors, and Professionals 
                receive priority visibility, free verification, and exclusive marketplace benefits.
              </p>
              <div className="relative mt-6 grid gap-3 sm:grid-cols-3 max-w-lg mx-auto">
                {[
                  { label: "Founding Suppliers", target: "100" },
                  { label: "Founding Contractors", target: "50" },
                  { label: "Founding Professionals", target: "40" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-gold-300">0</div>
                    <div className="text-xs text-zanzibar-200 mt-0.5">/ {item.target} {item.label}</div>
                  </div>
                ))}
              </div>
              <div className="relative mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/auth/register/supplier" className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold-500 px-7 text-base font-bold text-white shadow-lg shadow-gold-500/30 transition-all hover:bg-gold-600 hover:shadow-xl hover:scale-[1.02]">
                  <Store className="h-5 w-5" /> Join as Founding Supplier
                </Link>
                <Link href="/auth/register" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10">
                  <Users className="h-4 w-4" /> Register as Buyer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Build Your Project Budget */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zanzibar-900 via-zanzibar-800 to-emerald-900 py-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/15 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-700/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-10">
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
            <div className="mt-8 text-center">
              <Link
                href="/auth/register/supplier"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-zanzibar-600 px-7 text-base font-semibold text-white shadow-lg hover:bg-zanzibar-700 transition-colors"
              >
                <Store className="h-5 w-5" />
                Join Free — List Your Products <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Verified Suppliers */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Verified Project Suppliers</h2>
              <p className="mt-1 text-base text-gray-500">Every supplier vetted for project-grade procurement. FF&amp;E, OS&amp;E, building materials, and hospitality supplies.</p>
            </div>
            <Link href="/suppliers" className="hidden items-center gap-1 text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700 sm:flex">
              All Suppliers <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {suppliers.slice(0, 8).map((supplier) => (
              <div key={supplier.name} className="group relative rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-zanzibar-200 hover:shadow-lg hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-zanzibar-100 to-zanzibar-200 text-zanzibar-600">
                    <Store className="h-5 w-5" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {supplier.verified && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                        <Shield className="h-2.5 w-2.5" /> Verified
                      </span>
                    )}
                    {supplier.featured && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-gold-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200">
                        <Award className="h-2.5 w-2.5" /> Featured
                      </span>
                    )}
                    {supplier.international && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-200">
                        <Globe className="h-2.5 w-2.5" /> International
                      </span>
                    )}
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-zanzibar-50 px-2 py-0.5 text-[10px] font-medium text-zanzibar-700 border border-zanzibar-200">
                      <MessageSquare className="h-2.5 w-2.5" /> Claim
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">{supplier.name}</h3>
                <div className="mt-1 flex items-center justify-between">
                  <StarRating rating={supplier.rating} />
                  <span className="text-[11px] text-emerald-600 font-medium">{supplier.response} response</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {supplier.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Layers className="h-3 w-3 shrink-0" />
                    {supplier.categories}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Building2 className="h-3 w-3 shrink-0" />
                    {supplier.years} years in business
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`https://wa.me/255?text=Hi%20${encodeURIComponent(supplier.name)}%2C%20I%27m%20interested%20in%20your%20products%20on%20Zanzibaba`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                  <Link
                    href={`/marketplace?q=${encodeURIComponent(supplier.categories.split(',')[0].trim())}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-zanzibar-50 py-2 text-xs font-medium text-zanzibar-700 hover:bg-zanzibar-100 transition-colors border border-zanzibar-200"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View Products
                  </Link>
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-gray-400">
                  <Shield className="h-3 w-3" />
                  <span>Claim this profile to manage your business info</span>
                </div>
              </div>
            ))}
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

      {/* Featured Projects */}
      <LazySection>
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Active Projects Seeking Suppliers</h2>
                <p className="mt-1 text-base text-gray-500">Projects currently sourcing on Zanzibaba</p>
              </div>
              <Link href="/projects" className="hidden items-center gap-1 text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700 sm:flex">
                View All Projects <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((project) => (
                <div key={project.title} className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-zanzibar-200 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="warning" className="text-[10px] px-2 py-0.5">{project.status}</Badge>
                    <span className="text-sm font-bold text-zanzibar-700">{project.budget}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-zanzibar-600 transition-colors">{project.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{project.type}</p>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{project.desc}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                    <MapPin className="h-3 w-3" />
                    {project.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* International Sourcing */}
      <LazySection>
        <section className="relative overflow-hidden bg-gray-50 py-12 sm:py-16">
          <div className="absolute inset-0">
            <Image src="/images/hero/global-sourcing.jpg" alt="Global sourcing network" fill className="object-cover" sizes="100vw" />
          </div>
          <div className="overlay-light absolute inset-0" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="glass-panel mx-auto max-w-4xl p-8 sm:p-10 text-center">
              <Globe className="mx-auto h-8 w-8 text-gold-300" />
              <h2 className="text-readable-shadow mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">Source from International Manufacturers</h2>
              <p className="text-readable-shadow mt-2 text-base text-gray-200">Direct factory access. No middlemen. Competitive pricing.</p>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {international.map((c) => (
                <Link
                  key={c.slug}
                  href={`/international/${c.slug}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-zanzibar-200 hover:shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{c.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{c.country}</h3>
                      <p className="text-xs text-gray-500">{c.suppliers} suppliers · {c.products} products</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {c.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.label} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                          <Icon className="h-3.5 w-3.5 text-zanzibar-500" />
                          {item.label}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-zanzibar-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Browse Suppliers <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Founding Global Partners */}
      <LazySection>
        <section className="relative overflow-hidden py-12 sm:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100 via-white to-white" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="default" className="mb-3 px-4 py-1.5 text-sm bg-zanzibar-100 text-zanzibar-700 border-0">
                <Award className="mr-1.5 h-3.5 w-3.5" />
                Founding Global Partners
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Strategic International Partners</h2>
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
              <p className="text-sm text-gray-500">
                More international partnerships being announced. Contact us for partnership inquiries.
              </p>
              <Link href="/contact" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700">
                Become a Partner <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </LazySection>

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

      {/* Experience Center */}
      <LazySection>
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-zanzibar-900 to-gray-900 py-12 sm:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/15 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-700/20 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="glass-panel mx-auto max-w-3xl p-8 sm:p-10 text-center mb-10">
              <Badge variant="warning" className="mb-3 px-4 py-1.5 text-sm">
                <Building2 className="mr-1.5 h-3.5 w-3.5" />
                Coming Soon — Fumba, Zanzibar
              </Badge>
              <h2 className="text-readable-shadow text-2xl font-bold tracking-tight text-white sm:text-3xl">Zanzibaba Experience Center</h2>
              <p className="text-readable-shadow mt-2 text-base text-gray-200 max-w-xl mx-auto">
                Zanzibar&apos;s first building materials experience center. Touch, compare, and select materials 
                before you purchase — all under one roof in Fumba.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {[
                { icon: BookOpen, title: "Sample Library", desc: "Thousands of material samples — tiles, stone, wood, fabrics, finishes" },
                { icon: CookingPot, title: "Kitchen Displays", desc: "Fully built kitchen setups with different cabinet styles and countertops" },
                { icon: Bath, title: "Bathroom Displays", desc: "Complete bathroom installations with tiles, sanitary ware, and lighting" },
                { icon: Hotel, title: "Hospitality Solutions", desc: "Hotel-grade FF&E, OS&E, and resort furnishing displays" },
                { icon: Warehouse, title: "Prefab Concepts", desc: "Prefab house models, container conversions, modular building samples" },
                { icon: Handshake, title: "Investor Consultation", desc: "One-on-one consultations for developers and large-scale projects" },
              ].map((exp) => {
                const Icon = exp.icon
                return (
                  <div key={exp.title} className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm transition-all hover:bg-white/20">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/20 text-gold-300">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="mt-3 font-semibold text-white text-sm">{exp.title}</h3>
                    <p className="mt-1 text-xs text-gray-200">{exp.desc}</p>
                  </div>
                )
              })}
            </div>
            <div className="text-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-4 rounded-xl border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-sm">
                <Phone className="h-4 w-4 text-gold-300" />
                <span className="text-sm text-gray-200"><a href="tel:+255716002790" className="text-gold-300 font-medium hover:text-gold-200">+255 716 002 790</a></span>
                <span className="text-gray-500">|</span>
                <Mail className="h-4 w-4 text-gold-300" />
                <span className="text-sm text-gray-200"><a href="mailto:info@zanzibaba.com" className="text-gold-300 font-medium hover:text-gold-200">info@zanzibaba.com</a></span>
                <span className="text-gray-500">|</span>
                <MapPin className="h-4 w-4 text-gold-300" />
                <span className="text-sm text-gray-200">Fumba, Eneo la Uwekezaji</span>
              </div>
              <div className="mt-4">
                <Link href="/experience-center" className="inline-flex h-11 items-center gap-2 rounded-xl bg-zanzibar-600 px-6 text-sm font-semibold text-white shadow-lg transition-all hover:bg-zanzibar-700">
                  Learn More <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Testimonials */}
      <LazySection>
        <section className="bg-gradient-to-br from-zanzibar-900 to-emerald-900 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Trusted by Industry Leaders</h2>
              <p className="mt-1 text-base text-zanzibar-200">Hear from Zanzibar&apos;s top developers and contractors</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <div key={i} className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-3 text-gold-400">
                    <svg className="h-6 w-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-sm leading-relaxed text-zanzibar-100">{t.quote}</p>
                  <div className="mt-4 border-t border-white/10 pt-3">
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-zanzibar-300">{t.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Newsletter */}
      <LazySection>
        <section className="border-t border-gray-200 bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <Mail className="h-8 w-8 text-zanzibar-600" />
              <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-900">Stay Updated</h2>
              <p className="mt-1 text-sm text-gray-500">Get project opportunities, new supplier listings, and market trends.</p>
              <form className="mt-5 flex w-full max-w-md gap-3">
                <input type="email" placeholder="Enter your email" className="h-11 flex-1 rounded-xl border border-gray-300 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500" />
                <Button size="lg" type="submit">Subscribe</Button>
              </form>
              <p className="mt-2 text-xs text-gray-400">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </section>
      </LazySection>
    </div>
  )
}
