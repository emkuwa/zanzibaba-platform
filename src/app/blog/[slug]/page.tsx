import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Calendar, ChevronLeft, ChevronRight, ArrowLeft, Newspaper } from "lucide-react"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.article.findUnique({ where: { slug } })
  if (!article) return { title: "Article Not Found" }
  return {
    title: `${article.title} — Zanzibar Development News | Zanzibaba`,
    description: article.excerpt || `Read ${article.title} on Zanzibaba.`,
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await prisma.article.findUnique({ where: { slug } })
  if (!article) notFound()

  const [prev, next] = await Promise.all([
    prisma.article.findFirst({
      where: { status: "PUBLISHED", publishedAt: { lt: article.publishedAt } },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true },
    }),
    prisma.article.findFirst({
      where: { status: "PUBLISHED", publishedAt: { gt: article.publishedAt } },
      orderBy: { publishedAt: "asc" },
      select: { slug: true, title: true },
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-zanzibar-600">
            <ArrowLeft className="h-4 w-4" /> Back to News
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            {article.category && (
              <span className="inline-flex items-center rounded-full bg-zanzibar-50 px-3 py-1 text-xs font-medium text-zanzibar-600 border border-zanzibar-200">
                {article.category}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {article.publishedAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            {article.author && (
              <span className="text-gray-400">by {article.author}</span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 text-xl text-gray-500 leading-relaxed">{article.excerpt}</p>
          )}
        </div>

        {article.content && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm">
            <div className="prose prose-gray max-w-none">
              {article.content.split("\n").map((line, i) => {
                if (line.startsWith("## ")) {
                  return <h2 key={i} className="text-xl font-semibold text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>
                }
                if (line.startsWith("### ")) {
                  return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-6 mb-2">{line.slice(4)}</h3>
                }
                if (line.startsWith("- **")) {
                  const match = line.match(/- \*\*(.+?)\*\*: (.+)/)
                  if (match) {
                    return (
                      <p key={i} className="text-gray-600 ml-4 mb-2">
                        <strong className="text-gray-900">{match[1]}:</strong> {match[2]}
                      </p>
                    )
                  }
                }
                if (line.startsWith("- ")) {
                  return <li key={i} className="text-gray-600 ml-6 mb-1 list-disc">{line.slice(2)}</li>
                }
                if (line.startsWith("1. ")) {
                  return <li key={i} className="text-gray-600 ml-6 mb-1 list-decimal">{line.slice(3)}</li>
                }
                if (line.trim() === "") return <div key={i} className="h-3" />
                return <p key={i} className="text-gray-600 leading-relaxed mb-3">{line}</p>
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          {prev ? (
            <Link href={`/blog/${prev.slug}`} className="group rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-all">
              <span className="text-xs text-gray-400 flex items-center gap-1 mb-1"><ChevronLeft className="h-3 w-3" /> Previous</span>
              <span className="text-sm font-medium text-gray-900 group-hover:text-zanzibar-600 line-clamp-1">{prev.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/blog/${next.slug}`} className="group rounded-xl border border-gray-200 bg-white p-4 text-right hover:shadow-md transition-all">
              <span className="text-xs text-gray-400 flex items-center gap-1 justify-end mb-1">Next <ChevronRight className="h-3 w-3" /></span>
              <span className="text-sm font-medium text-gray-900 group-hover:text-zanzibar-600 line-clamp-1">{next.title}</span>
            </Link>
          ) : <div />}
        </div>
      </article>
    </div>
  )
}
