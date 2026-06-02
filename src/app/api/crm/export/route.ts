import { NextResponse } from "next/server"
import { exportCRMCSV } from "@/lib/crm/store"

export async function GET() {
  const csv = exportCRMCSV()

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=zanzibaba-crm-leads.csv",
    },
  })
}
