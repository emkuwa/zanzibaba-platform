import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  parseCSV,
  mapSupplierFields,
  mapProductFields,
  validateSupplierData,
  validateProductData,
  detectDuplicates,
} from "@/lib/import/csv-parser"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, mapping, type } = body as {
      content: string
      mapping: Record<string, string>
      type: "suppliers" | "products"
    }

    if (!content || !mapping || !type) {
      return NextResponse.json(
        { error: "Missing required fields: content, mapping, type" },
        { status: 400 }
      )
    }

    const rows = parseCSV(content)

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "CSV file is empty or has no data rows" },
        { status: 400 }
      )
    }

    const results: {
      imported: number
      failed: number
      skipped: number
      errors: { row: number; message: string }[]
      warnings: { row: number; message: string }[]
    } = { imported: 0, failed: 0, skipped: 0, errors: [], warnings: [] }

    const mappedData = rows.map(row =>
      type === "suppliers" ? mapSupplierFields(row, mapping) : mapProductFields(row, mapping)
    )
    const duplicates = detectDuplicates(mappedData as any, type)
    for (const [rowIdx, msgs] of duplicates) {
      results.warnings.push({ row: rowIdx + 2, message: msgs.join("; ") })
    }

    if (type === "suppliers") {
      for (let i = 0; i < rows.length; i++) {
        const data = mapSupplierFields(rows[i], mapping)
        const validation = validateSupplierData(data)

        if (!validation.valid) {
          results.failed++
          results.errors.push({
            row: i + 2,
            message: validation.errors.join("; "),
          })
          continue
        }

        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
          })

          if (existingUser) {
            results.skipped++
            results.errors.push({
              row: i + 2,
              message: `Email ${data.email} already exists`,
            })
            continue
          }

          const passwordHash = await bcrypt.hash("password123", 12)

          await prisma.user.create({
            data: {
              email: data.email,
              name: data.companyName,
              passwordHash,
              phone: data.phone || null,
              role: "SUPPLIER",
              supplierProfile: {
                create: {
                  companyName: data.companyName,
                  city: data.city || null,
                  country: data.country || "Tanzania",
                  companyDescription: data.description || null,
                  website: data.website || null,
                  whatsappNumber: data.whatsapp || null,
                },
              },
            },
          })

          results.imported++
        } catch (error) {
          results.failed++
          results.errors.push({
            row: i + 2,
            message:
              error instanceof Error ? error.message : "Unknown error",
          })
        }
      }
    } else if (type === "products") {
      for (let i = 0; i < rows.length; i++) {
        const data = mapProductFields(rows[i], mapping)
        const validation = validateProductData(data)

        if (!validation.valid) {
          results.failed++
          results.errors.push({
            row: i + 2,
            message: validation.errors.join("; "),
          })
          continue
        }

        try {
          const category = data.categorySlug
            ? await prisma.category.findUnique({
                where: { slug: data.categorySlug },
              })
            : null

          if (!category) {
            results.failed++
            results.errors.push({
              row: i + 2,
              message: `Category "${data.categorySlug}" not found`,
            })
            continue
          }

          let supplierId: string | null = null

          if (data.supplierEmail) {
            const supplierUser = await prisma.user.findUnique({
              where: { email: data.supplierEmail },
              include: { supplierProfile: true },
            })

            if (supplierUser?.supplierProfile) {
              supplierId = supplierUser.supplierProfile.id
            }
          }

          if (!supplierId) {
            results.skipped++
            results.errors.push({
              row: i + 2,
              message: `Supplier not found for "${data.supplierEmail || data.supplierName}"`,
            })
            continue
          }

          const slug =
            data.name
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/[\s_]+/g, "-")
              .replace(/^-+|-+$/g, "") +
            "-" +
            Date.now()

          await prisma.product.create({
            data: {
              supplierId,
              categoryId: category.id,
              name: data.name,
              slug,
              description: data.description || null,
              price: data.price ? data.price : null,
              moq: data.moq || null,
              unit: data.unit || null,
            },
          })

          results.imported++
        } catch (error) {
          results.failed++
          results.errors.push({
            row: i + 2,
            message:
              error instanceof Error ? error.message : "Unknown error",
          })
        }
      }
    }

    for (const [i, row] of rows.entries()) {
      const data = mappedData[i]
      const validation = type === "suppliers"
        ? validateSupplierData(data as any)
        : validateProductData(data as any)

      if (validation.warnings.length > 0) {
        results.warnings.push({ row: i + 2, message: validation.warnings.join("; ") })
      }
    }

    return NextResponse.json({
      total: rows.length,
      ...results,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Import failed",
      },
      { status: 500 }
    )
  }
}
