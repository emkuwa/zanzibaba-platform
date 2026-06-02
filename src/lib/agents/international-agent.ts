import { categorizeByKeywords, type DiscoveredLeadInput } from "./core"

interface IntlSource {
  name: string
  country: string
  url: string
  results: DiscoveredLeadInput[]
}

const intlSources: Record<string, IntlSource> = {
  china: {
    name: "Alibaba.com",
    country: "China",
    url: "https://alibaba.com",
    results: [
      { leadType: "supplier", companyName: "Foshan GANI Ceramics Co Ltd", email: "export@ganiceramics.cn", website: "https://ganiceramics.com", city: "Foshan", country: "China", sourcePlatform: "Alibaba", description: "Leading Chinese tile manufacturer. 30 years of export experience. ISO certified. Full range of porcelain, ceramic, and stone tiles.", categoryLabels: ["finishes"] },
      { leadType: "supplier", companyName: "Guangdong Hoppy Home Appliances", email: "sales@hoppyhome.cn", website: "https://hoppyhome.cn", city: "Guangdong", country: "China", sourcePlatform: "Alibaba", description: "Kitchen appliance manufacturer. Induction cooktops, range hoods, built-in ovens. Export to 50+ countries.", categoryLabels: ["kitchens"] },
      { leadType: "supplier", companyName: "Suzhou Hailong Steel Structure Co", email: "info@hailongsteel.cn", website: "https://hailongsteel.cn", city: "Suzhou", country: "China", sourcePlatform: "Alibaba", description: "Prefab house and steel structure manufacturer. Container homes, modular buildings, steel frames. CE certified.", categoryLabels: ["prefab-houses"] },
      { leadType: "supplier", companyName: "Zhongshan LED Lighting Co", email: "export@zs-led.cn", website: "https://zs-led.cn", city: "Zhongshan", country: "China", sourcePlatform: "Alibaba", description: "LED lighting manufacturer. Indoor, outdoor, commercial, and hospitality lighting solutions.", categoryLabels: ["lighting"] },
    ],
  },
  turkey: {
    name: "Turkey Exporters Assembly",
    country: "Turkey",
    url: "https://tim.org.tr",
    results: [
      { leadType: "supplier", companyName: "Kale Seramik", email: "export@kaleseramik.com.tr", website: "https://kaleseramik.com", city: "Istanbul", country: "Turkey", sourcePlatform: "Turkey Exporters", description: "One of Turkey's largest ceramic tile manufacturers. Exporting to 80+ countries. Hospitality and residential collections.", categoryLabels: ["finishes"] },
      { leadType: "supplier", companyName: "Köseoğlu Door Systems", email: "info@koseoglu.com.tr", website: "https://koseoglu.com.tr", city: "Ankara", country: "Turkey", sourcePlatform: "Turkey Exporters", description: "Premium wooden door manufacturer. Interior and exterior doors, hotel doors, fire-rated doors.", categoryLabels: ["doors-windows"] },
      { leadType: "supplier", companyName: "Falez Interior Finishes", email: "export@falez.com.tr", website: "https://falez.com.tr", city: "Antalya", country: "Turkey", sourcePlatform: "Turkey Exporters", description: "Interior finishings manufacturer. Cornices, moldings, wall panels, decorative elements.", categoryLabels: ["finishes"] },
    ],
  },
  uae: {
    name: "Dubai Chamber of Commerce",
    country: "UAE",
    url: "https://dubaichamber.com",
    results: [
      { leadType: "supplier", companyName: "Al Futtaim Hospitality", email: "hospitality@alfuttaim.ae", website: "https://alfuttaim.com", city: "Dubai", country: "UAE", sourcePlatform: "UAE Chamber", description: "Complete hospitality solutions provider. FF&E, OS&E, kitchen equipment, and hotel supplies for the Middle East and Africa.", categoryLabels: ["hospitality-equipment"] },
      { leadType: "supplier", companyName: "Dubai Luxury Building Materials", email: "info@dlbm.ae", website: "https://dlbm.ae", city: "Dubai", country: "UAE", sourcePlatform: "UAE Chamber", description: "Premium and luxury building materials. Marble, granite, high-end fixtures, and architectural finishes.", categoryLabels: ["finishes"] },
    ],
  },
  india: {
    name: "India Trade Portal",
    country: "India",
    url: "https://indiatradeportal.in",
    results: [
      { leadType: "supplier", companyName: "Havells India Ltd", email: "export@havells.com", website: "https://havells.com", city: "Noida", country: "India", sourcePlatform: "India Trade Portal", description: "Leading electrical equipment manufacturer. Switches, cables, circuit breakers, fans, lighting. Export to 60+ countries.", categoryLabels: ["electrical"] },
      { leadType: "supplier", companyName: "Jaquar Group", email: "export@jaquar.com", website: "https://jaquar.com", city: "New Delhi", country: "India", sourcePlatform: "India Trade Portal", description: "Premium bathroom solutions. Sanitary ware, faucets, showers, bathtubs. World's largest faucet manufacturer.", categoryLabels: ["sanitary"] },
      { leadType: "supplier", companyName: "Tata Steel", email: "export@tatasteel.com", website: "https://tatasteel.com", city: "Mumbai", country: "India", sourcePlatform: "India Trade Portal", description: "Global steel giant. Construction steel, roofing solutions, steel structures. Operating in 50+ countries.", categoryLabels: ["building-materials"] },
    ],
  },
}

export async function discoverInternational(): Promise<DiscoveredLeadInput[]> {
  const allLeads: DiscoveredLeadInput[] = []

  for (const [, source] of Object.entries(intlSources)) {
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
    verificationData: { international: true, exportCapable: true },
    ...{ score: 65, level: "MEDIUM" as const, checks: [] },
  }))
}
