import { prisma } from "../src/lib/prisma"

const PROJECTS = [
  {
    title: "Fumba Town Phase III",
    slug: "fumba-town-phase-iii",
    description: "Large-scale residential development on Zanzibar's southwest coast. Phase III includes 180 villa units, community infrastructure, roads, utilities, and commercial spaces. Seeking contractors for structural works, MEP, and finishing.",
    projectType: "Residential Development",
    category: "residential",
    budget: 12000000,
    location: "Fumba, Zanzibar",
    timelineStart: new Date("2026-06-01"),
    timelineEnd: new Date("2028-12-31"),
    status: "IN_PROGRESS",
    isFeatured: true,
  },
  {
    title: "Meliá Zanzibar Expansion",
    slug: "melia-zanzibar-expansion",
    description: "Expansion of the existing Meliá hotel in Mtangani. Adding 85 new guest rooms, two infinity pools, a spa complex, and event pavilion. Hospitality FF&E procurement of $2.8M. Targeting 5-star certification.",
    projectType: "Hospitality",
    category: "hospitality",
    budget: 8000000,
    location: "Mtangani, Zanzibar",
    timelineStart: new Date("2025-09-01"),
    timelineEnd: new Date("2027-03-31"),
    status: "PLANNING",
    isFeatured: true,
  },
  {
    title: "Stone Town Heritage Hotel",
    slug: "stone-town-heritage-hotel",
    description: "Boutique heritage hotel restoration in Stone Town. Converting a 19th-century Omani merchant house into a 22-room luxury hotel. Requires specialized stone masonry, traditional Zanzibari carpentry, and conservation specialists.",
    projectType: "Hospitality",
    category: "hospitality",
    budget: 5000000,
    location: "Stone Town, Zanzibar",
    timelineStart: new Date("2024-01-01"),
    timelineEnd: new Date("2026-06-30"),
    status: "COMPLETED",
    isFeatured: false,
  },
  {
    title: "Michenzani Office Complex",
    slug: "michenzani-office-complex",
    description: "Modern 8-story commercial office complex in Michenzani business district. 12,000 sqm of Grade-A office space with underground parking, retail podium, and rooftop restaurant. Seeking MEP and facade contractors.",
    projectType: "Commercial",
    category: "commercial",
    budget: 3500000,
    location: "Michenzani, Zanzibar",
    timelineStart: new Date("2025-03-01"),
    timelineEnd: new Date("2026-09-30"),
    status: "IN_PROGRESS",
    isFeatured: false,
  },
  {
    title: "Kiponda Luxury Apartments",
    slug: "kiponda-luxury-apartments",
    description: "High-end residential development in Kiponda. 42 luxury apartments with ocean views, rooftop infinity pool, gym, and 24-hour concierge. High-spec finishes including imported Italian kitchen fittings and smart home systems.",
    projectType: "Residential",
    category: "residential",
    budget: 4200000,
    location: "Kiponda, Zanzibar",
    timelineStart: new Date("2025-06-01"),
    timelineEnd: new Date("2027-03-31"),
    status: "IN_PROGRESS",
    isFeatured: true,
  },
  {
    title: "Nungwi Eco-Resort",
    slug: "nungwi-eco-resort",
    description: "Sustainable eco-resort on Zanzibar's northern coast. 60 eco-villas built with locally sourced materials, solar-powered, rainwater harvesting, and wastewater treatment. Seeking suppliers for solar systems, water treatment, and sustainable building materials.",
    projectType: "Hospitality",
    category: "hospitality",
    budget: 6500000,
    location: "Nungwi, Zanzibar",
    timelineStart: new Date("2026-03-01"),
    timelineEnd: new Date("2028-06-30"),
    status: "PLANNING",
    isFeatured: true,
  },
  {
    title: "Fumba School Complex",
    slug: "fumba-school-complex",
    description: "Educational infrastructure project in Fumba. 3-story school building with 24 classrooms, science laboratories, library, sports facilities, and staff housing. Funded by international development partnership.",
    projectType: "Infrastructure",
    category: "infrastructure",
    budget: 1800000,
    location: "Fumba, Zanzibar",
    timelineStart: new Date("2024-06-01"),
    timelineEnd: new Date("2025-12-31"),
    status: "COMPLETED",
    isFeatured: false,
  },
  {
    title: "Pemba Port Upgrade",
    slug: "pemba-port-upgrade",
    description: "Major infrastructure project upgrading Pemba's main port facilities. New cargo terminal, passenger jetty, warehouse complex, and road access improvements. Multi-phase project spanning 4 years.",
    projectType: "Infrastructure",
    category: "infrastructure",
    budget: 15000000,
    location: "Pemba, Zanzibar",
    timelineStart: new Date("2026-01-01"),
    timelineEnd: new Date("2030-12-31"),
    status: "PLANNING",
    isFeatured: false,
  },
  {
    title: "Mkunazini Mixed-Use Tower",
    slug: "mkunazini-mixed-use-tower",
    description: "Iconic 22-story mixed-use development in Mkunazini. Retail levels 1-4, office levels 5-14, luxury residences levels 15-22. Total 25,000 sqm. Includes 3-level basement parking. Seeking structural engineering and facade partners.",
    projectType: "Commercial",
    category: "commercial",
    budget: 9000000,
    location: "Mkunazini, Zanzibar",
    timelineStart: new Date("2026-06-01"),
    timelineEnd: new Date("2029-06-30"),
    status: "PLANNING",
    isFeatured: true,
  },
  {
    title: "Kendwa Beach Resort & Spa",
    slug: "kendwa-beach-resort-spa",
    description: "New 5-star resort development on Kendwa Beach. 120 rooms, overwater spa, multiple dining venues, and a dive center. Requires hospitality suppliers for FF&E, OS&E, kitchen equipment, and linen.",
    projectType: "Hospitality",
    category: "hospitality",
    budget: 22000000,
    location: "Kendwa, Zanzibar",
    timelineStart: new Date("2027-01-01"),
    timelineEnd: new Date("2029-12-31"),
    status: "PLANNING",
    isFeatured: true,
  },
  {
    title: "Viwandani Industrial Park",
    slug: "viwandani-industrial-park",
    description: "Light industrial and warehousing park on Zanzibar's outskirts. 40-acre development with ready-built factory shells, logistics hub, truck depot, and worker amenities. Targeting manufacturing and processing businesses.",
    projectType: "Infrastructure",
    category: "infrastructure",
    budget: 18000000,
    location: "Viwandani, Zanzibar",
    timelineStart: new Date("2026-09-01"),
    timelineEnd: new Date("2029-03-31"),
    status: "PLANNING",
    isFeatured: false,
  },
  {
    title: "Bwejuu Sustainable Village",
    slug: "bwejuu-sustainable-village",
    description: "Eco-tourism village development on Zanzibar's east coast. 35 traditional-style bandas, community center, organic farm, and conservation area. Built using rammed earth, thatch, and locally fired bricks.",
    projectType: "Residential Development",
    category: "residential",
    budget: 3200000,
    location: "Bwejuu, Zanzibar",
    timelineStart: new Date("2025-09-01"),
    timelineEnd: new Date("2027-06-30"),
    status: "IN_PROGRESS",
    isFeatured: false,
  },
  {
    title: "Zanzibar City Convention Centre",
    slug: "zanzibar-city-convention-centre",
    description: "Purpose-built convention and exhibition centre with 2,500-seat auditorium, exhibition halls, meeting rooms, and VIP pavilion. Includes catering kitchens rated for 1,000 covers. Seeking MEP and commercial kitchen suppliers.",
    projectType: "Commercial",
    category: "commercial",
    budget: 14000000,
    location: "Zanzibar City",
    timelineStart: new Date("2027-03-01"),
    timelineEnd: new Date("2029-09-30"),
    status: "PLANNING",
    isFeatured: false,
  },
  {
    title: "Tumbatu Island Resort",
    slug: "tumbatu-island-resort",
    description: "Exclusive island resort development on Tumbatu Island. 40 overwater villas, beach club, helipad, and staff village. Fully off-grid with solar microgrid, desalination plant, and wastewater recycling. Requires specialized marine construction expertise.",
    projectType: "Hospitality",
    category: "hospitality",
    budget: 28000000,
    location: "Tumbatu Island, Zanzibar",
    timelineStart: new Date("2028-01-01"),
    timelineEnd: new Date("2030-12-31"),
    status: "PLANNING",
    isFeatured: false,
  },
  {
    title: "Mpendae Affordable Housing",
    slug: "mpendae-affordable-housing",
    description: "Government-backed affordable housing project in Mpendae. 500 units across 15 acres with community facilities, school, and market. Phase I (150 units) currently seeking contractors for foundation and structure works.",
    projectType: "Residential Development",
    category: "residential",
    budget: 7500000,
    location: "Mpendae, Zanzibar",
    timelineStart: new Date("2025-06-01"),
    timelineEnd: new Date("2027-12-31"),
    status: "IN_PROGRESS",
    isFeatured: true,
  },
]

async function main() {
  const existingCount = await prisma.project.count()
  if (existingCount > 0) {
    console.log(`Database already has ${existingCount} projects. Skipping seed.`)
    return
  }

  const existingUser = await prisma.user.findFirst({ where: { role: "ADMIN" } })
  const buyerId = existingUser?.id || (
    await prisma.user.create({
      data: {
        email: "system@zanzibaba.com",
        name: "Zanzibaba System",
        role: "ADMIN",
        passwordHash: "seeded-system-account-no-login",
      },
    })
  ).id

  let created = 0
  for (const project of PROJECTS) {
    await prisma.project.create({
      data: {
        ...project,
        buyerId,
        status: project.status as string,
      },
    })
    created++
  }

  console.log(`Seeded ${created} projects successfully.`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Seed failed:", e)
  process.exit(1)
})
