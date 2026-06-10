import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileCTA } from "@/components/layout/mobile-cta"
import { JsonLd } from "@/lib/seo/json-ld"
import { AnnouncementBanner } from "@/components/layout/announcement-banner"
import { AIAssistantChat } from "@/components/ai/chat-assistant"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zanzibaba.com"

export const metadata: Metadata = {
  title: {
    default: "Zanzibaba - Zanzibar's Project Procurement Ecosystem",
    template: "%s | Zanzibaba",
  },
  description:
    "Zanzibar's project procurement ecosystem for developers, contractors, and procurement teams. Source everything your project needs — from steel and cement to FF&E and hospitality supplies — across Zanzibar, Tanzania, and international markets.",
  keywords: [
    "Zanzibar", "project procurement", "construction", "suppliers",
    "contractors", "hospitality procurement", "FF&E",
    "building materials", "infrastructure", "development",
  ],
  authors: [{ name: "Zanzibaba" }],
  creator: "Zanzibaba",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Zanzibaba",
    title: "Zanzibaba - Zanzibar's Project Procurement Ecosystem",
    description:
      "Source everything your project needs — connect with verified suppliers, contractors, and procurement partners across Zanzibar, Tanzania, and international markets.",
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
        <Providers>
          <AnnouncementBanner />
          <Header />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <Footer />
          <MobileCTA />
          <JsonLd />
          <AIAssistantChat />
        </Providers>
      </body>
    </html>
  )
}
