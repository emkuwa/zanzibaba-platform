import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileCTA } from "@/components/layout/mobile-cta"
import { JsonLd } from "@/lib/seo/json-ld"
import { AnnouncementBanner } from "@/components/layout/announcement-banner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zanzibaba.com"

export const metadata: Metadata = {
  title: {
    default: "Zanzibaba - Zanzibar's Premier Building & Development Marketplace",
    template: "%s | Zanzibaba",
  },
  description:
    "Zanzibar's premier marketplace for building materials, suppliers, contractors, and professionals. Find everything you need for construction and development in Zanzibar.",
  keywords: [
    "Zanzibar", "building materials", "construction", "marketplace",
    "suppliers", "contractors", "architecture", "engineering",
    "prefab houses", "hospitality supplies", "real estate development",
  ],
  authors: [{ name: "Zanzibaba" }],
  creator: "Zanzibaba",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Zanzibaba",
    title: "Zanzibaba - Zanzibar's Premier Building & Development Marketplace",
    description:
      "Connect with verified suppliers, contractors, and professionals across Zanzibar. Source everything from cement to custom kitchens.",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Zanzibaba - Zanzibar's Premier Building & Development Marketplace",
    description:
      "Connect with verified suppliers, contractors, and professionals across Zanzibar.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#166534",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white text-gray-900 antialiased">
        <AnnouncementBanner />
        <Header />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <MobileCTA />
        <JsonLd />
      </body>
    </html>
  )
}
