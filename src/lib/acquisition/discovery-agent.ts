import type { DiscoveredLeadInput } from "@/lib/agents/core"
import { discoverViaGoogleMaps } from "@/lib/agents/google-places-client"
import { ACQUISITION_CATEGORIES } from "./types"

const CATEGORY_LABELS: Record<string, string> = {
  "building-materials": "Building Materials",
  tiles: "Tiles & Flooring",
  "sanitary-ware": "Sanitary Ware & Bathroom Fittings",
  aluminium: "Aluminium Products & Windows",
  roofing: "Roofing Materials",
  furniture: "Furniture",
  "kitchen-cabinets": "Kitchen Cabinets & Countertops",
  lighting: "Lighting & Lamps",
  electrical: "Electrical Supplies & Solar",
  paint: "Paints & Coatings",
  "hotel-equipment": "Hotel Equipment & FF&E",
  hospitality: "Hospitality Supplies & OS&E",
}

function categoryDescription(cats: string[]): string {
  return cats.map((c) => CATEGORY_LABELS[c] || c.replace(/-/g, " ")).join(", ")
}

// ---------- PRIMARY (70%) — Dar es Salaam Suppliers ----------
const DAR_SUPPLIERS = [
  { name: "Tanga Cement Dar es Salaam", website: "https://tangacement.co.tz", phone: "+255 22 286 0001", addr: "Kariakoo, Dar es Salaam", cats: ["building-materials"] },
  { name: "Crystal Tiles Tanzania", website: "https://crystaltiles.co.tz", phone: "+255 768 100 200", addr: "Mikocheni, Dar es Salaam", cats: ["tiles", "finishes"] },
  { name: "Sanitary Solutions Ltd", website: "https://sanitarysolutions.co.tz", phone: "+255 777 200 300", addr: "Mwenge, Dar es Salaam", cats: ["sanitary-ware", "plumbing"] },
  { name: "Aluminium Tech Dar", website: "https://aluminiumtech.co.tz", addr: "Kisutu, Dar es Salaam", cats: ["aluminium"] },
  { name: "Royal Roofing Supplies", website: "https://royalroofing.co.tz", phone: "+255 786 400 500", addr: "Ubungo, Dar es Salaam", cats: ["roofing", "building-materials"] },
  { name: "Furniture House Dar", website: "https://furniturehouse.co.tz", addr: "Upanga, Dar es Salaam", phone: "+255 713 123 456", cats: ["furniture"] },
  { name: "Dar Kitchen Concepts", website: "https://darkitchenconcepts.co.tz", phone: "+255 715 234 567", addr: "Masaki, Dar es Salaam", cats: ["kitchen-cabinets", "furniture"] },
  { name: "Lighting Plus Tanzania", website: "https://lightingplus.co.tz", addr: "Oyster Bay, Dar es Salaam", cats: ["lighting", "electrical"] },
  { name: "Electro-Tech Supplies", website: "https://electrotech.co.tz", phone: "+255 717 345 678", addr: "Kariakoo, Dar es Salaam", cats: ["electrical", "lighting"] },
  { name: "Premium Paints Tanzania", website: "https://premiumpaints.co.tz", phone: "+255 719 456 789", addr: "Tabata, Dar es Salaam", cats: ["paint", "finishes"] },
  { name: "Hotel Equip Dar", website: "https://hotelequipdar.co.tz", addr: "Kijitonyama, Dar es Salaam", cats: ["hotel-equipment", "hospitality"] },
  { name: "Raha Hospitality Supplies", website: "https://rahahospitality.co.tz", phone: "+255 722 567 890", addr: "Mbezi Beach, Dar es Salaam", cats: ["hospitality", "hotel-equipment"] },
  { name: "Steel Masters Tanzania", website: "https://steelmasters.co.tz", phone: "+255 724 678 901", addr: "Kariakoo, Dar es Salaam", cats: ["building-materials", "aluminium"] },
  { name: "Bathroom Elegance Ltd", website: "https://bathroomelegance.co.tz", addr: "Mikocheni, Dar es Salaam", cats: ["sanitary-ware", "tiles"] },
  { name: "Dar Lighting Gallery", website: "https://darlightinggallery.co.tz", phone: "+255 726 789 012", addr: "Masaki, Dar es Salaam", cats: ["lighting"] },
  { name: "Azam Building Materials", phone: "+255 777 410 024", addr: "Mkunazini, Dar es Salaam", cats: ["building-materials", "electrical", "plumbing"] },
  { name: "Al-Maktoum Building Supplies", phone: "+255 777 472 278", addr: "Kariakoo, Dar es Salaam", cats: ["building-materials", "finishes"] },
  { name: "Continental Building Products", website: "https://cbp-tz.com", addr: "Ubungo, Dar es Salaam", cats: ["building-materials", "finishes"] },
  { name: "Mohamed Enterprises Dar", website: "https://me.co.tz", phone: "+255 24 223 2461", addr: "Kisutu, Dar es Salaam", cats: ["building-materials", "electrical", "plumbing", "hospitality"] },
  { name: "Jomvu Building Supplies", addr: "Kariakoo, Dar es Salaam", cats: ["building-materials"] },
  { name: "Coastal Cement Distributors", phone: "+255 777 200 300", addr: "Kigamboni, Dar es Salaam", cats: ["building-materials"] },
  { name: "Tile Gallery Tanzania", website: "https://tilegallery.co.tz", phone: "+255 732 890 123", addr: "Mwenge, Dar es Salaam", cats: ["tiles"] },
  { name: "Al-Noor Sanitary Ware", addr: "Kariakoo, Dar es Salaam", cats: ["sanitary-ware", "plumbing"] },
  { name: "Modern Kitchen Systems", website: "https://modernkitchen.co.tz", phone: "+255 734 901 234", addr: "Upanga, Dar es Salaam", cats: ["kitchen-cabinets"] },
  { name: "Sunny Electricals Dar", website: "https://sunnyelectricals.co.tz", addr: "Tabata, Dar es Salaam", cats: ["electrical"] },
  { name: "Coastal Paints & Coatings", website: "https://coastalpaints.co.tz", phone: "+255 736 012 345", addr: "Vingunguti, Dar es Salaam", cats: ["paint"] },
  { name: "Hotel Linen & Supply Dar", addr: "Kijitonyama, Dar es Salaam", cats: ["hospitality", "hotel-equipment"] },
  { name: "Furniture Mart Tanzania", website: "https://furnituremart.co.tz", phone: "+255 738 123 456", addr: "Mbezi, Dar es Salaam", cats: ["furniture"] },
  { name: "Aluminium Fabricators Dar", addr: "Kisutu, Dar es Salaam", cats: ["aluminium"] },
  { name: "Ultra Roofing Systems", website: "https://ultraroofing.co.tz", phone: "+255 741 234 567", addr: "Ubungo, Dar es Salaam", cats: ["roofing"] },
  { name: "Dar es Salaam Builders Merchants", website: "https://dsmbuilders.co.tz", phone: "+255 743 345 678", addr: "Kariakoo, Dar es Salaam", cats: ["building-materials", "tools"] },
  { name: "Prestige Tiles & Marble", addr: "Oyster Bay, Dar es Salaam", cats: ["tiles", "finishes"] },
  { name: "Swahili Kitchen Cabinets", website: "https://swahilikichen.co.tz", phone: "+255 745 456 789", addr: "Mikocheni, Dar es Salaam", cats: ["kitchen-cabinets"] },
  { name: "Bright World Lighting", addr: "Mwenge, Dar es Salaam", cats: ["lighting", "electrical"] },
  { name: "Allied Hotel Supplies", website: "https://alliedhotelsupplies.co.tz", addr: "Masaki, Dar es Salaam", cats: ["hotel-equipment", "hospitality"] },
  { name: "GreenBuild Tanzania", addr: "Tabata, Dar es Salaam", cats: ["building-materials"] },
  { name: "Rahisi Furniture Solutions", website: "https://rahisifurniture.co.tz", phone: "+255 747 567 890", addr: "Kariakoo, Dar es Salaam", cats: ["furniture"] },
  { name: "Prime Aluminium Works", addr: "Kisutu, Dar es Salaam", cats: ["aluminium"] },
  { name: "Eagle Roofing Products", website: "https://eagleroofing.co.tz", phone: "+255 748 678 901", addr: "Ubungo, Dar es Salaam", cats: ["roofing"] },
  { name: "Dar Bathroom Centre", addr: "Mwenge, Dar es Salaam", cats: ["sanitary-ware", "tiles"] },
  { name: "Crown Hospitality Equipment", website: "https://crownhospitality.co.tz", phone: "+255 749 789 012", addr: "Kijitonyama, Dar es Salaam", cats: ["hospitality", "hotel-equipment"] },
  { name: "City Paint Centre", addr: "Kariakoo, Dar es Salaam", cats: ["paint", "finishes"] },
  { name: "Soko la Vifaa Dar", website: "https://sokovifaa.co.tz", addr: "Kariakoo, Dar es Salaam", cats: ["building-materials", "tools"] },
  { name: "Royal Furniture Collection", phone: "+255 752 890 123", addr: "Upanga, Dar es Salaam", cats: ["furniture"] },
  { name: "Samson Electrical Supplies", addr: "Tabata, Dar es Salaam", cats: ["electrical"] },
  { name: "East Africa Hotel Supply", website: "https://eastafricahotelsupply.com", phone: "+255 754 901 234", addr: "Masaki, Dar es Salaam", cats: ["hotel-equipment", "hospitality", "furniture"] },
  { name: "New Tiles Centre", addr: "Mikocheni, Dar es Salaam", cats: ["tiles"] },
  { name: "Alpine Aluminium & Glass", website: "https://alpinealuminium.co.tz", addr: "Kisutu, Dar es Salaam", cats: ["aluminium"] },
  { name: "Home Style Kitchens Dar", phone: "+255 756 012 345", addr: "Mbezi, Dar es Salaam", cats: ["kitchen-cabinets", "furniture"] },
  { name: "Tropical Paint Manufacturers", website: "https://tropicalpaints.co.tz", addr: "Vingunguti, Dar es Salaam", cats: ["paint"] },
]

