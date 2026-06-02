import { generateJSON, isAIEnabled } from "./provider"
import { categorizeByKeywords } from "@/lib/agents/core"

export interface UploadedFile {
  name: string
  type: string
  size: number
  content?: string
}

export interface RFQRequirement {
  item: string
  quantity: number
  unit: string
  notes: string
}

export interface RFQDraft {
  title: string
  description: string
  projectType: string
  projectName: string
  requirements: RFQRequirement[]
  categories: string[]
  suggestedSuppliers: string[]
  budgetMin: number
  budgetMax: number
  currency: string
  quantity: number
  unit: string
  deliveryLocation: string
  timeline: string
}

const projectTypes = [
  "Hotel Construction",
  "Resort Development",
  "Villa Construction",
  "Commercial Building",
  "Residential Apartment",
  "Hospitality Renovation",
  "Infrastructure",
  "Industrial",
  "Mixed-Use Development",
  "Other",
]

const commonSuppliers = [
  "Q-Blocks",
  "Sulan Cement",
  "Vonzenj Hardware",
  "Azam Building Solutions",
  "Mkonge Hardware",
  "Al-Maktoum Building Supplies",
  "Mohamed Enterprises",
  "Zanzibar Cement Centre",
  "Jomvu Building Supplies",
  "Tawakal Hardware",
  "Darajani Hardware",
  "Fumba Construction Supplies",
]

const SUPPLIER_CATEGORIES: Record<string, string[]> = {
  "building-materials": ["Q-Blocks", "Sulan Cement", "Azam Building Solutions", "Mkonge Hardware"],
  "furniture": ["Vonzenj Hardware", "Mohamed Enterprises"],
  "sanitary": ["Al-Maktoum Building Supplies", "Jomvu Building Supplies"],
  "electrical": ["Tawakal Hardware", "Darajani Hardware"],
  "prefab-houses": ["Fumba Construction Supplies"],
  "hospitality-equipment": ["Mohamed Enterprises", "Al-Maktoum Building Supplies"],
  "finishes": ["Jomvu Building Supplies", "Zanzibar Cement Centre"],
}

export function getProjectTypes(): string[] {
  return projectTypes
}

function extractBudget(text: string): { min: number; max: number; currency: string } {
  const currencyMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*(USD|TZS|EUR|KES)/gi)
  const amounts: number[] = []
  let currency = "USD"
  if (currencyMatch) {
    currencyMatch.forEach((m) => {
      const parts = m.match(/([\d,]+(?:\.\d{1,2})?)\s*(USD|TZS|EUR|KES)/i)
      if (parts) {
        amounts.push(parseFloat(parts[1].replace(/,/g, "")))
        currency = parts[2].toUpperCase()
      }
    })
  }
  if (amounts.length === 0) return { min: 0, max: 0, currency: "USD" }
  return {
    min: Math.min(...amounts),
    max: Math.max(...amounts),
    currency,
  }
}

function extractRequirements(text: string): RFQRequirement[] {
  const lines = text.split("\n").filter((l) => l.trim())
  const requirements: RFQRequirement[] = []
  const qtyPattern = /(\d+)\s*(x|pieces|units|kg|tons|m|sqm|boxes|pcs|bags|sheets|ltrs)/i
  const itemPattern = /^[-•*]\s*(.+)/

  for (const line of lines) {
    const trimmed = line.trim()
    const qtyMatch = trimmed.match(qtyPattern)
    const itemMatch = trimmed.match(itemPattern)

    if (qtyMatch) {
      const qty = parseInt(qtyMatch[1])
      const unit = qtyMatch[2].toLowerCase()
      const itemText = trimmed.replace(qtyMatch[0], "").trim()
      requirements.push({
        item: itemText || "Unspecified item",
        quantity: qty,
        unit,
        notes: "",
      })
    } else if (itemMatch) {
      requirements.push({
        item: itemMatch[1].trim(),
        quantity: 0,
        unit: "pieces",
        notes: "",
      })
    }
  }

  return requirements
}

function detectProjectType(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes("hotel") || lower.includes("resort")) return "Hotel Construction"
  if (lower.includes("villa")) return "Villa Construction"
  if (lower.includes("apartment") || lower.includes("residential")) return "Residential Apartment"
  if (lower.includes("commercial") || lower.includes("office") || lower.includes("retail")) return "Commercial Building"
  if (lower.includes("hospitality") || lower.includes("restaurant") || lower.includes("bar")) return "Hospitality Renovation"
  if (lower.includes("infrastructure") || lower.includes("road") || lower.includes("bridge")) return "Infrastructure"
  if (lower.includes("industrial") || lower.includes("factory") || lower.includes("warehouse")) return "Industrial"
  if (lower.includes("mixed") || lower.includes("development")) return "Mixed-Use Development"
  return "Other"
}

