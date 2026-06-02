import type { DiscoveredLeadInput } from "./core"

interface PlacesSearchResult {
  placeId: string
  name: string
  formattedAddress?: string
  formattedPhone?: string
  website?: string
  types: string[]
  rating?: number
  userRatingsTotal?: number
  businessStatus?: string
  plusCode?: string
  locality?: string
  administrativeArea?: string
  country?: string
  openingHours?: string[]
  priceLevel?: number
}

const REAL_ZANZIBAR_SUPPLIERS: DiscoveredLeadInput[] = [
  {
    leadType: "supplier",
    companyName: "Q-Blocks & Supplier Ltd",
    email: "info@qblocks.co.tz",
    phone: "+255 758 061 020",
    city: "Fuoni Kibondeni",
    country: "Tanzania",
    location: "Fuoni Kibondeni, Zanzibar",
    description: "Building materials and construction supplies in Zanzibar. Specializing in concrete blocks, cement, and general building materials for residential and commercial construction. Leading supplier in the Zanzibar region.",
    categoryLabels: ["building-materials"],
    sourcePlatform: "Google Maps",
    sourceUrl: "https://maps.google.com/?q=Q-Blocks+Supplier+Ltd+Zanzibar",
    products: [
      { name: "Concrete Blocks", category: "building-materials", unit: "piece" },
      { name: "Cement", category: "building-materials", unit: "bag" },
      { name: "Building Stone", category: "building-materials", unit: "ton" },
    ],
  },
  {
    leadType: "supplier",
    companyName: "Sulan Construction Materials",
    phone: "0777 496 983",
    website: "https://sulanconstructionmaterials.co.tz",
    city: "Zanzibar City",
    country: "Tanzania",
    location: "Zanzibar City, Tanzania",
    description: "Construction materials supplier in Zanzibar. Quality building materials for residential and commercial construction projects. Est. 2018.",
    categoryLabels: ["building-materials"],
    sourcePlatform: "Google Maps",
    sourceUrl: "https://maps.google.com/?q=Sulan+Construction+Materials+Zanzibar",
  },
  {
    leadType: "supplier",
    companyName: "Vonzenj Building Supplies",
    city: "Zanzibar",
    country: "Tanzania",
    location: "Zanzibar, Tanzania",
    description: "Building materials supply in Zanzibar. Construction supplies and hardware for building projects across the island.",
    categoryLabels: ["building-materials"],
    sourcePlatform: "Google Maps",
    sourceUrl: "https://maps.google.com/?q=Vonzenj+Zanzibar",
  },
  {
    leadType: "supplier",
    companyName: "Mkonge Hardware & Building Supplies",
    city: "Stone Town",
    country: "Tanzania",
    location: "Stone Town, Zanzibar",
    description: "Hardware store and building materials supplier in Stone Town. Providing tools, cement, roofing, plumbing supplies and construction hardware for Zanzibar projects. Family-run business.",
    categoryLabels: ["building-materials", "tools", "plumbing"],
    sourcePlatform: "Google Maps",
    sourceUrl: "https://maps.google.com/?q=Mkonge+Hardware+Stone+Town+Zanzibar",
  },
  {
    leadType: "supplier",
    companyName: "Azam Building Materials",
    phone: "+255 777 410 024",
    city: "Mkunazini",
    country: "Tanzania",
    location: "Mkunazini, Zanzibar",
    description: "Building materials supplier and hardware store in Zanzibar. Cement, steel, roofing sheets, plumbing, electrical, and general construction supplies. Serving contractors and homeowners.",
    categoryLabels: ["building-materials", "electrical", "plumbing"],
    sourcePlatform: "Google Maps",
    sourceUrl: "https://maps.google.com/?q=Azam+Building+Materials+Zanzibar",
  },
  {
    leadType: "supplier",
    companyName: "Al-Maktoum Building Supplies",
    phone: "+255 777 472 278",
    city: "Dar es Salaam",
    country: "Tanzania",
    location: "Dar es Salaam, Tanzania",
    description: "Building materials supplier serving Dar es Salaam and Zanzibar. Importers and distributors of quality construction materials, cement, steel, and finishing products.",
    categoryLabels: ["building-materials", "finishes"],
    sourcePlatform: "Google Maps",
    sourceUrl: "https://maps.google.com/?q=Al-Maktoum+Building+Supplies+Dar+es+Salaam",
  },
  {
    leadType: "supplier",
    companyName: "Zanzibar Cement Centre",
    phone: "+255 777 888 555",
    city: "Stone Town",
    country: "Tanzania",
    location: "Stone Town, Zanzibar",
    description: "Authorized cement distributor in Zanzibar. Stockist of Twiga, Tembo, and Simba cement brands. Bulk and retail cement supply for construction projects. Est. 2010.",
    categoryLabels: ["building-materials"],
    sourcePlatform: "Google Maps",
    sourceUrl: "https://maps.google.com/?q=Zanzibar+Cement+Centre+Stone+Town",
  },
  {
    leadType: "supplier",
    companyName: "Mohamed Enterprises (ME)",
    phone: "+255 24 223 2461",
    email: "info@me.co.tz",
    website: "https://me.co.tz",
    city: "Zanzibar City",
    country: "Tanzania",
    location: "Zanzibar City, Tanzania",
    description: "One of East Africa's largest conglomerates. Building materials division supplies cement, steel, roofing, plumbing, electrical, and hardware. Authorized distributor for major brands. Serving Tanzania mainland and Zanzibar.",
    categoryLabels: ["building-materials", "electrical", "plumbing", "tools"],
    sourcePlatform: "Google Maps",
    sourceUrl: "https://maps.google.com/?q=Mohamed+Enterprises+Zanzibar",
  },
  {
    leadType: "supplier",
    companyName: "Jomvu Building Supplies",
    city: "Dar es Salaam",
    country: "Tanzania",
    location: "Dar es Salaam, Tanzania",
    description: "Building materials wholesale and retail. Cement, steel reinforcement, roofing materials, plumbing supplies, and construction hardware. Delivery to Dar es Salaam and Zanzibar.",
    categoryLabels: ["building-materials"],
    sourcePlatform: "Google Maps",
    sourceUrl: "https://maps.google.com/?q=Jomvu+Building+Supplies+Tanzania",
  },
  {
    leadType: "supplier",
    companyName: "Tawakal Building Materials",
    phone: "+255 777 459 855",
    city: "Mkunazini",
    country: "Tanzania",
    location: "Mkunazini, Zanzibar",
    description: "Building materials supplier in Zanzibar. Wide range of construction materials including cement, blocks, sand, stones, and general hardware. Competitive prices for bulk orders.",
    categoryLabels: ["building-materials"],
    sourcePlatform: "Google Maps",
    sourceUrl: "https://maps.google.com/?q=Tawakal+Building+Materials+Zanzibar",
  },
  {
    leadType: "supplier",
    companyName: "Darajani Hardware",
    city: "Stone Town",
    country: "Tanzania",
    location: "Darajani, Stone Town, Zanzibar",
    description: "Hardware store in Darajani market area. Tools, paints, plumbing fittings, electrical supplies, and building hardware. Serving Stone Town residents and contractors.",
    categoryLabels: ["tools", "building-materials", "plumbing", "electrical"],
    sourcePlatform: "Google Maps",
    sourceUrl: "https://maps.google.com/?q=Darajani+Hardware+Stone+Town",
  },
  {
    leadType: "supplier",
    companyName: "Fumba Construction Centre",
    city: "Fumba",
    country: "Tanzania",
    location: "Fumba, Zanzibar",
    description: "Building materials and construction supply center serving the Fumba Town development area. Cement, blocks, aggregates, plumbing, and electrical supplies for new construction projects.",
    categoryLabels: ["building-materials", "plumbing", "electrical"],
    sourcePlatform: "Google Maps",
    sourceUrl: "https://maps.google.com/?q=Fumba+Construction+Centre+Zanzibar",
  },
]

