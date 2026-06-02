import { NextResponse } from "next/server"

export async function GET() {
  const envKey = process.env.GOOGLE_MAPS_API_KEY
  const envKeys = Object.keys(process.env).filter(k =>
    k.toLowerCase().includes("google") || k.toLowerCase().includes("maps") || k.toLowerCase().includes("places")
  )

  const envLocal = await import("fs").then(fs => {
    try {
      const content = fs.readFileSync(".env.local", "utf-8")
      const match = content.match(/^(?:export\s+)?GOOGLE_MAPS_API_KEY=(["']?)(.+?)\1$/m)
      if (match) return { exists: true, value: match[2].substring(0, 20) + "..." }
      return { exists: false, reason: "Variable not found in .env.local" }
    } catch { return { exists: false, reason: "Cannot read .env.local" } }
  }).catch(() => ({ exists: false, reason: "fs import failed" }))

  return NextResponse.json({
    detected: !!envKey,
    variableName: "GOOGLE_MAPS_API_KEY",
    variableLength: envKey ? envKey.length : 0,
    variablePrefix: envKey ? envKey.substring(0, 5) : null,
    usingLiveGoogleMaps: !!envKey && envKey.length > 5,
    envLocalFile: envLocal,
    matchingEnvKeys: envKeys,
    runtime: typeof window === "undefined" ? "server" : "browser",
    nodeEnv: process.env.NODE_ENV,
    nextRuntime: (process as any).nextRuntime || "unknown",
    pid: process.pid,
    cwd: process.cwd(),
  })
}
