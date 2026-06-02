import { generateJSON, isAIEnabled } from "@/lib/ai/provider"
import type { SEOContent } from "./types"

const SAMPLE_FAQS = [
  { question: "What payment methods do you accept?", answer: "We accept bank transfers, mobile money (M-Pesa, Tigo Pesa), and major credit cards. For large orders, we offer flexible payment terms." },
  { question: "What is your delivery timeline?", answer: "Delivery typically takes 2-5 business days within Zanzibar and 5-10 business days to mainland Tanzania, depending on order size and location." },
  { question: "Do you offer bulk discounts?", answer: "Yes, we offer volume-based pricing. Contact us with your requirements for a customized quote." },
  { question: "What is your minimum order quantity?", answer: "Minimum order quantities vary by product. Most items have no minimum, while specialized products may require a minimum order." },
]

function generateFallbackSEO(companyName: string, products: string[], location: string): SEOContent {
  const productNames = products.length > 0 ? products : ["Building Materials"]
  const slugBase = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  return {
    categoryPages: productNames.slice(0, 5).map((p) => ({
      title: `${p} | ${companyName} | ${location || "Zanzibar"}`,
      content: `Browse our range of ${p.toLowerCase()} at ${companyName}. Quality products, competitive prices, and reliable delivery across ${location || "Zanzibar"}. Contact us for more information.`,
      slug: slugify(p), metaDescription: `Buy ${p.toLowerCase()} from ${companyName} in ${location || "Zanzibar"}. Quality assured, competitive pricing. ${(products.length > 0 ? "Browse our catalog." : "Contact us today.")}`,
    })),
    productPages: productNames.slice(0, 6).map((p) => ({
      title: `Buy ${p} Online | ${companyName}`, content: `${p} available at ${companyName}. Premium quality, competitive prices. Suitable for ${p.toLowerCase().includes("cement") ? "construction and concrete works" : "building and construction projects"}. Order now for delivery across ${location || "Zanzibar"}.`,
      slug: slugify(p), metaDescription: `Buy ${p.toLowerCase()} from ${companyName}. ✓ Quality Assured ✓ Competitive Prices ✓ Fast Delivery in ${location || "Zanzibar"}. Order Online.`,
    })),
    blogArticles: [
      { title: `Building Materials Guide: Choosing the Right Supplies for Your ${location || "Zanzibar"} Project`, content: `When planning a construction project in ${location || "Zanzibar"}, choosing the right building materials is crucial for success. In this guide, we cover everything from cement grades to reinforcement specifications...`, slug: "building-materials-guide", excerpt: "Essential guide to choosing building materials for construction projects in Zanzibar.", keywords: ["building materials", "construction guide", location || "Zanzibar"].filter(Boolean) },
      { title: `Why Choose ${companyName} for Your Construction Needs`, content: `${companyName} has established itself as a trusted supplier in ${location || "Zanzibar"}. With a commitment to quality and customer service, we help builders and contractors find the right materials...`, slug: "why-choose-us", excerpt: `Why ${companyName} is the preferred choice for construction supplies.`, keywords: [companyName, "building supplier", location || "Zanzibar"].filter(Boolean) },
    ],
    faqs: SAMPLE_FAQS,
    keywordSuggestions: [
      { keyword: `building materials ${location || "Zanzibar"}`, volume: "High", difficulty: "Medium" },
      { keyword: `construction supplies ${location || "Zanzibar"}`, volume: "Medium", difficulty: "Low" },
      { keyword: `${companyName.toLowerCase()}`, volume: "Low", difficulty: "Low" },
      { keyword: `${productNames[0]?.toLowerCase()} ${location || "Zanzibar"}`, volume: "Medium", difficulty: "Low" },
    ],
  }
}

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }

export async function generateSEO(companyName: string, products: string[], location: string, description: string): Promise<SEOContent> {
  if (isAIEnabled()) {
    const result = await generateJSON<SEOContent>(SEO_SYSTEM, `Generate SEO content for a building materials supplier:
Company: ${companyName}
Products: ${products.join(", ")}
Location: ${location}
Description: ${description}

Return JSON with: categoryPages (array of {title, content, slug, metaDescription}), productPages array, blogArticles array (with excerpt, keywords), faqs array ({question, answer}), keywordSuggestions array ({keyword, volume, difficulty})`)
    if (result) return result
  }
  return generateFallbackSEO(companyName, products, location)
}

const SEO_SYSTEM = "You are a Zanzibaba SEO specialist. Generate search-optimized content for building materials suppliers targeting East African markets."
