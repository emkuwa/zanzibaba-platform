import { calculateTrustScore, categorizeByKeywords, estimateYearsInBusiness, type DiscoveredLeadInput } from "./core"

interface ContractorSource {
  name: string
  url: string
  results: DiscoveredLeadInput[]
}

const contractorSources: Record<string, ContractorSource> = {
  "professional-register": {
    name: "Architects & Engineers Registration Board",
    url: "https://aerb.go.tz",
    results: [
      { leadType: "professional", companyName: "ZNP Architects", contactName: "Zahor N. P.", email: "info@znparchitects.com", phone: "+255777111222", website: "https://znparchitects.com", city: "Stone Town", country: "Tanzania", sourcePlatform: "Professional Register", description: "Full-service architecture firm specializing in hospitality and residential projects. Registered with AERB. Est. 2012.", categoryLabels: ["architecture"] },
      { leadType: "professional", companyName: "Michenzani Engineering Consult", contactName: "Ali M.", email: "info@michenzanieng.co.tz", phone: "+255777333444", website: "https://michenzanieng.co.tz", city: "Michenzani", country: "Tanzania", sourcePlatform: "Professional Register", description: "Structural and civil engineering consultancy. Registered engineers. Project management services.", categoryLabels: ["engineering"] },
      { leadType: "professional", companyName: "Zanzibar Surveyors Ltd", contactName: "Hassan K.", email: "info@zanzibarsurvey.co.tz", phone: "+255777555666", website: "https://zanzibarsurvey.co.tz", city: "Stone Town", country: "Tanzania", sourcePlatform: "Professional Register", description: "Land surveying and geospatial services. Licensed surveyors serving Zanzibar and coastal Tanzania.", categoryLabels: ["surveying"] },
    ],
  },
  "contractor-directory": {
    name: "Contractors Registration Board Tanzania",
    url: "https://crb.go.tz",
    results: [
      { leadType: "contractor", companyName: "Bahari Construction Ltd", email: "info@bahariconstruction.co.tz", phone: "+255777777888", website: "https://bahariconstruction.co.tz", city: "Stone Town", country: "Tanzania", sourcePlatform: "Contractor Directory", description: "General contractor specializing in hospitality and commercial construction. Class A registered. Completed 20+ hotel projects in Zanzibar.", categoryLabels: ["general-contractor"] },
      { leadType: "contractor", companyName: "Upendo Builders Ltd", email: "info@upendobuilders.co.tz", phone: "+255777999000", website: "https://upendobuilders.co.tz", city: "Mkunazini", country: "Tanzania", sourcePlatform: "Contractor Directory", description: "Residential and commercial construction. Renovation and fit-out specialist. CRB registered. Est. 2008.", categoryLabels: ["general-contractor"] },
      { leadType: "contractor", companyName: "East Coast Civil Works", email: "projects@eastcoastcivil.co.tz", phone: "+255222111222", website: "https://eastcoastcivil.co.tz", city: "Dar es Salaam", country: "Tanzania", sourcePlatform: "Contractor Directory", description: "Civil engineering and infrastructure contractor. Roads, drainage, water systems. CRB Class A.", categoryLabels: ["civil-contractor"] },
      { leadType: "contractor", companyName: "Jenga Poa Contractors", email: "info@jengapoa.co.tz", phone: "+255777222333", website: "https://jengapoa.co.tz", city: "Nungwi", country: "Tanzania", sourcePlatform: "Contractor Directory", description: "Specialist in eco-friendly construction and sustainable building practices. Beach resort specialist.", categoryLabels: ["general-contractor"] },
    ],
  },
}

export async function discoverContractors(): Promise<DiscoveredLeadInput[]> {
  const allLeads: DiscoveredLeadInput[] = []

  for (const [, source] of Object.entries(contractorSources)) {
    for (const lead of source.results) {
      allLeads.push({
        ...lead,
        sourceUrl: source.url,
        categorySlug: categorizeByKeywords(lead.description || "", lead.companyName || "")[0],
      })
    }
  }

  return allLeads.map(lead => {
    const years = estimateYearsInBusiness(lead.description || "")
    const checks = {
      websiteExists: !!lead.website,
      websiteProfessional: lead.website ? !lead.website.includes("wordpress") : false,
      emailDeliverable: !!lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email),
      phoneReachable: !!lead.phone,
      socialPresence: false,
      businessRegistration: !!lead.description?.toLowerCase().includes("registered") || !!lead.description?.toLowerCase().includes("licensed"),
      onlineReviews: false,
      yearsInBusiness: years !== undefined && years >= 3,
    }
    return { ...lead, verificationData: checks, ...calculateTrustScore(checks) }
  })
}
