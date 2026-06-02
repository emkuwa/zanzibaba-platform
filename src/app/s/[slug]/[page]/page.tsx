import { notFound } from "next/navigation"
import { getWebsite, MiniWebsitePage } from "../page"

const VALID_PAGES = ["about", "products", "projects", "contact"]

export default async function MiniWebsitePageRoute(props: { params: Promise<{ slug: string; page: string }> }) {
  const { slug, page } = await props.params
  const site = getWebsite(slug)
  if (!site || !VALID_PAGES.includes(page)) notFound()
  return <MiniWebsitePage site={site} page={page} />
}
