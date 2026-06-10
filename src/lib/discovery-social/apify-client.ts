import type { SocialLead, SourceAttribution, DiscoverySource } from "./types"

const APIFY_TOKEN = process.env.APIFY_API_KEY || ""

function isApifyEnabled(): boolean {
  return APIFY_TOKEN.length > 0
}

const APIFY_BASE = "https://api.apify.com/v2"

async function runApifyActor(
  actorId: string,
  input: Record<string, unknown>,
  timeoutMs = 120000
): Promise<any[]> {
  const runRes = await fetch(
    `${APIFY_BASE}/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  )
  if (!runRes.ok) {
    const err = await runRes.text()
    throw new Error(`Apify run failed (${runRes.status}): ${err.slice(0, 200)}`)
  }
  const runData = await runRes.json()
  const runId = runData.data.id
  const datasetId = runData.data.defaultDatasetId

  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 5000))
    const statusRes = await fetch(
      `${APIFY_BASE}/acts/${actorId}/runs/${runId}?token=${APIFY_TOKEN}`
    )
    const statusData = await statusRes.json()
    const status = statusData.data?.status

    if (status === "SUCCEEDED") {
      if (datasetId) {
        const itemsRes = await fetch(
          `${APIFY_BASE}/datasets/${datasetId}/items?token=${APIFY_TOKEN}&format=json`
        )
        return itemsRes.json()
      }
      return []
    }
    if (status === "FAILED" || status === "ABORTED" || status === "TIMED-OUT") {
      return []
    }
  }
  return []
}

export { isApifyEnabled, runApifyActor }