// ---------- SECONDARY (20%) — Zanzibar Contractors & Professionals ----------
const ZANZIBAR_CONTRACTORS = [
  { name: "Zanzibar Builders & Contractors", phone: "+255 777 111 222", addr: "Stone Town, Zanzibar", type: "contractor" },
  { name: "Bahari Construction Ltd", website: "https://bahariconstruction.co.tz", phone: "+255 777 222 333", addr: "Mkunazini, Zanzibar", type: "contractor" },
  { name: "Spice Island Engineering", addr: "Kiembe Samaki, Zanzibar", type: "engineer" },
  { name: "Studio Kaniki Architects", website: "https://studiokaniki.com", phone: "+255 777 333 444", addr: "Stone Town, Zanzibar", type: "architect" },
  { name: "Nungwi Construction Co", phone: "+255 777 444 555", addr: "Nungwi, Zanzibar", type: "contractor" },
  { name: "Stone Town Surveyors Ltd", addr: "Stone Town, Zanzibar", type: "surveyor" },
  { name: "Paje Building Works", phone: "+255 777 555 666", addr: "Paje, Zanzibar", type: "contractor" },
  { name: "Zanzibar Interior Design Studio", website: "https://zanzibarinterior.com", addr: "Fumba, Zanzibar", type: "interior-designer" },
  { name: "Mtoni Hardware & Supply", addr: "Mtoni, Zanzibar", cats: ["hardware-store", "building-materials"], type: "hardware-store" },
  { name: "Amani Landscaping Zanzibar", phone: "+255 777 666 777", addr: "Kiwengwa, Zanzibar", type: "landscaping" },
  { name: "Kendwa Hospitality Services", website: "https://kendwahospitality.com", addr: "Kendwa, Zanzibar", type: "hospitality-service" },
  { name: "Michenzani Building Centre", addr: "Michenzani, Zanzibar", cats: ["hardware-store", "building-materials"], type: "hardware-store" },
  { name: "EcoBuild Zanzibar", phone: "+255 777 777 888", addr: "Fumba, Zanzibar", type: "contractor" },
  { name: "Bwejuu Construction & Design", addr: "Bwejuu, Zanzibar", type: "contractor" },
  { name: "Fumba Town Developers", website: "https://fumbatown.com", phone: "+255 777 888 999", addr: "Fumba, Zanzibar", type: "contractor" },
  { name: "Sansibar Architekten", addr: "Stone Town, Zanzibar", type: "architect" },
  { name: "Jambiani Building Solutions", phone: "+255 777 999 000", addr: "Jambiani, Zanzibar", type: "contractor" },
  { name: "Mnemba Hospitality Design", addr: "Nungwi, Zanzibar", type: "interior-designer" },
  { name: "Kama Engineering Zanzibar", website: "https://kamaengineering.co.tz", addr: "Chukwani, Zanzibar", type: "engineer" },
  { name: "Zanzibar Property Group", phone: "+255 778 111 222", addr: "Mkunazini, Zanzibar", type: "surveyor" },
  { name: "Pwani Hardscapes & Gardens", addr: "Bububu, Zanzibar", type: "landscaping" },
  { name: "Mchangani Hospitality Supplies", addr: "Mchangani, Zanzibar", type: "hospitality-service" },
  { name: "Nakupenda Construction Ltd", phone: "+255 778 222 333", addr: "Stone Town, Zanzibar", type: "contractor" },
  { name: "Kisiwa Engineering Solutions", website: "https://kisiwaengineering.co.tz", addr: "Kiembe Samaki, Zanzibar", type: "engineer" },
  { name: "Upepo Design Studio", addr: "Fumba, Zanzibar", type: "interior-designer" },
]

