import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"

const posts = [
  { slug: "building-zanzibar-guide", title: "The Complete Guide to Building in Zanzibar", excerpt: "Everything you need to know about construction permits, materials, and contractors in Zanzibar.", date: "Jun 1, 2025", readTime: "8 min", category: "Guide" },
  { slug: "prefab-solutions-zanzibar", title: "Why Prefab Construction is Taking Off in Zanzibar", excerpt: "How modular building is revolutionizing resort and villa development on the island.", date: "May 25, 2025", readTime: "6 min", category: "Trends" },
  { slug: "sourcing-materials-zanzibar", title: "Sourcing Building Materials in Zanzibar: A Buyer's Guide", excerpt: "Tips for finding quality materials at competitive prices from local and international suppliers.", date: "May 18, 2025", readTime: "10 min", category: "Sourcing" },
  { slug: "hospitality-development-zanzibar", title: "Zanzibar Hospitality Development: Market Insights 2025", excerpt: "Key trends shaping hotel and resort development in Zanzibar's booming tourism sector.", date: "May 10, 2025", readTime: "7 min", category: "Market Insights" },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Zanzibaba Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Insights, guides, and market intelligence for Zanzibar's building and development sector.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="rounded-xl border bg-white overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-zanzibar-100 to-ocean-100 flex items-center justify-center">
                  <span className="text-zanzibar-600 font-semibold text-lg">{post.category}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-zanzibar-600 transition-colors">{post.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <span className="text-zanzibar-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read More <ArrowRight className="h-3 w-3" /></span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
