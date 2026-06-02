import type { SocialLead, SourceAttribution } from "../types"

function buildLinkedInAttribution(url: string): SourceAttribution {
  return { source: "LinkedIn", foundAt: new Date().toISOString(), profileUrl: url }
}

const CURATED_COMPANIES: [string, string, string, string][] = [
  ["Crystal Tiles Tanzania", "tiles", "crystal-tiles-tanzania", "Dar es Salaam"],
  ["Premium Paints Tanzania", "paint", "premium-paints-tanzania", "Dar es Salaam"],
  ["East Africa Hotel Supply", "hospitality", "east-africa-hotel-supply", "Dar es Salaam"],
  ["Raha Hospitality Supplies", "hospitality", "raha-hospitality", "Dar es Salaam"],
  ["Furniture Mart Tanzania", "furniture", "furniture-mart-tanzania", "Dar es Salaam"],
  ["Modern Kitchen Systems", "kitchen", "modern-kitchen-systems", "Dar es Salaam"],
  ["Dar Kitchen Concepts", "kitchen", "dar-kitchen-concepts", "Dar es Salaam"],
  ["Zanzibar Furniture Gallery", "furniture", "zanzibar-furniture-gallery", "Zanzibar"],
  ["Spice Island Interiors", "furniture", "spice-island-interiors", "Zanzibar"],
  ["Stone Town Design Studio", "hospitality", "stone-town-design", "Zanzibar"],
  ["Steel Masters Tanzania", "building-materials", "steel-masters-tanzania", "Dar es Salaam"],
  ["Royal Roofing Supplies", "roofing", "royal-roofing-supplies", "Dar es Salaam"],
  ["Swahili Kitchen Cabinets", "kitchen", "swahili-kitchen-cabinets", "Dar es Salaam"],
  ["Tile Gallery Tanzania", "tiles", "tile-gallery-tanzania", "Dar es Salaam"],
  ["Dar es Salaam Builders Merchants", "building-materials", "dsm-builders-merchants", "Dar es Salaam"],
  ["Electro-Tech Supplies", "electrical", "electro-tech-tanzania", "Dar es Salaam"],
  ["Coastal Paints & Coatings", "paint", "coastal-paints-tanzania", "Dar es Salaam"],
  ["Dar Lighting Gallery", "lighting", "dar-lighting-gallery", "Dar es Salaam"],
  ["Crown Hospitality Equipment", "hospitality", "crown-hospitality-tz", "Dar es Salaam"],
  ["Sanitary Solutions Ltd", "sanitary-ware", "sanitary-solutions-tz", "Dar es Salaam"],
]

export async function discoverLinkedIn(): Promise<SocialLead[]> {
  return CURATED_COMPANIES.map(([name, cat, slug, city]) => ({
    companyName: name,
    category: cat,
    city,
    country: "Tanzania",
    linkedinUrl: `https://linkedin.com/company/${slug}`,
    sourceAttributions: [buildLinkedInAttribution(`https://linkedin.com/company/${slug}`)],
    trustScore: 0,
  }))
}
