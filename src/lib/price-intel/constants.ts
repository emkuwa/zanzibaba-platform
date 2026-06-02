/**
 * Price Intelligence Engine — constants and reference data.
 *
 * Single source of truth for region/category metadata used across the engine.
 * Keep this file pure data + types; no Prisma imports here so it can be used
 * client-side as well.
 */

import type { MaterialCategorySlug, ProjectType, QualityTier, RegionCode } from "@prisma/client"

export const REGIONS: ReadonlyArray<{
  code: RegionCode
  name: string
  centerLat: number
  centerLng: number
  displayOrder: number
}> = [
  { code: "ZNZ", name: "Zanzibar", centerLat: -6.165, centerLng: 39.202, displayOrder: 1 },
  { code: "DSM", name: "Dar es Salaam", centerLat: -6.792, centerLng: 39.208, displayOrder: 2 },
  { code: "ARU", name: "Arusha", centerLat: -3.387, centerLng: 36.683, displayOrder: 3 },
  { code: "DOD", name: "Dodoma", centerLat: -6.173, centerLng: 35.741, displayOrder: 4 },
  { code: "MWZ", name: "Mwanza", centerLat: -2.516, centerLng: 32.901, displayOrder: 5 },
]

export const MATERIAL_CATEGORIES: ReadonlyArray<{
  slug: MaterialCategorySlug
  name: string
  description: string
  icon: string
  isHospitality: boolean
  displayOrder: number
  shareByProjectType: Partial<Record<ProjectType, number>>
}> = [
  {
    slug: "CEMENT",
    name: "Cement",
    description: "Portland and specialty cements (OPC 32.5, 42.5, 52.5 — bulk and bagged).",
    icon: "Layers",
    isHospitality: false,
    displayOrder: 1,
    shareByProjectType: { VILLA: 0.08, HOTEL: 0.06, RESORT: 0.05, RESIDENTIAL_BLOCK: 0.09, OFFICE: 0.07, WAREHOUSE: 0.10, COMMERCIAL: 0.07 },
  },
  {
    slug: "REBARS",
    name: "Rebars (Reinforcement Steel)",
    description: "Deformed reinforcement bars Y8–Y32 in 6 m and 12 m lengths.",
    icon: "GitMerge",
    isHospitality: false,
    displayOrder: 2,
    shareByProjectType: { VILLA: 0.07, HOTEL: 0.05, RESORT: 0.05, RESIDENTIAL_BLOCK: 0.08, OFFICE: 0.07, WAREHOUSE: 0.09, COMMERCIAL: 0.06 },
  },
  {
    slug: "BRC",
    name: "BRC Mesh",
    description: "Welded reinforcement fabric (BRC A98, A142, A193, A252, A393, A8).",
    icon: "Grid3x3",
    isHospitality: false,
    displayOrder: 3,
    shareByProjectType: { VILLA: 0.015, HOTEL: 0.01, RESORT: 0.01, RESIDENTIAL_BLOCK: 0.02, OFFICE: 0.015, WAREHOUSE: 0.025, COMMERCIAL: 0.015 },
  },
  {
    slug: "CONCRETE",
    name: "Concrete (Ready-mix & On-site)",
    description: "C15, C20, C25, C30, C35 ready-mix; mix-design and on-site.",
    icon: "Square",
    isHospitality: false,
    displayOrder: 4,
    shareByProjectType: { VILLA: 0.06, HOTEL: 0.04, RESORT: 0.04, RESIDENTIAL_BLOCK: 0.07, OFFICE: 0.06, WAREHOUSE: 0.09, COMMERCIAL: 0.05 },
  },
  {
    slug: "AGGREGATES",
    name: "Aggregates (Sand, Ballast, Hardcore)",
    description: "Plaster sand, river sand, machine sand, ballast 10/14/20 mm, hardcore.",
    icon: "Mountain",
    isHospitality: false,
    displayOrder: 5,
    shareByProjectType: { VILLA: 0.04, HOTEL: 0.03, RESORT: 0.03, RESIDENTIAL_BLOCK: 0.05, OFFICE: 0.04, WAREHOUSE: 0.06, COMMERCIAL: 0.04 },
  },
  {
    slug: "BLOCKS",
    name: "Blocks (Cement & Aerated)",
    description: "Hollow / solid cement blocks 4–9 inch, AAC aerated blocks.",
    icon: "Box",
    isHospitality: false,
    displayOrder: 6,
    shareByProjectType: { VILLA: 0.05, HOTEL: 0.04, RESORT: 0.04, RESIDENTIAL_BLOCK: 0.07, OFFICE: 0.05, WAREHOUSE: 0.06, COMMERCIAL: 0.05 },
  },
  {
    slug: "BRICKS",
    name: "Bricks (Clay, Stabilised, Pavers)",
    description: "Burnt clay bricks, stabilised soil blocks, paving bricks.",
    icon: "Brick",
    isHospitality: false,
    displayOrder: 7,
    shareByProjectType: { VILLA: 0.025, HOTEL: 0.02, RESORT: 0.02, RESIDENTIAL_BLOCK: 0.03, OFFICE: 0.02, WAREHOUSE: 0.02, COMMERCIAL: 0.02 },
  },
  {
    slug: "ROOFING",
    name: "Roofing",
    description: "Steel sheets (IBR / corrugated), tiles, membranes, accessories.",
    icon: "Home",
    isHospitality: false,
    displayOrder: 8,
    shareByProjectType: { VILLA: 0.05, HOTEL: 0.05, RESORT: 0.06, RESIDENTIAL_BLOCK: 0.04, OFFICE: 0.04, WAREHOUSE: 0.06, COMMERCIAL: 0.04 },
  },
  {
    slug: "TILES",
    name: "Tiles (Floor & Wall)",
    description: "Ceramic / porcelain / vitrified tiles 30×30 — 80×80, mosaics.",
    icon: "LayoutGrid",
    isHospitality: false,
    displayOrder: 9,
    shareByProjectType: { VILLA: 0.06, HOTEL: 0.07, RESORT: 0.08, RESIDENTIAL_BLOCK: 0.05, OFFICE: 0.05, WAREHOUSE: 0.02, COMMERCIAL: 0.05 },
  },
  {
    slug: "PAINT",
    name: "Paint & Finishes",
    description: "Emulsion, gloss, weather-guard, primers, decorative coatings.",
    icon: "Brush",
    isHospitality: false,
    displayOrder: 10,
    shareByProjectType: { VILLA: 0.03, HOTEL: 0.035, RESORT: 0.04, RESIDENTIAL_BLOCK: 0.025, OFFICE: 0.03, WAREHOUSE: 0.015, COMMERCIAL: 0.03 },
  },
  {
    slug: "TIMBER",
    name: "Timber & Joinery",
    description: "Hardwood, mahogany, mvule, plywood, MDF, joinery sections.",
    icon: "TreePine",
    isHospitality: false,
    displayOrder: 11,
    shareByProjectType: { VILLA: 0.04, HOTEL: 0.05, RESORT: 0.06, RESIDENTIAL_BLOCK: 0.03, OFFICE: 0.04, WAREHOUSE: 0.015, COMMERCIAL: 0.04 },
  },
  {
    slug: "ALUMINIUM",
    name: "Aluminium (Windows, Doors, Profiles)",
    description: "Sliding / casement / curtain-wall systems, glazing profiles.",
    icon: "Square",
    isHospitality: false,
    displayOrder: 12,
    shareByProjectType: { VILLA: 0.04, HOTEL: 0.05, RESORT: 0.06, RESIDENTIAL_BLOCK: 0.03, OFFICE: 0.06, WAREHOUSE: 0.02, COMMERCIAL: 0.05 },
  },
  {
    slug: "GLASS",
    name: "Glass",
    description: "Float, tempered, laminated, double-glazed units, balustrades.",
    icon: "Maximize2",
    isHospitality: false,
    displayOrder: 13,
    shareByProjectType: { VILLA: 0.02, HOTEL: 0.03, RESORT: 0.04, RESIDENTIAL_BLOCK: 0.02, OFFICE: 0.04, WAREHOUSE: 0.01, COMMERCIAL: 0.03 },
  },
  {
    slug: "FURNITURE",
    name: "Furniture",
    description: "Built-in joinery, loose furniture, modular wardrobes, custom cabinets.",
    icon: "Sofa",
    isHospitality: false,
    displayOrder: 14,
    shareByProjectType: { VILLA: 0.04, HOTEL: 0.05, RESORT: 0.06, RESIDENTIAL_BLOCK: 0.03, OFFICE: 0.04, WAREHOUSE: 0.005, COMMERCIAL: 0.04, HOSPITALITY_FITOUT: 0.18 },
  },
  {
    slug: "HOSPITALITY_FFE",
    name: "Hospitality FF&E",
    description: "Guestroom packages, lobby furniture, lighting, art, accessories.",
    icon: "Hotel",
    isHospitality: true,
    displayOrder: 15,
    shareByProjectType: { HOTEL: 0.20, RESORT: 0.22, HOSPITALITY_FITOUT: 0.45 },
  },
  {
    slug: "COMMERCIAL_KITCHENS",
    name: "Commercial Kitchens",
    description: "Combi ovens, refrigeration, prep tables, exhaust hoods, smallwares.",
    icon: "ChefHat",
    isHospitality: true,
    displayOrder: 16,
    shareByProjectType: { HOTEL: 0.04, RESORT: 0.05, COMMERCIAL: 0.04, HOSPITALITY_FITOUT: 0.10 },
  },
] as const

