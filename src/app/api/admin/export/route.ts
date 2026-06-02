import { NextRequest, NextResponse } from "next/server"

const reportData: Record<string, { headers: string[]; rows: string[][] }> = {
  "supplier-acquisition": {
    headers: ["Company Name", "Email", "Category", "Products", "Verified", "Joined Date", "Membership"],
    rows: [
      ["Zanzibar Cement Ltd", "info@zanzibarcement.com", "Building Materials", "85", "Yes", "2025-03-15", "Premium"],
      ["Swahili Build Mart", "sales@swahilibuild.com", "Building Materials", "320", "Yes", "2025-03-18", "Premium"],
      ["Ocean View Interiors", "hello@oceanview.co.tz", "Furniture", "156", "Yes", "2025-03-22", "Professional"],
      ["Spice Island Hardware", "orders@spiceisland.com", "Building Materials", "450", "Yes", "2025-04-01", "Professional"],
    ],
  },
  "product-catalog": {
    headers: ["Product Name", "Supplier", "Category", "Price", "MOQ", "Unit", "Status"],
    rows: [
      ["Portland Cement 50kg", "Zanzibar Cement Ltd", "Cement", "$12.50", "100", "bags", "Active"],
      ["Ceramic Floor Tiles 60x60", "Ocean View Interiors", "Tiles", "$8.75", "50", "boxes", "Active"],
      ["PVC Pipes 4-inch", "Spice Island Hardware", "Plumbing", "$3.20", "200", "pieces", "Active"],
    ],
  },
  "rfq-analysis": {
    headers: ["RFQ Title", "Category", "Budget Min", "Budget Max", "Quotes", "Status", "Created"],
    rows: [
      ["Hotel Bathroom Fixtures", "Sanitary", "$5,000", "$15,000", "7", "Open", "2025-05-01"],
      ["School Building Materials", "Building Materials", "$50,000", "$100,000", "4", "Quoting", "2025-04-28"],
    ],
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const report = searchParams.get("report")
  const format = searchParams.get("format") || "csv"

  if (!report || !reportData[report]) {
    return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
  }

  const data = reportData[report]
  const csv = [data.headers.join(","), ...data.rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${report}-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}
