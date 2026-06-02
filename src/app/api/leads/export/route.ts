import { NextResponse } from "next/server"
import { exportLeadsCSV } from "@/lib/leads/lead-store"

export async function GET() {
  const csv = exportLeadsCSV()

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=zanzibaba-leads.csv",
    },
  })
}