export const PROJECT_TYPES: ReadonlyArray<{
  value: ProjectType
  label: string
  description: string
  typicalSqm: number
}> = [
  { value: "VILLA", label: "Private Villa", description: "Single residence, 150–600 sqm", typicalSqm: 350 },
  { value: "HOTEL", label: "Hotel", description: "Branded or boutique hotel, 1500–10000 sqm", typicalSqm: 4500 },
  { value: "RESORT", label: "Resort / Beach Resort", description: "Multi-unit resort with amenities, 3000–20000 sqm", typicalSqm: 8000 },
  { value: "RESIDENTIAL_BLOCK", label: "Residential Block", description: "Apartments / townhouses, 500–5000 sqm", typicalSqm: 2000 },
  { value: "OFFICE", label: "Office Building", description: "Commercial office, 500–8000 sqm", typicalSqm: 2500 },
  { value: "WAREHOUSE", label: "Warehouse / Industrial", description: "Logistics or light industry, 1000–10000 sqm", typicalSqm: 3000 },
  { value: "COMMERCIAL", label: "Retail / Commercial", description: "Shops, malls, showrooms, 200–5000 sqm", typicalSqm: 1500 },
  { value: "HOSPITALITY_FITOUT", label: "Hospitality Fit-out", description: "FF&E + OS&E fit-out only", typicalSqm: 2500 },
  { value: "RENOVATION", label: "Renovation", description: "Refurb of existing structure", typicalSqm: 800 },
  { value: "CUSTOM", label: "Custom", description: "Provide your own quantities", typicalSqm: 1000 },
]

