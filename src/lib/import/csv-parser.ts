export interface SupplierInput {
  companyName: string
  email: string
  phone?: string
  city?: string
  country?: string
  description?: string
  website?: string
  whatsapp?: string
  yearEstablished?: number
  categorySlug?: string
}

export interface ProductInput {
  name: string
  supplierEmail?: string
  supplierName?: string
  categorySlug: string
  description?: string
  price?: number
  moq?: number
  unit?: string
}

export function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split(/\r?\n/)
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const result: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length === 0 || values.every((v) => !v.trim())) continue

    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header.trim()] = (values[index] || "").trim()
    })
    result.push(row)
  }

  return result
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ",") {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
  }
  result.push(current.trim())

  return result
}

export function mapSupplierFields(
  row: Record<string, string>,
  mapping: Record<string, string>
): SupplierInput {
  return {
    companyName: row[mapping.companyName] || "",
    email: row[mapping.email] || "",
    phone: row[mapping.phone],
    city: row[mapping.city],
    country: row[mapping.country] || "Tanzania",
    description: row[mapping.description],
    website: row[mapping.website],
    whatsapp: row[mapping.whatsapp],
    yearEstablished: row[mapping.yearEstablished]
      ? Number(row[mapping.yearEstablished])
      : undefined,
    categorySlug: row[mapping.categorySlug],
  }
}

export function mapProductFields(
  row: Record<string, string>,
  mapping: Record<string, string>
): ProductInput {
  return {
    name: row[mapping.name] || "",
    supplierEmail: row[mapping.supplierEmail],
    supplierName: row[mapping.supplierName],
    categorySlug: row[mapping.categorySlug] || "",
    description: row[mapping.description],
    price: row[mapping.price] ? Number(row[mapping.price]) : undefined,
    moq: row[mapping.moq] ? Number(row[mapping.moq]) : undefined,
    unit: row[mapping.unit],
  }
}

export function validateSupplierData(
  data: SupplierInput
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data.companyName) errors.push("Company name is required")
  else if (data.companyName.length < 2) errors.push("Company name is too short")

  if (!data.email) errors.push("Email is required")
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.push("Invalid email format")

  if (data.phone && !/^\+?[\d\s\-()]{7,15}$/.test(data.phone))
    warnings.push(`Phone number "${data.phone}" may be invalid`)

  if (data.website && !/^https?:\/\/.+/.test(data.website))
    warnings.push(`Website "${data.website}" should start with http:// or https://`)

  if (data.yearEstablished && (data.yearEstablished < 1950 || data.yearEstablished > new Date().getFullYear()))
    warnings.push(`Year established ${data.yearEstablished} seems out of range`)

  return { valid: errors.length === 0, errors, warnings }
}

export function validateProductData(
  data: ProductInput
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data.name) errors.push("Product name is required")
  else if (data.name.length < 2) errors.push("Product name is too short")

  if (!data.categorySlug) errors.push("Category is required")

  if (data.price !== undefined && data.price < 0)
    errors.push("Price cannot be negative")
  if (data.price !== undefined && data.price > 1_000_000_000)
    warnings.push("Price seems unusually high")
  if (data.moq !== undefined && data.moq < 1)
    warnings.push("MOQ should be at least 1")

  return { valid: errors.length === 0, errors, warnings }
}

export function detectDuplicates(
  rows: SupplierInput[] | ProductInput[],
  type: "suppliers" | "products"
): Map<number, string[]> {
  const duplicates = new Map<number, string[]>()
  const seenEmails = new Map<string, number[]>()
  const seenNames = new Map<string, number[]>()

  rows.forEach((row, index) => {
    if ("email" in row && row.email) {
      const existing = seenEmails.get(row.email.toLowerCase()) || []
      existing.push(index)
      seenEmails.set(row.email.toLowerCase(), existing)
    }
    if ("name" in row && row.name) {
      const existing = seenNames.get(row.name.toLowerCase()) || []
      existing.push(index)
      seenNames.set(row.name.toLowerCase(), existing)
    }
  })

  seenEmails.forEach((indices) => {
    if (indices.length > 1) {
      indices.forEach((idx) => {
        const msgs = duplicates.get(idx) || []
        msgs.push(`Duplicate email: row ${indices.map(i => i + 2).join(", ")}`)
        duplicates.set(idx, msgs)
      })
    }
  })

  if (type === "products") {
    seenNames.forEach((indices) => {
      if (indices.length > 1) {
        indices.forEach((idx) => {
          const msgs = duplicates.get(idx) || []
          msgs.push(`Duplicate product name: row ${indices.map(i => i + 2).join(", ")}`)
          duplicates.set(idx, msgs)
        })
      }
    })
  }

  return duplicates
}

export function generateSampleCSV(type: "suppliers" | "products"): string {
  if (type === "suppliers") {
    return `companyName,email,phone,city,country,description,website,categorySlug
Sunset Building Supplies,sunset@example.com,+255777123456,Stone Town,Tanzania,Leading supplier of building materials in Zanzibar,https://sunsetbuild.com,cement
Ocean View Materials,oceanview@example.com,+255777789012,Mkunazini,Tanzania,High-quality construction materials,https://oceanview.co.tz,tiles
Zanzibar Hardware Mart,zhmart@example.com,+255777345678,Nungwi,Tanzania,Complete hardware solutions,https://zhmart.com,plumbing`
  }

  return `name,supplierEmail,categorySlug,description,price,moq,unit
Portland Cement 50kg,sunset@example.com,cement,High-strength Portland cement,12.50,100,bags
Ceramic Floor Tiles 60x60,oceanview@example.com,tiles,Premium ceramic floor tiles,8.75,50,boxes
PVC Pipes 4-inch,zhmart@example.com,plumbing,Durable PVC pipes for construction,3.20,200,pieces`
}
