import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { EntityListing } from "@/components/directory/entity-listing"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Partners Directory — Zanzibar | Zanzibaba",
  description: "Find industry partners and collaborators in the Zanzibar construction ecosystem.",
}

export default async function PartnersPage() {
  const items = await prisma.directoryEntity.findMany({
    where: { entityType: "partner", dataClassification: { notIn: ["TEST", "SYNTHETIC"] } },
    orderBy: [{ isFeatured: "desc" }, { avgRating: "desc" }, { name: "asc" }],
  })

  return (
    <EntityListing
      title="Partners Directory"
      description="Find industry partners and collaborators in the Zanzibar construction ecosystem."
      iconName="Handshake"
      entityTypes="partner"
      items={items.map((e) => ({
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
        verificationBadge: e.verificationBadge,
        isFeatured: e.isFeatured,
        avgRating: Number(e.avgRating),
        reviewCount: e.reviewCount,
        activationStatus: e.activationStatus,
        claimToken: e.claimToken,
        trustScore: e.trustScore,
      }))}
      total={items.length}
      entityLabel="Partner"
      entityLabelPlural="Partners"
    />
  )
}
