import type { DiscoveredLeadInput } from "@/lib/agents/core"
import { generateJSON, isAIEnabled } from "@/lib/ai/provider"

const ENRICHMENT_SYSTEM = `You are a business enrichment assistant for a Zanzibar-focused construction marketplace. Return ONLY valid JSON.`

interface EnrichedData {
  email: string
  socialProfiles: { linkedin?: string; facebook?: string; instagram?: string }
  products: { name: string; description: string; category?: string }[]
  companyDescription: string
  employeeCount: string
  yearEstablished: string
  services?: string[]
  certifications: string[]
  targetMarkets: string[]
  whatsappPhone?: string
}

const PRODUCT_INFERENCE: Record<string, string[]> = {
  "building-materials": ["Cement (Portland & rapid set)", "Steel reinforcement bars", "River sand & aggregates", "Concrete blocks", "Treated timber"],
  tiles: ["Porcelain floor tiles (600x600)", "Ceramic wall tiles", "Marble & granite slabs", "Outdoor patio tiles", "Skirting & trims"],
  "sanitary-ware": ["WC suites & bidets", "Washbasins & vanities", "Shower enclosures & trays", "Bathroom faucets & mixers", "Water heaters"],
  aluminium: ["Aluminium window frames", "Sliding glass doors", "Aluminium composite panels", "Shopfront systems", "Aluminium louvres"],
  roofing: ["Corrugated iron sheets (G26)", "Clay roofing tiles", "Guttering & downpipes", "Roof insulation boards", "Skylights & roof vents"],
  furniture: ["Sofas & lounge seating", "Dining tables & chairs", "Bedroom sets", "Office desks & chairs", "Outdoor furniture"],
  "kitchen-cabinets": ["Kitchen cabinet units", "Quartz & granite countertops", "Kitchen sinks & faucets", "Cooker hoods", "Kitchen storage systems"],
  lighting: ["LED panel lights", "Chandeliers & pendants", "Wall sconces", "Outdoor floodlights", "Track lighting systems"],
  electrical: ["Electrical cables & wires", "Circuit breakers & DB boxes", "Solar panels & inverters", "Switches & sockets", "Security cameras"],
  paint: ["Interior emulsion paints", "Exterior weatherproof paint", "Wood varnishes & stains", "Primers & sealers", "Decorative textures"],
  "hotel-equipment": ["Hotel guestroom furniture", "Restaurant tables & chairs", "Bed linens & towels", "Mini bars & safes", "Hotel signage"],
  hospitality: ["Commercial kitchen equipment", "Bar & restaurant supplies", "Tableware & glassware", "Laundry equipment", "Housekeeping supplies"],
}

const SERVICE_INFERENCE: Record<string, string[]> = {
  contractor: ["Residential construction", "Commercial building", "Renovation & remodeling", "Project management"],
  architect: ["Architectural design", "Building plans & approvals", "Interior design", "3D visualization"],
  engineer: ["Structural engineering", "Civil works", "MEP design", "Site supervision"],
  surveyor: ["Land surveying", "Quantity surveying", "Valuation & assessment", "Topographical surveys"],
  "interior-designer": ["Interior decoration", "Space planning", "FF&E specification", "Color consultation"],
  landscaper: ["Garden design", "Hardscaping", "Irrigation systems", "Outdoor lighting"],
  "hardware-store": ["Building hardware", "Tools & equipment", "Plumbing fittings", "Electrical accessories"],
  "hospitality-service": ["Hospitality consulting", "Staff training", "Menu development", "Property management"],
}

function getProductSet(cats: string[]): { name: string; description: string; category?: string }[] {
  const products: { name: string; description: string; category?: string }[] = []
  for (const cat of cats) {
    const items = PRODUCT_INFERENCE[cat]
    if (items) {
      for (const item of items.slice(0, 3)) {
        products.push({ name: item, description: item, category: cat })
      }
    }
  }
  if (products.length === 0) {
    products.push(
      { name: "Construction products", description: "General construction materials and supplies", category: "building-materials" },
      { name: "Specialty items", description: "Custom orders available on request", category: "building-materials" }
    )
  }
  return products
}

