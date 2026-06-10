import { prisma } from "../src/lib/prisma"

const ARTICLES = [
  {
    title: "The Complete Guide to Building in Zanzibar",
    slug: "building-zanzibar-guide",
    excerpt: "Everything you need to know about construction permits, materials, and contractors in Zanzibar.",
    content: `Zanzibar's construction sector is experiencing unprecedented growth driven by tourism development, infrastructure investment, and a growing residential market. This comprehensive guide covers everything you need to know about building on the Spice Island.\n\n## Permits and Approvals\n\nAll construction projects in Zanzibar require approval from the Zanzibar Municipal Council or the relevant district authority. The Zanzibar Investment Promotion Authority (ZIPA) provides guidance for foreign investors.\n\n## Building Materials\n\nWhile basic materials like cement, sand, and aggregate are available locally, specialized items such as hotel FF&E, kitchen equipment, and premium finishes are typically imported from Dubai, Turkey, India, or China.\n\n## Finding Contractors\n\nThe Zanzibaba marketplace connects project owners with vetted contractors, architects, and suppliers across the island and internationally.`,
    category: "Guide",
    author: "Zanzibaba Intelligence",
    isFeatured: true,
    publishedAt: new Date("2025-06-01"),
    status: "PUBLISHED",
  },
  {
    title: "Why Prefab Construction is Taking Off in Zanzibar",
    slug: "prefab-solutions-zanzibar",
    excerpt: "How modular building is revolutionizing resort and villa development on the island.",
    content: `Prefabricated and modular construction is gaining significant traction in Zanzibar, particularly in the hospitality sector where speed to market is critical.\n\n## Speed Advantages\n\nA modular hotel can be completed in 8-12 months versus 18-24 months for traditional construction. This is especially valuable in Zanzibar's competitive tourism market where early opening can capture peak seasons.\n\n## Quality Control\n\nFactory-controlled production ensures consistent quality unaffected by weather or on-site variables — a significant advantage in Zanzibar's tropical climate.\n\n## Supplier Landscape\n\nMajor prefab suppliers from China, Turkey, and South Africa are actively supplying Zanzibar projects. The Zanzibaba marketplace now lists verified prefab manufacturers and modular building specialists.`,
    category: "Trends",
    author: "Zanzibaba Intelligence",
    isFeatured: false,
    publishedAt: new Date("2025-05-25"),
    status: "PUBLISHED",
  },
  {
    title: "Sourcing Building Materials in Zanzibar: A Buyer's Guide",
    slug: "sourcing-materials-zanzibar",
    excerpt: "Tips for finding quality materials at competitive prices from local and international suppliers.",
    content: `Whether you're developing a resort, building a villa, or managing a commercial project in Zanzibar, sourcing materials efficiently can make or break your budget and timeline.\n\n## Local vs. Imported\n\nBasic bulk materials (cement, sand, aggregate, blocks) are best sourced locally. Specialized items (kitchen equipment, furniture, lighting, sanitaryware) are typically imported.\n\n## Key International Markets\n\n- Dubai: Finishes, lighting, sanitaryware\n- Turkey: Furniture, textiles, marble\n- India: Steel, tiles, granite\n- China: Prefab structures, solar systems, HVAC\n- South Africa: Engineered wood, hardware\n\n## Using Zanzibaba\n\nThe platform's discovery engine can find qualified suppliers across 7 countries and 12 categories, with trust scores and verification data to help you make informed decisions.`,
    category: "Sourcing",
    author: "Zanzibaba Intelligence",
    isFeatured: true,
    publishedAt: new Date("2025-05-18"),
    status: "PUBLISHED",
  },
  {
    title: "Zanzibar Hospitality Development: Market Insights 2025",
    slug: "hospitality-development-zanzibar",
    excerpt: "Key trends shaping hotel and resort development in Zanzibar's booming tourism sector.",
    content: `Zanzibar's tourism sector continues its remarkable growth trajectory with international arrivals exceeding 600,000 in 2024. This surge is driving significant hospitality development across the islands.\n\n## Current Pipeline\n\nOver 2,000 new hotel rooms are in various stages of planning and construction, including major developments in Nungwi, Kendwa, Fumba, and the emerging east coast destinations.\n\n## Development Trends\n\n- Eco-luxury resorts with sustainability certifications\n- Boutique heritage properties in Stone Town\n- All-inclusive beach resorts on the north and east coasts\n- Mixed-use developments combining hospitality with residential\n\n## Procurement Opportunities\n\nEach new resort represents $3-8M in procurement spend across FF&E, OS&E, kitchen equipment, and building materials.`,
    category: "Market Insights",
    author: "Zanzibaba Intelligence",
    isFeatured: true,
    publishedAt: new Date("2025-05-10"),
    status: "PUBLISHED",
  },
  {
    title: "Zanzibar's $15M Pemba Port Upgrade Opens Development Opportunities",
    slug: "pemba-port-opportunities",
    excerpt: "Major infrastructure project creates opportunities for contractors, suppliers, and related services.",
    content: `The Pemba Port Upgrade, a $15M multi-phase infrastructure project, is now in planning stages and expected to generate significant contracting and supply opportunities through 2030.\n\n## Project Scope\n\nThe upgrade includes a new cargo terminal, passenger jetty, warehouse complex, and road access improvements across four phases.\n\n## Opportunities for Businesses\n\n- Civil contractors for marine and landside works\n- Steel and concrete suppliers\n- Warehousing and logistics providers\n- MEP contractors for terminal buildings\n\nBusinesses can register interest through the Zanzibaba Projects & Opportunities Hub.`,
    category: "Opportunities",
    author: "Zanzibaba Intelligence",
    isFeatured: false,
    publishedAt: new Date("2025-06-05"),
    status: "PUBLISHED",
  },
  {
    title: "Fumba Town Phase III: Zanzibar's Largest Residential Development",
    slug: "fumba-town-phase-iii",
    excerpt: "180-unit residential phase opens bidding for contractors and suppliers across multiple work packages.",
    content: `Fumba Town Phase III, a $12M residential development on Zanzibar's southwest coast, is now in progress and actively seeking contractors and suppliers.\n\n## Work Packages\n\n- Structural works and foundations\n- MEP systems installation\n- Interior finishing\n- Landscaping and infrastructure\n- Road and utility connections\n\n## How to Participate\n\nInterested businesses can view the full project details and register their interest through the Zanzibaba marketplace. The project features a featured opportunity badge, indicating priority sourcing.`,
    category: "Opportunities",
    author: "Zanzibaba Intelligence",
    isFeatured: true,
    publishedAt: new Date("2025-06-08"),
    status: "PUBLISHED",
  },
  {
    title: "Sustainable Building Materials: The Future of Zanzibar Construction",
    slug: "sustainable-materials-zanzibar",
    excerpt: "How eco-friendly building practices and materials are shaping Zanzibar's development landscape.",
    content: `Sustainability is no longer a niche concern in Zanzibar's construction sector — it's becoming a core requirement for major developments, particularly in the hospitality sector.\n\n## Key Sustainable Materials\n\n- Rammed earth and compressed earth blocks\n- Locally sourced stone and timber\n- Recycled and reclaimed materials\n- Solar-ready roofing systems\n- Natural insulation materials\n\n## Market Demand\n\nProperties with sustainability certifications command 20-30% premium pricing in Zanzibar's tourism market, driving developer interest in green building practices.`,
    category: "Trends",
    author: "Zanzibaba Intelligence",
    isFeatured: false,
    publishedAt: new Date("2025-05-30"),
    status: "PUBLISHED",
  },
  {
    title: "Navigating Zanzibar's Construction Permit Process",
    slug: "construction-permits-zanzibar",
    excerpt: "Step-by-step guide to obtaining building permits and approvals in Zanzibar.",
    content: `Understanding Zanzibar's construction permit process is essential for timely project delivery. This guide breaks down the key steps and requirements.\n\n## Key Authorities\n\n- Zanzibar Municipal Council (urban areas)\n- District Councils (rural areas)\n- Zanzibar Investment Promotion Authority (foreign investors)\n- Department of Environment (EIA approvals)\n\n## Typical Timeline\n\nThe permit process typically takes 3-6 months for standard projects and 6-12 months for large-scale developments requiring environmental impact assessments.\n\n## Common Pitfalls\n\n- Incomplete documentation\n- Environmental compliance issues\n- Land ownership verification delays\n- Community consultation requirements`,
    category: "Guide",
    author: "Zanzibaba Intelligence",
    isFeatured: false,
    publishedAt: new Date("2025-05-20"),
    status: "PUBLISHED",
  },
  {
    title: "Zanzibar's East Coast Development Corridor Takes Shape",
    slug: "east-coast-development",
    excerpt: "Emerging development corridor from Bwejuu to Jambiani opens new opportunities for suppliers and contractors.",
    content: `Zanzibar's east coast, long known for its pristine beaches and traditional fishing villages, is emerging as the next frontier for tourism and residential development.\n\n## Current Developments\n\n- Bwejuu Sustainable Village: 35 eco-bandas with community facilities\n- Jambiani beachfront hotel developments\n- Paje boutique resort projects\n- Michamvi mixed-use developments\n\n## Infrastructure Investment\n\nThe government has committed to improving road access and utility infrastructure along the east coast, reducing development costs and timelines.`,
    category: "Market Insights",
    author: "Zanzibaba Intelligence",
    isFeatured: false,
    publishedAt: new Date("2025-06-03"),
    status: "PUBLISHED",
  },
  {
    title: "How to Win Contracts on Zanzibaba: A Guide for Suppliers",
    slug: "win-contracts-zanzibaba-guide",
    excerpt: "Best practices for suppliers and contractors to win business through the Zanzibaba marketplace.",
    content: `With over 400 businesses listed and growing project opportunities, Zanzibaba is becoming the primary platform for construction procurement in Zanzibar.\n\n## Key Success Factors\n\n1. Complete your profile with detailed capabilities\n2. Claim and verify your business profile\n3. Respond to RFQs promptly\n4. Maintain competitive pricing\n5. Showcase completed projects\n\n## Getting Started\n\nThe first step is claiming your business profile on Zanzibaba. This activates your listing and makes you visible to project owners searching for suppliers and contractors.`,
    category: "Guide",
    author: "Zanzibaba Intelligence",
    isFeatured: false,
    publishedAt: new Date("2025-06-10"),
    status: "PUBLISHED",
  },
]

async function main() {
  const existingCount = await prisma.article.count()
  if (existingCount > 0) {
    console.log(`Database already has ${existingCount} articles. Skipping seed.`)
    return
  }

  let created = 0
  for (const article of ARTICLES) {
    await prisma.article.create({ data: article as any })
    created++
  }

  console.log(`Seeded ${created} articles successfully.`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Seed failed:", e)
  process.exit(1)
})
