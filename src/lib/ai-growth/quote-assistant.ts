import { generateJSON, isAIEnabled } from "@/lib/ai/provider"
import type { QuoteDraft, QuoteItem } from "./types"

function generateQuoteNumber(): string {
  return `QTE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0]
}

function extractItems(text: string): QuoteItem[] {
  const lines = text.split("\n").filter(l => l.trim())
  const items: QuoteItem[] = []
  const pattern = /(.+?)\s*(?:x|\*)?\s*(\d+)?\s*(?:@|x)?\s*\$?([\d,]+(?:\.\d{1,2})?)?/i
  for (const line of lines) {
    const m = line.match(pattern)
    if (m) {
      const desc = m[1].trim()
      const qty = parseInt(m[2]) || 1
      const price = parseFloat(m[3]?.replace(/,/g, "")) || 0
      if (desc.length > 2) {
        items.push({ description: desc, quantity: qty, unit: "pieces", unitPrice: price, total: price * qty })
      }
    }
  }
  if (items.length === 0) {
    lines.forEach(l => {
      const t = l.replace(/^[-•*\d.)\s]+/, "").trim()
      if (t.length > 5 && t.length < 200) items.push({ description: t, quantity: 1, unit: "pieces", unitPrice: 0, total: 0 })
    })
  }
  return items
}

function generateFallbackQuote(rfqText: string, supplierName: string): QuoteDraft {
  const items = extractItems(rfqText)
  const subtotal = items.reduce((s, i) => s + i.total, 0)
  const tax = subtotal * 0.18
  return {
    quoteNumber: generateQuoteNumber(), date: formatDate(new Date()), validUntil: formatDate(new Date(Date.now() + 30 * 86400000)),
    supplierName, clientName: "Valued Client", projectName: "Construction Project",
    items, subtotal, tax, total: subtotal + tax, currency: "USD",
    terms: "Payment: 50% deposit, 50% on delivery. Valid for 30 days. Prices include delivery to Zanzibar.",
    coverLetter: `Dear Client,\n\nThank you for the opportunity to quote on your project. ${supplierName} is pleased to submit the following proposal for your review.\n\nWe are confident in our ability to deliver quality products and services that meet your requirements. Our team is committed to ensuring timely delivery and competitive pricing.\n\nPlease review the attached quotation and do not hesitate to contact us with any questions.\n\nBest regards,\n${supplierName}`,
    deliveryInfo: "Delivery within 5-7 business days. Free delivery within Zanzibar for orders over $1,000.",
  }
}

export async function generateQuote(rfqText: string, supplierName: string, clientName?: string): Promise<QuoteDraft> {
  if (isAIEnabled() && rfqText.length > 20) {
    const result = await generateJSON<QuoteDraft>(QUOTE_SYSTEM, `Generate a professional quotation for a construction project RFQ:
Supplier: ${supplierName}
Client: ${clientName || "Valued Client"}
RFQ Details: ${rfqText.substring(0, 3000)}

Return JSON with: quoteNumber, date (today ISO), validUntil (30 days out), supplierName, clientName, projectName, items (array of {description, quantity, unit, unitPrice, total}), subtotal, tax (18% VAT), total, currency, terms, coverLetter, deliveryInfo`)
    if (result) return result
  }
  return generateFallbackQuote(rfqText, supplierName)
}

const QUOTE_SYSTEM = "You are a Zanzibaba quote specialist. Generate professional construction quotations for East African markets."