function smartEnrich(lead: DiscoveredLeadInput): EnrichedData {
  const cats = lead.categoryLabels || []
  const lt = lead.leadType as string
  const services = lt && SERVICE_INFERENCE[lt]
    ? SERVICE_INFERENCE[lt]
    : undefined

  const isProfessional = ["contractor", "architect", "engineer", "surveyor", "interior-designer", "landscaper", "hardware-store", "hospitality-service"].includes(lt)
  const isInternational = lead.country ? !["Tanzania", "Zanzibar"].includes(lead.country) : false

  const email = lead.email || guessEmail(lead.companyName, lead.website)
  const phone = lead.phone || ""
  const isTZ = phone.match(/^(\+?255|0)/)

  return {
    email,
    socialProfiles: lead.socialProfiles || { linkedin: isInternational ? `https://linkedin.com/company/${(lead.companyName || "").toLowerCase().replace(/\s+/g, "-")}` : undefined },
    products: isProfessional ? [] : getProductSet(cats),
    companyDescription: lead.description || `${lead.companyName} — serving ${lead.city || "East Africa"} with quality products and services.`,
    employeeCount: isInternational ? "200+" : "10-50",
    yearEstablished: "",
    services,
    certifications: isInternational ? ["ISO 9001", "Export Certified"] : [],
    targetMarkets: isInternational ? ["Zanzibar", "Tanzania", "East Africa"] : ["Zanzibar", "Tanzania"],
    whatsappPhone: isTZ ? phone : undefined,
  }
}

function guessEmail(companyName?: string, website?: string): string {
  if (website) {
    const domain = website.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim()
    if (domain && !domain.includes("example")) return `info@${domain}`
  }
  return ""
}

export async function enrichLeads(
  leads: DiscoveredLeadInput[],
  runId: string
): Promise<{ enriched: number; leads: DiscoveredLeadInput[] }> {
  const enrichedLeads: DiscoveredLeadInput[] = []

  for (const lead of leads) {
    let enrichment: EnrichedData

    if (isAIEnabled() && lead.website) {
      try {
        const lt = lead.leadType as string
        const prompt = `Enrich business data for this ${
          lt === "partner" ? "international supplier" :
          lt === "contractor" ? "construction contractor" :
          lt === "architect" ? "architecture firm" :
          lt === "engineer" ? "engineering firm" :
          lt === "surveyor" ? "surveying firm" :
          lt === "interior-designer" ? "interior design studio" :
          lt === "landscaping" ? "landscaping company" :
          lt === "hardware-store" ? "hardware store" :
          lt === "hospitality-service" ? "hospitality service provider" :
          "construction supplier"
        }:

Name: ${lead.companyName}
Location: ${lead.city || "Unknown"}, ${lead.country || "Tanzania"}
Website: ${lead.website || "N/A"}
Categories: ${(lead.categoryLabels || []).join(", ")}

Return JSON:
- email: realistic business email or ""
- socialProfiles: { linkedin, facebook, instagram } URLs or empty strings
- products: array of { name, description, category } — relevant products (max 6)
- companyDescription: 2-3 sentence description
- employeeCount: "1-10", "10-50", "50-200", "200+"
- yearEstablished: "YYYY" or ""
- services: array of services offered (for contractors/professionals) or omit
- certifications: string array or empty
- targetMarkets: 1-3 regions (e.g. ["Zanzibar", "Tanzania"])
- whatsappPhone: phone with country code or ""`
        enrichment = (await generateJSON<EnrichedData>(ENRICHMENT_SYSTEM, prompt)) || smartEnrich(lead)
      } catch {
        enrichment = smartEnrich(lead)
      }
    } else {
      enrichment = smartEnrich(lead)
    }

    enrichedLeads.push({
      ...lead,
      email: enrichment.email || lead.email,
      socialProfiles: enrichment.socialProfiles,
      products: enrichment.products || lead.products,
      description: enrichment.companyDescription || lead.description,
    })
  }

  return { enriched: enrichedLeads.length, leads: enrichedLeads }
}
