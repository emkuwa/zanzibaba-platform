import { categorizeByKeywords, type DiscoveredLeadInput } from "./core"

interface ProjectSource {
  name: string
  url: string
  results: DiscoveredLeadInput[]
}

const projectSources: Record<string, ProjectSource> = {
  "tender-portal": {
    name: "Tanzania National e-Procurement System",
    url: "https://nef.go.tz",
    results: [
      { leadType: "project", companyName: "Zanzibar Water Authority", contactName: "Procurement Unit", email: "procurement@zawa.go.tz", phone: "+255777444555", website: "https://zawa.go.tz", city: "Stone Town", country: "Tanzania", sourcePlatform: "Tender Portal", description: "Tender for supply of water treatment chemicals, pipes, and pumping equipment for Zanzibar water infrastructure upgrade. Budget: $2.5M.", categoryLabels: ["infrastructure"] },
      { leadType: "project", companyName: "Ministry of Infrastructure Zanzibar", email: "tenders@infra.zanzibar.go.tz", website: "https://infra.zanzibar.go.tz", city: "Stone Town", country: "Tanzania", sourcePlatform: "Tender Portal", description: "Road construction and drainage project. 15km of urban roads in Mkunazini and Michenzani. Budget: $8M.", categoryLabels: ["infrastructure"] },
    ],
  },
  "hospitality-news": {
    name: "Zanzibar Hospitality Investment News",
    url: "https://zanzibarhotelnews.com",
    results: [
      { leadType: "project", companyName: "Riu Resort Expansion", email: "procurement@riu.com", website: "https://riu.com", city: "Nungwi", country: "Tanzania", sourcePlatform: "Hospitality News", description: "Riu Resort Nungwi expansion. 120 new rooms, 2 restaurants, pool. Seeking FF&E suppliers. Budget: $15M.", categoryLabels: ["hospitality"] },
      { leadType: "project", companyName: "Zuri Zanzibar Phase II", email: "info@zurizanzibar.com", website: "https://zurizanzibar.com", city: "Kendwa", country: "Tanzania", sourcePlatform: "Hospitality News", description: "Zuri Zanzibar hotel phase II development. 45 premium villas, spa, and beach club. Budget: $12M.", categoryLabels: ["hospitality"] },
    ],
  },
  "development-authority": {
    name: "Zanzibar Investment Promotion Authority",
    url: "https://zipa.go.tz",
    results: [
      { leadType: "project", companyName: "Fumba Town Development", email: "info@fumbatown.com", website: "https://fumbatown.com", city: "Fumba", country: "Tanzania", sourcePlatform: "Development Authority", description: "Fumba Town phase III - 200 residential units, commercial center, and infrastructure. Seeking bulk material suppliers. Budget: $20M.", categoryLabels: ["real-estate"] },
      { leadType: "project", companyName: "Mwaka Kikutu Resort", email: "info@mkresort.com", city: "Mwaka Kikutu", country: "Tanzania", sourcePlatform: "Development Authority", description: "New eco-luxury resort development. 60 villas, restaurant, spa, infinity pool. Budget: $8M.", categoryLabels: ["hospitality"] },
    ],
  },
  "eia-reports": {
    name: "EIA Register Zanzibar",
    url: "https://nemo.go.tz",
    results: [
      { leadType: "project", companyName: "Melia Zanzibar Expansion", email: "projects@melia.com", website: "https://melia.com", city: "Mtangani", country: "Tanzania", sourcePlatform: "EIA Report", description: "Melia Zanzibar expansion project. 80 new suites, conference center, spa expansion. Environmental impact assessment approved. Budget: $8M.", categoryLabels: ["hospitality"] },
      { leadType: "project", companyName: "Maternwe Beach Resort", email: "info@maternweresort.com", city: "Maternwe", country: "Tanzania", sourcePlatform: "EIA Report", description: "New beach resort development. 35 rooms, restaurant, bar. Seeking construction materials and FF&E suppliers. Budget: $5M.", categoryLabels: ["hospitality"] },
    ],
  },
}

export async function discoverProjects(): Promise<DiscoveredLeadInput[]> {
  const allLeads: DiscoveredLeadInput[] = []

  for (const [, source] of Object.entries(projectSources)) {
    for (const lead of source.results) {
      allLeads.push({
        ...lead,
        sourceUrl: source.url,
        categorySlug: categorizeByKeywords(lead.description || "", lead.companyName || "")[0],
      })
    }
  }

  return allLeads.map(lead => ({
    ...lead,
    verificationData: { budget: lead.description?.match(/\$[\d,.]+[BMK]/)?.[0] || "Unknown" },
    ...{ score: 60, level: "MEDIUM" as const, checks: [] },
  }))
}
