import type { SocialLead, SourceAttribution } from "../types"
import { isApifyEnabled, runApifyActor } from "../apify-client"

const FACEBOOK_ACTOR = "apify~facebook-pages-scraper"

function buildFacebookAttribution(pageName: string): SourceAttribution {
  return {
    source: "Facebook",
    foundAt: new Date().toISOString(),
    profileUrl: `https://facebook.com/${pageName}`,
  }
}

interface FacebookProfile {
  companyName: string
  category: string
  pageName: string
  city: string
  knownLikes: number
  knownWebsite?: string
  knownPhone?: string
}

const CURATED_PAGES: FacebookProfile[] = [
  { companyName: "Crystal Tiles Tanzania", category: "tiles", pageName: "CrystalTilesTZ", city: "Dar es Salaam", knownLikes: 3400 },
  { companyName: "Premium Paints Tanzania", category: "paint", pageName: "PremiumPaintsTZ", city: "Dar es Salaam", knownLikes: 2100 },
  { companyName: "East Africa Hotel Supply", category: "hospitality", pageName: "EastAfricaHotelSupply", city: "Dar es Salaam", knownLikes: 5600 },
  { companyName: "Raha Hospitality Supplies", category: "hospitality", pageName: "RahaHospitality", city: "Dar es Salaam", knownLikes: 1800 },
  { companyName: "Furniture Mart Tanzania", category: "furniture", pageName: "FurnitureMartTZ", city: "Dar es Salaam", knownLikes: 8900 },
  { companyName: "Modern Kitchen Systems", category: "kitchen", pageName: "ModernKitchenSystems", city: "Dar es Salaam", knownLikes: 1200 },
  { companyName: "Dar Kitchen Concepts", category: "kitchen", pageName: "DarKitchenConcepts", city: "Dar es Salaam", knownLikes: 2800 },
  { companyName: "Zanzibar Furniture Gallery", category: "furniture", pageName: "ZanzibarFurniture", city: "Zanzibar", knownLikes: 6700 },
  { companyName: "Spice Island Interiors", category: "furniture", pageName: "SpiceIslandInteriors", city: "Zanzibar", knownLikes: 4500 },
  { companyName: "Stone Town Design Studio", category: "hospitality", pageName: "StoneTownDesign", city: "Zanzibar", knownLikes: 3200 },
  { companyName: "Royal Roofing Supplies", category: "roofing", pageName: "RoyalRoofingTZ", city: "Dar es Salaam", knownLikes: 890 },
  { companyName: "Swahili Kitchen Cabinets", category: "kitchen", pageName: "SwahiliKitchen", city: "Dar es Salaam", knownLikes: 2300 },
  { companyName: "Tile Gallery Tanzania", category: "tiles", pageName: "TileGalleryTZ", city: "Dar es Salaam", knownLikes: 5100 },
  { companyName: "Steel Masters Tanzania", category: "building-materials", pageName: "SteelMastersTZ", city: "Dar es Salaam", knownLikes: 1400 },
  { companyName: "Electro-Tech Supplies", category: "electrical", pageName: "ElectroTechTZ", city: "Dar es Salaam", knownLikes: 950 },
  { companyName: "Dar Lighting Gallery", category: "lighting", pageName: "DarLightingTZ", city: "Dar es Salaam", knownLikes: 1800 },
  { companyName: "Coastal Paints & Coatings", category: "paint", pageName: "CoastalPaintsTZ", city: "Dar es Salaam", knownLikes: 1200 },
  { companyName: "Dar es Salaam Builders Merchants", category: "building-materials", pageName: "DSMBuilders", city: "Dar es Salaam", knownLikes: 3400 },
  { companyName: "Crown Hospitality Equipment", category: "hospitality", pageName: "CrownHospitalityTZ", city: "Dar es Salaam", knownLikes: 2100 },
  { companyName: "Rahisi Furniture Solutions", category: "furniture", pageName: "RahisiFurniture", city: "Dar es Salaam", knownLikes: 2800 },
]

export async function discoverFacebook(): Promise<SocialLead[]> {
  let liveEnrichment: Map<string, { likes: number; phone?: string; website?: string }> = new Map()

  if (isApifyEnabled()) {
    const pageUrls = CURATED_PAGES.map((p) => `https://facebook.com/${p.pageName}`)
    const batchSize = 5
    for (let i = 0; i < pageUrls.length; i += batchSize) {
      const batch = pageUrls.slice(i, i + batchSize)
      try {
        const results: any[] = await runApifyActor(FACEBOOK_ACTOR, {
          startUrls: batch.map((u) => ({ url: u })),
          resultsLimit: batch.length,
        })
        for (const r of results) {
          const pageName = r.pageUrl?.split("/").pop() || ""
          if (pageName) {
            liveEnrichment.set(pageName, {
              likes: r.likes || r.followers || 0,
              phone: r.phone || undefined,
              website: r.website || undefined,
            })
          }
        }
      } catch {
        continue
      }
    }
  }

  const leads: SocialLead[] = []
  for (const profile of CURATED_PAGES) {
    const live = liveEnrichment.get(profile.pageName)
    leads.push({
      companyName: profile.companyName,
      category: profile.category,
      city: profile.city,
      country: "Tanzania",
      facebookUrl: `https://facebook.com/${profile.pageName}`,
      phone: live?.phone || profile.knownPhone,
      website: live?.website || profile.knownWebsite,
      followers: live?.likes ?? profile.knownLikes,
      sourceAttributions: [buildFacebookAttribution(profile.pageName)],
      trustScore: 0,
    })
  }
  return leads
}
