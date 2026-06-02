import { NextResponse } from "next/server"
import { generateProfileDraft, type CompanyInfo } from "@/lib/ai/supplier-onboarding"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const info: CompanyInfo = {
      companyName: body.companyName || "",
      businessType: body.businessType || "Distributor",
      yearEstablished: body.yearEstablished || "",
      location: body.location || "",
      city: body.city || "",
      country: body.country || "Tanzania",
      contactName: body.contactName || "",
      email: body.email || "",
      phone: body.phone || "",
      website: body.website || "",
      description: body.description || "",
      productCategories: body.productCategories || [],
      productList: body.productList || [],
      certifications: body.certifications || [],
      targetMarkets: body.targetMarkets || ["Zanzibar"],
    }

    if (!info.companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }

    const draft = await generateProfileDraft(info)
    return NextResponse.json({ draft })
  } catch (error) {
    console.error("Supplier onboarding error:", error)
    return NextResponse.json({ error: "Failed to generate profile" }, { status: 500 })
  }
}