function extractTimeline(text: string): string {
  const lower = text.toLowerCase()
  const patterns = [
    /(\d+)[\s-]*(week|month|day)/gi,
    /(immediate|urgent|asap)/i,
    /(\d{4})/,
  ]
  for (const pattern of patterns) {
    const match = lower.match(pattern)
    if (match) return match[0]
  }
  return "To be confirmed"
}

function extractLocation(text: string): string {
  const locations = [
    "Stone Town",
    "Zanzibar",
    "Dar es Salaam",
    "Pemba",
    "Unguja",
    "Nungwi",
    "Kendwa",
    "Paje",
    "Jambiani",
    "Fumba",
    "Mtoni",
  ]
  for (const loc of locations) {
    if (text.toLowerCase().includes(loc.toLowerCase())) return loc
  }
  return "Zanzibar"
}

function suggestSuppliers(categories: string[]): string[] {
  const suggested = new Set<string>()
  for (const cat of categories) {
    const suppliers = SUPPLIER_CATEGORIES[cat]
    if (suppliers) suppliers.forEach((s) => suggested.add(s))
  }
  if (suggested.size === 0) {
    commonSuppliers.slice(0, 3).forEach((s) => suggested.add(s))
  }
  return Array.from(suggested)
}

export async function generateRFQDraft(
  textContent: string,
  uploadedFiles: UploadedFile[]
): Promise<RFQDraft> {
  const allText = [textContent, ...uploadedFiles.map((f) => f.content || "").filter(Boolean)].join("\n")
  const projectType = detectProjectType(allText)
  const categories = categorizeByKeywords(allText, "")
  const budget = extractBudget(allText)
  const requirements = extractRequirements(allText)

  if (isAIEnabled() && allText.trim().length > 20) {
    const systemPrompt = `You are a Zanzibaba RFQ specialist. Extract structured procurement requirements from construction project documents.`
    const prompt = `Analyze this project document and extract RFQ information. Return JSON only.

Document text:
${allText.substring(0, 4000)}

Return JSON with fields:
- title (short RFQ title)
- description (2-3 sentence summary of needs)
- projectType (one of: ${projectTypes.join(", ")})
- projectName (name of project if identifiable)
- requirements (array of {item, quantity, unit, notes})
- categories (array of slugs from: building-materials, furniture, kitchens, sanitary, lighting, doors-windows, electrical, hvac, finishes, prefab-houses, hospitality-equipment, landscaping, tools, security, paints, steel, roofing, aggregates)
- budgetMin (number)
- budgetMax (number)
- currency (USD/TZS/EUR)
- deliveryLocation (string)
- timeline (string)`

    const aiResult = await generateJSON<{
      title: string
      description: string
      projectType: string
      projectName: string
      requirements: { item: string; quantity: number; unit: string; notes: string }[]
      categories: string[]
      budgetMin: number
      budgetMax: number
      currency: string
      deliveryLocation: string
      timeline: string
    }>(systemPrompt, prompt)

    if (aiResult) {
      return {
        title: aiResult.title,
        description: aiResult.description,
        projectType: aiResult.projectType,
        projectName: aiResult.projectName,
        requirements: aiResult.requirements,
        categories: aiResult.categories.length > 0 ? aiResult.categories : categories,
        suggestedSuppliers: suggestSuppliers(aiResult.categories.length > 0 ? aiResult.categories : categories),
        budgetMin: aiResult.budgetMin || budget.min,
        budgetMax: aiResult.budgetMax || budget.max,
        currency: aiResult.currency || budget.currency,
        quantity: 1,
        unit: "pieces",
        deliveryLocation: aiResult.deliveryLocation || extractLocation(allText),
        timeline: aiResult.timeline || extractTimeline(allText),
      }
    }
  }

  return {
    title: `RFQ: ${projectType} - ${allText.substring(0, 60)}...`,
    description: allText.substring(0, 500),
    projectType,
    projectName: "",
    requirements,
    categories,
    suggestedSuppliers: suggestSuppliers(categories),
    budgetMin: budget.min,
    budgetMax: budget.max,
    currency: budget.currency,
    quantity: 1,
    unit: "pieces",
    deliveryLocation: extractLocation(allText),
    timeline: extractTimeline(allText),
  }
}
