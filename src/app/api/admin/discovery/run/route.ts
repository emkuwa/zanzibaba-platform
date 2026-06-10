import { NextRequest, NextResponse } from "next/server"
import { runDiscoveryV2, importDiscoveryLeads } from "@/lib/discovery-v2/runner"
import { DISCOVERY_SOURCES, TARGET_COUNTRIES, SEARCH_TEMPLATES } from "@/lib/discovery-v2/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { queries, sources, country, category, preview } = body

    if (!queries || !Array.isArray(queries) || queries.length === 0) {
      return NextResponse.json({ error: "At least one query is required" }, { status: 400 })
    }

    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      return NextResponse.json({ error: "At least one source is required" }, { status: 400 })
    }

    const validSources = sources.filter((s: string) => DISCOVERY_SOURCES.includes(s as any))
    if (validSources.length === 0) {
      return NextResponse.json({ error: "No valid discovery sources selected" }, { status: 400 })
    }

    if (!country || !TARGET_COUNTRIES.includes(country as any)) {
      return NextResponse.json({ error: "Valid target country is required" }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json({ error: "Target category is required" }, { status: 400 })
    }

    const result = await runDiscoveryV2({
      queries,
      sources: validSources,
      country,
      category,
      preview: preview !== false,
    })

    if (preview === false) {
      const importResult = await importDiscoveryLeads(result.leads)
      return NextResponse.json({
        mode: "import",
        discovery: result,
        import: importResult,
      })
    }

    return NextResponse.json({
      mode: "preview",
      discovery: result,
    })
  } catch (error) {
    console.error("[V2 API] Discovery run failed:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Discovery run failed" },
      { status: 500 }
    )
  }
}
