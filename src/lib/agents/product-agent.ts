import { categorizeByKeywords, type DiscoveredLeadInput, type ProductRecord } from "./core"

interface ProductSource {
  sourceName: string
  sourceUrl: string
  products: ProductRecord[]
  supplierName: string
}

const productSources: ProductSource[] = [
  {
    sourceName: "Supplier Catalog",
    sourceUrl: "https://stonetownbuild.co.tz/catalog",
    supplierName: "Stone Town Building Supplies",
    products: [
      { name: "Porcelain Floor Tile 60x60", description: "Premium porcelain floor tile. Suitable for indoor and outdoor use.", price: 28.50, currency: "USD", category: "finishes", unit: "box", moq: 50 },
      { name: "Wall Hung Toilet Suite", description: "Modern wall-hung toilet with soft-close seat and dual flush.", price: 185.00, currency: "USD", category: "sanitary", unit: "piece", moq: 10 },
      { name: "Rain Shower Head 300mm", description: "Stainless steel rain shower head with LED temperature display.", price: 95.00, currency: "USD", category: "sanitary", unit: "piece", moq: 20 },
      { name: "LED Bathroom Mirror", description: "Illuminated LED bathroom mirror with anti-fog and touch control.", price: 220.00, currency: "USD", category: "sanitary", unit: "piece", moq: 5 },
    ],
  },
  {
    sourceName: "Supplier Catalog",
    sourceUrl: "https://kili-steel.co.tz/products",
    supplierName: "Kilimanjaro Steel Works",
    products: [
      { name: "Reinforcement Bar 12mm", description: "High-tensile steel reinforcement bar. Grade 60. 12mm diameter.", price: 850.00, currency: "USD", category: "building-materials", unit: "ton", moq: 1 },
      { name: "Corrugated Roofing Sheet Gauge 28", description: "Galvanized corrugated roofing sheet. Standard profile. 2.4m length.", price: 12.50, currency: "USD", category: "building-materials", unit: "sheet", moq: 100 },
      { name: "Steel I-Beam 150x150", description: "Structural steel I-beam for construction. 150mm x 150mm.", price: 950.00, currency: "USD", category: "building-materials", unit: "piece", moq: 5 },
    ],
  },
  {
    sourceName: "Supplier Catalog",
    sourceUrl: "https://zanzibarsolar.co.tz/shop",
    supplierName: "Zanzibar Solar Solutions",
    products: [
      { name: "Solar Panel 450W Monocrystalline", description: "High-efficiency monocrystalline solar panel. 450W output.", price: 280.00, currency: "USD", category: "electrical", unit: "piece", moq: 10 },
      { name: "Lithium Battery 5kWh", description: "Lithium-ion battery storage system. 5kWh capacity with BMS.", price: 1850.00, currency: "USD", category: "electrical", unit: "piece", moq: 2 },
      { name: "Solar Inverter 5kW Hybrid", description: "Hybrid solar inverter. 5kW. MPPT charge controller built-in.", price: 950.00, currency: "USD", category: "electrical", unit: "piece", moq: 3 },
    ],
  },
  {
    sourceName: "Supplier Catalog",
    sourceUrl: "https://premiumfloor.co.tz/products",
    supplierName: "Premium Flooring Tanzania",
    products: [
      { name: "Engineered Wood Flooring Oak", description: "Premium engineered oak flooring. 14mm thickness. Click system.", price: 45.00, currency: "USD", category: "finishes", unit: "sqm", moq: 50 },
      { name: "Vinyl Plank Flooring Luxury", description: "Luxury vinyl plank flooring. Waterproof. 5mm thickness.", price: 22.00, currency: "USD", category: "finishes", unit: "sqm", moq: 100 },
      { name: "Natural Stone Tile Slate", description: "Natural slate floor tile. Honed finish. 30x60cm.", price: 38.00, currency: "USD", category: "finishes", unit: "sqm", moq: 30 },
    ],
  },
]

export async function discoverProducts(): Promise<DiscoveredLeadInput[]> {
  const leads: DiscoveredLeadInput[] = []

  for (const source of productSources) {
    leads.push({
      leadType: "product",
      companyName: source.supplierName,
      sourceUrl: source.sourceUrl,
      sourcePlatform: source.sourceName,
      products: source.products,
      categorySlug: categorizeByKeywords(source.products.map(p => p.category || "").join(" "), source.supplierName)[0],
    })
  }

  return leads.map(lead => ({
    ...lead,
    verificationData: { productCount: lead.products?.length || 0 },
    ...{ score: 50, level: "MEDIUM" as const, checks: [] },
  }))
}
