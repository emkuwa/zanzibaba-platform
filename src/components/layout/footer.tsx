"use client"

import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

const marketplaceLinks = [
  { href: "/marketplace/building-materials", label: "Building Materials" },
  { href: "/marketplace/tools-equipment", label: "Tools & Equipment" },
  { href: "/marketplace/finishes-interiors", label: "Finishes & Interiors" },
  { href: "/marketplace/plumbing", label: "Plumbing" },
  { href: "/marketplace/electrical", label: "Electrical" },
  { href: "/marketplace/prefab", label: "Prefab Structures" },
  { href: "/marketplace/hardware", label: "Hardware" },
  { href: "/fulfillment", label: "Fulfillment by Materials.Zanzibaba", highlight: true },
]

const serviceLinks = [
  { href: "/fulfillment", label: "Procurement Services" },
  { href: "/estimate", label: "Cost Estimation" },
  { href: "/prices", label: "Material Prices" },
  { href: "/strategic-suppliers", label: "Strategic Suppliers" },
  { href: "/international", label: "International Sourcing" },
]

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/careers", label: "Careers" },
  { href: "/press", label: "Press" },
  { href: "/contact", label: "Contact" },
]

const resourceLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
]

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight text-white">
              <span className="text-zanzibar-400">Z</span>ANZIBABA
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-400">
              Zanzibar&apos;s Premier Building &amp; Development Marketplace. Connecting suppliers,
              contractors, and professionals across the archipelago.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-zanzibar-400" />
                <span>Stone Town, Zanzibar, Tanzania</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-zanzibar-400" />
                <a href="tel:+255716002790" className="hover:text-zanzibar-400 transition-colors">+255 716 002 790</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-zanzibar-400" />
                <a href="mailto:info@zanzibaba.com" className="hover:text-zanzibar-400 transition-colors">info@zanzibaba.com</a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Marketplace
            </h3>
            <ul className="space-y-2.5">
              {marketplaceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-colors ${link.highlight ? "text-gold-400 hover:text-gold-300" : "hover:text-zanzibar-400"}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Procurement Services
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-zanzibar-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-zanzibar-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-zanzibar-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-white">Subscribe to our newsletter</h4>
              <p className="mb-3 text-sm text-gray-400">
                Get the latest updates on products and market trends.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
                />
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-zanzibar-600 px-4 text-sm font-medium text-white transition-colors hover:bg-zanzibar-700"
                >
                  Subscribe
                </button>
              </form>
            </div>

            <div className="flex gap-4">
              {["Facebook", "Instagram", "Twitter", "LinkedIn"].map((name) => (
                <span
                  key={name}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-gray-800 text-xs font-medium text-gray-400 transition-colors hover:bg-zanzibar-600 hover:text-white"
                >
                  {name[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Zanzibaba. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
