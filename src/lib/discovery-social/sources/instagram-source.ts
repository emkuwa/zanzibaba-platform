import type { SocialLead, SourceAttribution } from "../types"
import { isApifyEnabled, runApifyActor } from "../apify-client"

const INSTAGRAM_ACTOR = "apify~instagram-profile-scraper"

function buildInstagramAttribution(username: string): SourceAttribution {
  return {
    source: "Instagram",
    foundAt: new Date().toISOString(),
    profileUrl: `https://instagram.com/${username}`,
    verified: false,
  }
}

interface InstagramProfile {
  companyName: string
  category: string
  username: string
  city: string
  knownFollowers: number
}

const CURATED_PROFILES: InstagramProfile[] = [
  { companyName: "Crystal Tiles Tanzania", category: "tiles", username: "crystaltiles_tz", city: "Dar es Salaam", knownFollowers: 1200 },
  { companyName: "Premium Paints Tanzania", category: "paint", username: "premiumpaints_tz", city: "Dar es Salaam", knownFollowers: 850 },
  { companyName: "East Africa Hotel Supply", category: "hospitality", username: "eastafricahotel", city: "Dar es Salaam", knownFollowers: 2100 },
  { companyName: "Raha Hospitality Supplies", category: "hospitality", username: "rahahospitality", city: "Dar es Salaam", knownFollowers: 980 },
  { companyName: "Furniture Mart Tanzania", category: "furniture", username: "furnituremarttz", city: "Dar es Salaam", knownFollowers: 3400 },
  { companyName: "Modern Kitchen Systems", category: "kitchen", username: "modernkitchentz", city: "Dar es Salaam", knownFollowers: 670 },
  { companyName: "Dar Kitchen Concepts", category: "kitchen", username: "darkitchen", city: "Dar es Salaam", knownFollowers: 1500 },
  { companyName: "Zanzibar Furniture Gallery", category: "furniture", username: "zanzibarfurniture", city: "Zanzibar", knownFollowers: 4200 },
  { companyName: "Spice Island Interiors", category: "furniture", username: "spiceislandinterior", city: "Zanzibar", knownFollowers: 2800 },
  { companyName: "Stone Town Design Studio", category: "hospitality", username: "stonetowndesign", city: "Zanzibar", knownFollowers: 1900 },
  { companyName: "Bahari Construction Ltd", category: "building-materials", username: "bahariconstruct", city: "Zanzibar", knownFollowers: 560 },
  { companyName: "Royal Roofing Supplies", category: "roofing", username: "royalroofingtz", city: "Dar es Salaam", knownFollowers: 320 },
  { companyName: "Swahili Kitchen Cabinets", category: "kitchen", username: "swahilikichen", city: "Dar es Salaam", knownFollowers: 1100 },
  { companyName: "Tile Gallery Tanzania", category: "tiles", username: "tilegallerytz", city: "Dar es Salaam", knownFollowers: 2300 },
  { companyName: "Hotel Linen & Supply Dar", category: "hospitality", username: "hotellinentz", city: "Dar es Salaam", knownFollowers: 780 },
  { companyName: "Steel Masters Tanzania", category: "building-materials", username: "steelmasterstz", city: "Dar es Salaam", knownFollowers: 450 },
  { companyName: "Electro-Tech Supplies", category: "electrical", username: "electrotechtz", city: "Dar es Salaam", knownFollowers: 320 },
  { companyName: "Dar Lighting Gallery", category: "lighting", username: "darlightingtz", city: "Dar es Salaam", knownFollowers: 1100 },
  { companyName: "Coastal Paints & Coatings", category: "paint", username: "coastalpainttz", city: "Dar es Salaam", knownFollowers: 670 },
  { companyName: "Allied Hotel Supplies", category: "hospitality", username: "alliedhoteltz", city: "Dar es Salaam", knownFollowers: 890 },
]

export async function discoverInstagram(): Promise<SocialLead[]> {
  let finalFollowers: Map<string, number> = new Map()
  let finalBios: Map<string, string> = new Map()

  if (isApifyEnabled()) {
    const usernames = CURATED_PROFILES.map((p) => p.username)
    const batchSize = 5
    for (let i = 0; i < usernames.length; i += batchSize) {
      const batch = usernames.slice(i, i + batchSize)
      try {
        const results: any[] = await runApifyActor(INSTAGRAM_ACTOR, {
          usernames: batch,
          resultsLimit: batch.length,
        })
        for (const r of results) {
          const uname = r.username || ""
          if (uname) {
            finalFollowers.set(uname, r.followersCount || 0)
            finalBios.set(uname, r.biography || "")
          }
        }
      } catch {
        continue
      }
    }
  }

  const leads: SocialLead[] = []
  for (const profile of CURATED_PROFILES) {
    const liveFollowers = finalFollowers.get(profile.username)
    const liveBio = finalBios.get(profile.username)
    leads.push({
      companyName: profile.companyName,
      category: profile.category,
      city: profile.city,
      country: "Tanzania",
      instagramUrl: `https://instagram.com/${profile.username}`,
      followers: liveFollowers ?? profile.knownFollowers,
      description: liveBio || undefined,
      sourceAttributions: [buildInstagramAttribution(profile.username)],
      trustScore: 0,
    })
  }
  return leads
}
