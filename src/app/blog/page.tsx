import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Calendar, Clock, ArrowRight, ChevronRight, Newspaper } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Development News & Intelligence — Zanzibar | Zanzibaba",
  description: "Market insights, project announcements, procurement guides, and development intelligence for Zanzibar's building sector.",
}

export default async function BlogPage() {
  const posts = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
  })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-zanzibar-900 via-emerald-900 to-zanzibar-900 py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 mb-4">
            <Newspaper className="h-4 w-4" />
            Development Intelligence
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Zanzibar Development News</h1>
          <p className="mt-4 text-lg text-zanzibar-200 max-w-2xl mx-auto">
            Market insights, project announcements, procurement guides, and intelligence for Zanzibar's building and development sector.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No articles yet</h3>
            <p className="mt-1 text-sm text-gray-500">Development news will appear here as we publish market intelligence.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {posts.filter((p) => p.isFeatured).slice(0, 1).map((featured) => (
              <Link key={featured.id} href={`/blog/${featured.slug}`} className="group block mb-10">
                <div className="rounded-2xl bg-gradient-to-br from-zanzibar-800 to-emerald-800 p-8 text-white transition-all hover:shadow-xl">
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-zanzibel-200 mb-3">
                    Featured
                  </span>
                  <h2 className="text-2xl font-bold group-hover:text-zanzibar-200 transition-colors">{featured.title}</h2>
                  <p className="mt-2 text-zanzibar-200 line-clamp-2">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-zanzibar-300">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {featured.publishedAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    {featured.category && <span>{featured.category}</span>}
                  </div>
                </div>
              </Link>
            ))}

            {/* Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                    <div className="h-48 bg-gradient-to-br from-zanzibar-100 to-emerald-50 flex items-center justify-center">
                      <span className="text-zanzibar-600 font-semibold text-lg">{post.category}</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-zanzibar-600 transition-colors">{post.title}</h2>
                      <p className="text-gray-600 text-sm mb-4 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{post.category}</span>
                        <span className="text-zanzibar-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read More <ArrowRight className="h-3 w-3" /></span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
