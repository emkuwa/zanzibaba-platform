import { NextResponse } from "next/server"
import { runSocialDiscovery } from "@/lib/discovery-social/orchestrator"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const result = await runSocialDiscovery()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Social discovery error:", error)
    return NextResponse.json(
      { error: "Social discovery failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const [
      totalDiscovered,
      withInstagram,
      withFacebook,
      withLinkedIn,
      withWebsite,
      withGoogleMaps,
    ] = await Promise.all([
      prisma.discoveredLead.count({ where: { status: { in: ["DISCOVERED", "IMPORTED"] } } }),
      prisma.discoveredLead.count({ where: { instagramUrl: { not: null } } }),
      prisma.discoveredLead.count({ where: { facebookUrl: { not: null } } }),
      prisma.discoveredLead.count({ where: { linkedinUrl: { not: null } } }),
      prisma.discoveredLead.count({ where: { website: { not: null } } }),
      prisma.discoveredLead.count({ where: { sourcePlatform: "Google Maps" } }),
    ])

    return NextResponse.json({
      totalDiscovered,
      bySource: {
        instagram: withInstagram,
        facebook: withFacebook,
        linkedin: withLinkedIn,
        website: withWebsite,
        googleMaps: withGoogleMaps,
      },
      socialPresent: {
        anySocial: await prisma.discoveredLead.count({
          where: {
            OR: [
              { instagramUrl: { not: null } },
              { facebookUrl: { not: null } },
              { linkedinUrl: { not: null } },
            ],
          },
        }),
        noSocial: await prisma.discoveredLead.count({
          where: {
            AND: [
              { instagramUrl: null },
              { facebookUrl: null },
              { linkedinUrl: null },
            ],
          },
        }),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch social stats", details: String(error) },
      { status: 500 }
    )
  }
}
