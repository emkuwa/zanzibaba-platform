import { prisma } from "@/lib/prisma"
import type { Prisma, ActivationStatus } from "@prisma/client"

export interface DirectoryQuery {
  entityType?: string | string[]
  status?: string[]
  country?: string
  city?: string
  categorySlug?: string
  search?: string
  featured?: boolean
  verified?: boolean
  sort?: "rating" | "newest" | "name"
  limit?: number
  offset?: number
}

export interface DirectoryResult {
  total: number
  items: Array<{
    id: string
    entityType: string
    slug: string
    name: string
    description: string | null
    categoryLabels: any
    country: string | null
    city: string | null
    website: string | null
    email: string | null
    phone: string | null
    logoUrl: string | null
    coverImageUrl: string | null
    flexibleFields: any
    membershipTier: string
    verificationStatus: string
    verificationBadge: boolean
    isFeatured: boolean
    profileViews: number
    avgRating: number
    reviewCount: number
    activationStatus: string
    claimToken: string | null
    trustScore: number
    createdAt: Date
  }>
}

function buildWhere(query: DirectoryQuery): Prisma.DirectoryEntityWhereInput {
  const defaultStatus: ActivationStatus[] = ["UNCLAIMED", "CLAIMED", "VERIFIED", "FEATURED"]
  const where: Prisma.DirectoryEntityWhereInput = {
    activationStatus: { in: (query.status ?? defaultStatus) as ActivationStatus[] },
  }

  if (query.entityType) {
    where.entityType = Array.isArray(query.entityType)
      ? { in: query.entityType }
      : query.entityType
  }

  if (query.country) where.country = query.country
  if (query.city) where.city = query.city
  if (query.featured) where.isFeatured = true
  if (query.verified) where.verificationStatus = "VERIFIED"
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
      { city: { contains: query.search, mode: "insensitive" } },
    ]
  }

  return where
}

function buildOrderBy(query: DirectoryQuery): Prisma.DirectoryEntityOrderByWithRelationInput[] {
  const orders: Prisma.DirectoryEntityOrderByWithRelationInput[] = [{ isFeatured: "desc" }]

  switch (query.sort) {
    case "rating":
      orders.push({ avgRating: "desc" })
      break
    case "newest":
      orders.push({ createdAt: "desc" })
      break
    case "name":
      orders.push({ name: "asc" })
      break
    default:
      orders.push({ avgRating: "desc" }, { name: "asc" })
  }

  return orders
}

export async function queryDirectory(query: DirectoryQuery): Promise<DirectoryResult> {
  const where = buildWhere(query)
  const orderBy = buildOrderBy(query)
  const take = Math.min(query.limit ?? 50, 200)
  const skip = query.offset ?? 0

  const [total, items] = await Promise.all([
    prisma.directoryEntity.count({ where }),
    prisma.directoryEntity.findMany({
      where,
      orderBy,
      take,
      skip,
    }),
  ])

  return {
    total,
    items: items.map((e) => ({
      id: e.id,
      entityType: e.entityType,
      slug: e.slug,
      name: e.name,
      description: e.description,
      categoryLabels: e.categoryLabels,
      country: e.country,
      city: e.city,
      website: e.website,
      email: e.email,
      phone: e.phone,
      logoUrl: e.logoUrl,
      coverImageUrl: e.coverImageUrl,
      flexibleFields: e.flexibleFields,
      membershipTier: e.membershipTier,
      verificationStatus: e.verificationStatus,
      verificationBadge: e.verificationBadge,
      isFeatured: e.isFeatured,
      profileViews: e.profileViews,
      avgRating: Number(e.avgRating),
      reviewCount: e.reviewCount,
      activationStatus: e.activationStatus,
      claimToken: e.claimToken,
      trustScore: e.trustScore,
      createdAt: e.createdAt,
    })),
  }
}

export async function getDirectoryBySlug(slug: string) {
  return prisma.directoryEntity.findUnique({ where: { slug } })
}

export async function getDirectoryByEntity(
  entityType: string,
  entityId: string
) {
  return prisma.directoryEntity.findUnique({
    where: { entityType_entityId: { entityType, entityId } },
  })
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
}

export async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || "entity"
  const candidate = base
  const existing = await prisma.directoryEntity.findUnique({ where: { slug: candidate } })
  if (!existing) return candidate

  let suffix = 1
  while (true) {
    const next = `${base}-${suffix}`
    const exists = await prisma.directoryEntity.findUnique({ where: { slug: next } })
    if (!exists) return next
    suffix++
  }
}
