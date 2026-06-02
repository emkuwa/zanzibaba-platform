import type { MetadataRoute } from "next"

const categories = [
  "building-materials", "furniture", "kitchens", "wardrobes", "sanitary",
  "lighting", "doors-windows", "roofing", "electrical", "hvac",
  "landscaping", "pools", "hospitality-equipment", "prefab-houses", "modular-buildings",
]

const locations = [
  "stone-town", "mkunazini", "kiponda", "fumba", "michenzani",
  "mombasa", "dar-es-salaam",
]

const exampleSupplierSlugs = [
  "zanzibar-cement-ltd", "swahili-build-mart", "ocean-view-interiors",
  "east-african-steel-co", "spice-island-hardware", "buildpro-solutions",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zanzibaba.co.tz"

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/marketplace`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/suppliers`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/contractors`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/professionals`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/rfq`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/international`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/experience-center`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/prefab`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/hospitality`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ]

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/suppliers/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const locationSupplierPages = locations.map((loc) => ({
    url: `${baseUrl}/suppliers/location/${loc}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  const locationContractorPages = locations.slice(0, 4).map((loc) => ({
    url: `${baseUrl}/contractors/location/${loc}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  const supplierPages = exampleSupplierSlugs.map((slug) => ({
    url: `${baseUrl}/suppliers/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...locationSupplierPages,
    ...locationContractorPages,
    ...supplierPages,
  ]
}