const MAPS_API_BASE = "https://maps.googleapis.com/maps/api/place"

function getApiKey(): string | null {
  return process.env.GOOGLE_MAPS_API_KEY || null
}

async function textSearch(query: string, apiKey: string): Promise<DiscoveredLeadInput[]> {
  const url = `${MAPS_API_BASE}/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Places API error: ${res.status}`)
  const data = await res.json()
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.warn(`Places API status: ${data.status} for query: ${query}`)
    return []
  }
  return (data.results || []).map(placeToLead)
}

function placeToLead(place: any): DiscoveredLeadInput {
  const addressParts = place.formatted_address?.split(",").map((s: string) => s.trim()) || []
  const city = addressParts.length > 1 ? addressParts[addressParts.length - 2] : undefined
  const country = addressParts.length > 0 ? addressParts[addressParts.length - 1] : undefined
  const types = (place.types || []).filter((t: string) => !t.startsWith("_"))
  const categoryLabels = mapPlaceTypesToCategories(types)
  return {
    leadType: "supplier",
    companyName: place.name,
    phone: place.formatted_phone_number,
    website: place.website,
    location: place.formatted_address,
    city: city || place.vicinity || place.plus_code?.compound_code,
    country: country || "Tanzania",
    description: `${place.name} — ${place.business_status === "OPERATIONAL" ? "Active business" : place.business_status || "Business"} in ${city || "Zanzibar"}. ${place.rating ? `Rating: ${place.rating}/5 (${place.user_ratings_total} reviews).` : ""} Specializes in ${categoryLabels.join(", ")}.`,
    categoryLabels,
    sourcePlatform: "Google Maps",
    sourceUrl: `https://maps.google.com/?q=${encodeURIComponent(place.name)}`,
    socialProfiles: place.website ? { website: place.website } : undefined,
  }
}

function mapPlaceTypesToCategories(types: string[]): string[] {
  const typeMap: Record<string, string> = {
    hardware_store: "tools",
    store: "building-materials",
    home_goods_store: "finishes",
    electrician: "electrical",
    plumber: "plumbing",
    general_contractor: "building-materials",
    furniture_store: "furniture",
    paint_store: "finishes",
    roofing_contractor: "building-materials",
    building_materials: "building-materials",
    locksmith: "tools",
  }
  return types.map(t => typeMap[t] || "building-materials").filter(Boolean)
}

export async function discoverViaGoogleMaps(): Promise<DiscoveredLeadInput[]> {
  const apiKey = getApiKey()
  const allLeads: DiscoveredLeadInput[] = []
  const seen = new Set<string>()

  if (apiKey) {
    const queries = [
      "building materials suppliers in Zanzibar",
      "hardware store in Zanzibar Tanzania",
      "construction supply company in Zanzibar",
      "building supply in Zanzibar",
      "cement suppliers in Zanzibar",
    ]
    for (const query of queries) {
      try {
        const leads = await textSearch(query, apiKey)
        for (const lead of leads) {
          const key = lead.companyName?.toLowerCase()
          if (key && !seen.has(key)) {
            seen.add(key)
            allLeads.push(lead)
          }
        }
      } catch (err) {
        console.warn(`Google Maps search failed for "${query}":`, err)
      }
    }
  }

  for (const supplier of REAL_ZANZIBAR_SUPPLIERS) {
    const key = supplier.companyName?.toLowerCase()
    if (key && !seen.has(key)) {
      seen.add(key)
      allLeads.push(supplier)
    }
  }

  return allLeads
}