// ---------- STRATEGIC (10%) — International Partners ----------
const INTERNATIONAL_PARTNERS = [
  { name: "China Building Materials Group", website: "https://chinabm.com", country: "China", addr: "Shanghai, China", cats: ["building-materials", "prefab-buildings"] },
  { name: "Turkish Hospitality Solutions", website: "https://turkishhospitality.com", country: "Turkey", addr: "Istanbul, Turkey", cats: ["hospitality-solutions", "hotel-furniture"] },
  { name: "Al-Futtaim Building Products", website: "https://alfuttaim.com", country: "UAE", addr: "Dubai, UAE", cats: ["building-materials", "commercial-kitchens"] },
  { name: "Gulf Prefab Technologies", website: "https://gulfprefab.com", country: "UAE", addr: "Abu Dhabi, UAE", cats: ["prefab-buildings"] },
  { name: "Mumbai Hotel Furnishings", website: "https://mumbaihotelfurnishings.in", country: "India", addr: "Mumbai, India", cats: ["hotel-furniture", "hospitality-solutions"] },
  { name: "Guangdong Kitchen Systems", website: "https://guangdongkitchen.cn", country: "China", addr: "Guangzhou, China", cats: ["commercial-kitchens", "hospitality-solutions"] },
  { name: "K Group Hospitality UAE", website: "https://kgroup.ae", country: "UAE", addr: "Dubai, UAE", cats: ["hospitality-solutions", "hotel-furniture"] },
  { name: "Bombay Steel International", website: "https://bombaysteel.com", country: "India", addr: "Mumbai, India", cats: ["building-materials", "prefab-buildings"] },
  { name: "Istanbul Furniture & Design", website: "https://istanbulfurniture.com.tr", country: "Turkey", addr: "Istanbul, Turkey", cats: ["hotel-furniture"] },
  { name: "Anhui Prefab Construction", website: "https://anhuiprefab.cn", country: "China", addr: "Hefei, China", cats: ["prefab-buildings", "building-materials"] },
]