export const QUALITY_TIERS: ReadonlyArray<{
  value: QualityTier
  label: string
  multiplier: number
  description: string
}> = [
  { value: "BASIC", label: "Basic / Functional", multiplier: 0.75, description: "Local materials, standard finishes, value-engineered." },
  { value: "MID", label: "Mid-market", multiplier: 1.0, description: "Mix of local + imported, recognised brands." },
  { value: "PREMIUM", label: "Premium / 5-star", multiplier: 1.65, description: "Imported, branded, high-spec finishes throughout." },
]

/**
 * Indicative base sqm cost in USD for each region × project type × tier.
 * Used to seed CostBenchmark rows. Values derived from public TZ
 * construction cost reports (NCC, MoW, Hass Petroleum CCI 2024-25) and
 * Zanzibar developer surveys. Treat as starting median; admin can override.
 */
export const COST_BENCHMARKS_USD_PER_SQM: Record<RegionCode, Record<ProjectType, number>> = {
  ZNZ: { VILLA: 850, HOTEL: 1700, RESORT: 1900, RESIDENTIAL_BLOCK: 700, OFFICE: 950, WAREHOUSE: 480, COMMERCIAL: 900, HOSPITALITY_FITOUT: 1100, RENOVATION: 520, CUSTOM: 750 },
  DSM: { VILLA: 700, HOTEL: 1400, RESORT: 1600, RESIDENTIAL_BLOCK: 580, OFFICE: 820, WAREHOUSE: 420, COMMERCIAL: 780, HOSPITALITY_FITOUT: 950, RENOVATION: 450, CUSTOM: 650 },
  ARU: { VILLA: 750, HOTEL: 1500, RESORT: 1750, RESIDENTIAL_BLOCK: 600, OFFICE: 850, WAREHOUSE: 450, COMMERCIAL: 800, HOSPITALITY_FITOUT: 1000, RENOVATION: 480, CUSTOM: 680 },
  DOD: { VILLA: 660, HOTEL: 1300, RESORT: 1500, RESIDENTIAL_BLOCK: 540, OFFICE: 780, WAREHOUSE: 400, COMMERCIAL: 720, HOSPITALITY_FITOUT: 880, RENOVATION: 420, CUSTOM: 600 },
  MWZ: { VILLA: 680, HOTEL: 1350, RESORT: 1550, RESIDENTIAL_BLOCK: 560, OFFICE: 800, WAREHOUSE: 410, COMMERCIAL: 740, HOSPITALITY_FITOUT: 900, RENOVATION: 430, CUSTOM: 620 },
}

/** USD↔TZS reference rate. Replace with live FX feed in production. */
export const USD_TO_TZS_RATE = 2600
