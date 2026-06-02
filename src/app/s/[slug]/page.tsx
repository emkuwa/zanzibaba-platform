import Link from "next/link"
import { notFound } from "next/navigation"
import { Building2, Phone, Mail, MapPin, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// In-memory store for published mini websites
const websiteStore = new Map<string, any>()

export function registerWebsite(slug: string, site: any) {
  websiteStore.set(slug, site)
}

export function getWebsite(slug: string) {
  return websiteStore.get(slug)
}

export default async function MiniWebsiteHome(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const site = getWebsite(slug)
  if (!site) notFound()
  return <MiniWebsitePage site={site} page="home" />
}

export function MiniWebsitePage({ site, page }: { site: any; page: string }) {
  const p = site.pages[page] || site.pages.home

  if (page === "products") {
    return (
      <div className="min-h-screen bg-white">
        <Header site={site} current="products" />
        <main className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{p.headline || "Our Products"}</h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {p.items?.map((item: any, i: number) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                  <Button size="sm" className="mt-4">{item.cta || "Request Quote"}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <Footer site={site} />
      </div>
    )
  }

  if (page === "projects") {
    return (
      <div className="min-h-screen bg-white">
        <Header site={site} current="projects" />
        <main className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{p.headline || "Our Projects"}</h1>
          <div className="grid gap-6 sm:grid-cols-2">
            {p.items?.map((item: any, i: number) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <Footer site={site} />
      </div>
    )
  }

  if (page === "about") {
    return (
      <div className="min-h-screen bg-white">
        <Header site={site} current="about" />
        <main className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{p.headline || "About Us"}</h1>
          <div className="prose max-w-none"><p className="text-gray-700 leading-relaxed">{p.content}</p></div>
          {p.mission && (
            <div className="mt-8 rounded-xl bg-zanzibar-50 p-6">
              <p className="text-sm font-medium text-zanzibar-600 uppercase tracking-wider mb-2">Our Mission</p>
              <p className="text-lg text-zanzibar-800 font-medium">{p.mission}</p>
            </div>
          )}
          {p.values?.length > 0 && (
            <div className="mt-8"><p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Our Values</p>
              <div className="flex flex-wrap gap-2">{p.values.map((v: string, i: number) => <Badge key={i} variant="secondary" className="text-sm px-4 py-1.5">{v}</Badge>)}</div>
            </div>
          )}
        </main>
        <Footer site={site} />
      </div>
    )
  }

  if (page === "contact") {
    return (
      <div className="min-h-screen bg-white">
        <Header site={site} current="contact" />
        <main className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{p.headline || "Contact Us"}</h1>
          <div className="grid gap-6 sm:grid-cols-3">
            <Card><CardContent className="p-5 text-center"><Phone className="mx-auto h-6 w-6 text-zanzibar-600 mb-2" /><p className="font-medium text-gray-900">Phone</p><p className="text-sm text-gray-500">{p.phone || "Contact us"}</p></CardContent></Card>
            <Card><CardContent className="p-5 text-center"><Mail className="mx-auto h-6 w-6 text-zanzibar-600 mb-2" /><p className="font-medium text-gray-900">Email</p><p className="text-sm text-gray-500">{p.email || "Send us a message"}</p></CardContent></Card>
            <Card><CardContent className="p-5 text-center"><MapPin className="mx-auto h-6 w-6 text-zanzibar-600 mb-2" /><p className="font-medium text-gray-900">Address</p><p className="text-sm text-gray-500">{p.address || "Zanzibar"}</p></CardContent></Card>
          </div>
          <div className="mt-8 text-center"><Button size="lg" className="bg-zanzibar-600 hover:bg-zanzibar-700">{p.cta || "Get in Touch"}</Button></div>
        </main>
        <Footer site={site} />
      </div>
    )
  }

  // Default: Home page
  return (
    <div className="min-h-screen bg-white">
      <Header site={site} current="home" />
      <main>
        <section className="bg-gradient-to-br from-gray-900 via-zanzibar-900 to-gray-900 py-20 lg:py-28">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{site.tagline}</h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">{p.subheadline}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-white">{p.heroCta || "Get a Quote"}</Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">View Products</Button>
            </div>
          </div>
        </section>
        <section className="py-16"><div className="mx-auto max-w-6xl px-4"><div className="prose max-w-none mx-auto text-center"><p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">{p.content}</p></div></div></section>
        {p.sections?.map((s: any, i: number) => {
          if (s.type === "value-props") {
            const props = s.content.split("|")
            return <section key={i} className="border-t bg-gray-50 py-16"><div className="mx-auto max-w-6xl px-4"><div className="grid gap-6 sm:grid-cols-3">{props.map((prop: string, j: number) => <Card key={j}><CardContent className="p-5 text-center"><p className="font-semibold text-gray-900">{prop.trim()}</p></CardContent></Card>)}</div></div></section>
          }
          if (s.type === "cta") {
            return <section key={i} className="border-t py-16 bg-zanzibar-50"><div className="mx-auto max-w-3xl px-4 text-center"><p className="text-xl font-medium text-zanzibar-800">{s.content}</p><Button size="lg" className="mt-6 bg-gold-500 hover:bg-gold-600 text-white">Get Started</Button></div></section>
          }
          return null
        })}
      </main>
      <Footer site={site} />
    </div>
  )
}

function Header({ site, current }: { site: any; current: string }) {
  const pages = [
    { key: "home", label: "Home", href: `/s/${site.slug}` },
    { key: "about", label: "About", href: `/s/${site.slug}/about` },
    { key: "products", label: "Products", href: `/s/${site.slug}/products` },
    { key: "projects", label: "Projects", href: `/s/${site.slug}/projects` },
    { key: "contact", label: "Contact", href: `/s/${site.slug}/contact` },
  ]
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 h-16">
        <Link href={`/s/${site.slug}`} className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-zanzibar-600" />
          <span className="font-bold text-gray-900">{site.companyName}</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">{pages.map(p => (
          <Link key={p.key} href={p.href} className={`text-sm font-medium transition-colors ${current === p.key ? "text-zanzibar-600" : "text-gray-600 hover:text-gray-900"}`}>{p.label}</Link>
        ))}</nav>
      </div>
    </header>
  )
}

function Footer({ site }: { site: any }) {
  return (
    <footer className="border-t bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {site.companyName}. Powered by Zanzibaba.</p>
      </div>
    </footer>
  )
}