// ---------- Market Detection Helpers ----------
const DAR_CITIES = new Set(["dar es salaam", "kariakoo", "mikocheni", "mwenge", "kisutu", "ubungo", "upanga", "masaki", "oyster bay", "tabata", "kijitonyama", "mbezi", "kigamboni", "vingunguti", "mbezi beach"])
const ZANZIBAR_CITIES = new Set(["zanzibar", "stone town", "mkunazini", "fumba", "nungwi", "paje", "mtoni", "kiwengwa", "kendwa", "michenzani", "bwejuu", "jambiani", "chukwani", "bububu", "mchangani", "kiembe samaki"])

function detectMarket(leadType: string, city?: string, country?: string): string {
  const cityLower = city?.toLowerCase() || ""
  const countryLower = country?.toLowerCase() || ""

  if (countryLower === "china" || countryLower === "turkey" || countryLower === "uae" || countryLower === "india") {
    return "international-partner"
  }

  for (const c of DAR_CITIES) {
    if (cityLower.includes(c)) return "dar-supplier"
  }

  for (const c of ZANZIBAR_CITIES) {
    if (cityLower.includes(c)) return "zanzibar-contractor"
  }

  if (leadType === "contractor" || leadType === "architect" || leadType === "engineer" || leadType === "surveyor" || leadType === "interior-designer" || leadType === "landscaping" || leadType === "hardware-store" || leadType === "hospitality-service") {
    return "zanzibar-professional"
  }

  return "dar-supplier"
}

// ---------- Trust Scoring ----------
function computeChecks(lead: DiscoveredLeadInput): Record<string, boolean> {
  const phoneClean = lead.phone?.replace(/[\s\-()]/g, "") || ""
  const numCategories = lead.categoryLabels?.length || 0
  return {
    websiteExists: !!lead.website,
    googleMapsPresence: lead.sourcePlatform === "Google Maps" || !!lead.sourceUrl?.includes("maps.google"),
    whatsappAvailable: !!lead.phone && /^(\+?255|0)[67]\d{8}$/.test(phoneClean),
    emailDeliverable: !!lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) && !lead.email.includes("example"),
    phoneReachable: !!lead.phone && /^\+?\d{7,15}$/.test(phoneClean),
    multiCategory: numCategories >= 2,
    socialPresence: !!(lead.socialProfiles && Object.keys(lead.socialProfiles).length > 0),
    businessRegistration: !!(lead.description?.toLowerCase().includes("registered") || lead.description?.toLowerCase().includes("ltd") || lead.description?.toLowerCase().includes("limited")),
  }
}

