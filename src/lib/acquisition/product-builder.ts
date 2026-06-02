import type { DiscoveredLeadInput } from "@/lib/agents/core"

export async function extractProducts(
  leads: DiscoveredLeadInput[]
): Promise<{ productsExtracted: number; leads: DiscoveredLeadInput[] }> {
  let total = 0
  const resultLeads = leads.map((lead) => {
    if (lead.products && lead.products.length > 0) {
      total += lead.products.length
      return lead
    }

    const cats = lead.categoryLabels || ["building-materials"]
    const inferred = cats.slice(0, 3).map((cat) => {
      const catName = cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      return {
        name: `${catName} Products`,
        description: `Quality ${catName.toLowerCase()} supplied by ${lead.companyName} in ${lead.city || "Zanzibar"}. Contact for pricing and availability.`,
        category: cat,
      }
    })
    total += inferred.length
    return { ...lead, products: inferred }
  })

  return { productsExtracted: total, leads: resultLeads }
}
