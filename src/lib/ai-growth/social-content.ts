import { generateJSON, isAIEnabled } from "@/lib/ai/provider"
import type { SocialCalendar, SocialPost } from "./types"

const PLATFORMS: SocialPost["platform"][] = ["facebook", "instagram", "linkedin"]
const POST_TYPES: SocialPost["type"][] = ["product", "educational", "promotional", "company"]

function generateFallbackCalendar(companyName: string, products: string[], weeks: number): SocialCalendar[] {
  const calendars: SocialCalendar[] = []
  const themes = ["Product Spotlight", "Industry Tips", "Company Story", "Project Showcase", "Customer Success", "Behind the Scenes", "New Arrivals", "Expert Advice"]

  for (let w = 0; w < weeks; w++) {
    const start = new Date()
    start.setDate(start.getDate() + w * 7)
    const posts: SocialPost[] = []

    for (const platform of PLATFORMS) {
      for (let d = 0; d < 3; d++) {
        const type = POST_TYPES[(w + d) % POST_TYPES.length]
        const date = new Date(start)
        date.setDate(date.getDate() + d)
        const product = products[d % products.length] || "building materials"
        posts.push({
          platform, type,
          title: type === "product" ? `Check out our ${product}!` : type === "educational" ? `${themes[w % themes.length]} Tips` : type === "promotional" ? `Special Offer on ${product}` : `Meet ${companyName}`,
          content: type === "product" ? `Looking for quality ${product.toLowerCase()}? ${companyName} has you covered! Premium quality, competitive prices, fast delivery across Zanzibar. Contact us today! #${companyName.replace(/\s+/g, "")} #BuildingMaterials #Zanzibar` : type === "educational" ? `${themes[w % themes.length]}: Choosing the right materials for your project makes all the difference. At ${companyName}, we help you select the best options. #ConstructionTips #${companyName.replace(/\s+/g, "")}` : type === "promotional" ? `Limited time offer on ${product.toLowerCase()}! Contact ${companyName} for exclusive pricing. Don't miss out! #SpecialOffer #BuildingMaterials #Zanzibar` : `${companyName} has been serving ${products[0] ? "the construction industry" : "our customers"} with dedication. Here's our story. #AboutUs #${companyName.replace(/\s+/g, "")}`,
          hashtags: [companyName.replace(/\s+/g, ""), "BuildingMaterials", "Zanzibar", "Construction", "Tanzania"],
          scheduledDate: date.toISOString().split("T")[0], status: "draft",
        })
      }
    }
    calendars.push({ weekStart: start.toISOString().split("T")[0], theme: themes[w % themes.length], posts })
  }
  return calendars
}

export async function generateSocialContent(
  companyName: string, products: string[], weeks: number, campaign?: string
): Promise<SocialCalendar[]> {
  if (isAIEnabled()) {
    const result = await generateJSON<SocialCalendar[]>(SOCIAL_SYSTEM, `Generate a ${weeks}-week social media content calendar for:
Company: ${companyName}
Products/Services: ${products.join(", ")}
Campaign Theme: ${campaign || "General brand awareness"}
Target Market: East Africa construction industry

Return array of SocialCalendar objects. Each week has: weekStart (ISO date), theme, posts array (platform: facebook/instagram/linkedin, type: product/educational/promotional/company, title, content, hashtags, scheduledDate, status: "draft")`)
    if (result?.length) return result
  }
  return generateFallbackCalendar(companyName, products, weeks)
}

const SOCIAL_SYSTEM = "You are a Zanzibaba social media manager. Create engaging construction industry content for East African markets."