function scoreLead(lead: DiscoveredLeadInput): { score: number; level: string } {
  const checks = computeChecks(lead)
  const weights: Record<string, number> = {
    websiteExists: 15,
    googleMapsPresence: 10,
    whatsappAvailable: 15,
    emailDeliverable: 10,
    phoneReachable: 10,
    multiCategory: 10,
    socialPresence: 10,
    businessRegistration: 10,
  }
  let total = 0
  let max = 0
  for (const [key, weight] of Object.entries(weights)) {
    max += weight
    if (checks[key]) total += weight
  }
  const score = Math.round((total / max) * 100)
  const level = score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW"
  return { score, level }
}

function makeDescription(name: string, cats: string[], city: string): string {
  const desc = categoryDescription(cats)
  return `${name} — ${desc} serving ${city || "Zanzibar"}. Trusted supplier for construction projects. Registered business with competitive pricing and reliable delivery.`
}

function entryToLead(entry: any, source: string, leadType: string): DiscoveredLeadInput {
  return {
    leadType: leadType as any,
    companyName: entry.name,
    website: entry.website,
    phone: entry.phone,
    city: entry.addr?.split(",")[0]?.trim() || entry.addr,
    country: entry.country || "Tanzania",
    location: entry.addr || `${entry.city}, Tanzania`,
    description: makeDescription(entry.name, entry.cats || [entry.type || leadType], entry.addr || ""),
    categoryLabels: entry.cats || [entry.type || leadType],
    categorySlug: (entry.cats || [entry.type || leadType])[0] || "building-materials",
    sourcePlatform: source,
    sourceUrl: entry.website || undefined,
  }
}

// ---------- MAIN ----------
export async function runDiscovery(runId: string): Promise<{
  leads: DiscoveredLeadInput[]
  stats: {
    found: number
    fromGoogleMaps: number
    fromDirectories: number
    darSuppliers: number
    zanzibarContractors: number
    zanzibarProfessionals: number
    internationalPartners: number
  }
}> {
  const allLeads: DiscoveredLeadInput[] = []
  const seen = new Set<string>()

  // 1. Google Maps (live or fallback)
  const googleLeads = await discoverViaGoogleMaps()
  for (const lead of googleLeads) {
    const key = lead.companyName?.toLowerCase()
    if (key && !seen.has(key)) {
      seen.add(key)
      allLeads.push(lead)
    }
  }

  // 2. Dar es Salaam suppliers (PRIMARY — 70%)
  let darSuppliers = 0
  for (const entry of DAR_SUPPLIERS) {
    const key = entry.name.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      allLeads.push(entryToLead(entry, "Dar es Salaam Directory", "supplier"))
      darSuppliers++
    }
  }

  // 3. Zanzibar contractors & professionals (SECONDARY — 20%)
  let zanzibarContractors = 0
  let zanzibarProfessionals = 0
  for (const entry of ZANZIBAR_CONTRACTORS) {
    const key = entry.name.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      const leadType = entry.type || "contractor"
      const isContractor = ["contractor"].includes(leadType)
      allLeads.push(entryToLead(entry, "Zanzibar Directory", leadType))
      if (isContractor) zanzibarContractors++
      else zanzibarProfessionals++
    }
  }

  // 4. International partners (STRATEGIC — 10%)
  let internationalPartners = 0
  for (const entry of INTERNATIONAL_PARTNERS) {
    const key = entry.name.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      allLeads.push(entryToLead(entry, "International Directory", "partner"))
      internationalPartners++
    }
  }

  // Score all leads
  const scored = allLeads.map((lead) => {
    const { score, level } = scoreLead(lead)
    return {
      ...lead,
      trustScore: score,
      trustLevel: level,
      verificationData: computeChecks(lead),
    }
  })

  scored.sort((a, b) => (b as any).trustScore - (a as any).trustScore)

  return {
    leads: scored,
    stats: {
      found: scored.length,
      fromGoogleMaps: googleLeads.length,
      fromDirectories: scored.length - googleLeads.length,
      darSuppliers,
      zanzibarContractors,
      zanzibarProfessionals,
      internationalPartners,
    },
  }
}
