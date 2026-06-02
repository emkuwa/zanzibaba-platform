import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

let counter = 1

function nextEmail(prefix: string): string {
  return `${prefix}${counter++}@temp.zanzibaba.com`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body as {
      type: "supplier" | "contractor" | "professional"
      data: Record<string, unknown>
    }

    if (!type || !data) {
      return NextResponse.json(
        { error: "Missing required fields: type, data" },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash("password123", 12)

    if (type === "supplier") {
      const companyName = (data.companyName as string) || "Unnamed Supplier"
      const email =
        (data.email as string) || nextEmail("supplier")
      const phone = (data.phone as string) || "+255777000000"

      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: `Email ${email} already exists` },
          { status: 409 }
        )
      }

      const user = await prisma.user.create({
        data: {
          email,
          name: companyName,
          passwordHash,
          phone,
          role: "SUPPLIER",
          supplierProfile: {
            create: {
              companyName,
              city: (data.location as string) || null,
              companyDescription:
                (data.description as string) || null,
              yearEstablished: data.yearEstablished
                ? Number(data.yearEstablished)
                : null,
            },
          },
        },
        include: { supplierProfile: true },
      })

      return NextResponse.json({
        id: user.id,
        companyName: user.supplierProfile?.companyName,
        email: user.email,
        message: "Supplier created successfully",
      })
    }

    if (type === "contractor") {
      const companyName =
        (data.companyName as string) || "Unnamed Contractor"
      const email =
        (data.email as string) || nextEmail("contractor")
      const phone = (data.phone as string) || "+255777000000"

      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: `Email ${email} already exists` },
          { status: 409 }
        )
      }

      const user = await prisma.user.create({
        data: {
          email,
          name: companyName,
          passwordHash,
          phone,
          role: "CONTRACTOR",
          contractorProfile: {
            create: {
              companyName,
              city: (data.location as string) || null,
              specialties: data.specialties
                ? JSON.parse(JSON.stringify(data.specialties))
                : null,
            },
          },
        },
        include: { contractorProfile: true },
      })

      return NextResponse.json({
        id: user.id,
        companyName: user.contractorProfile?.companyName,
        email: user.email,
        message: "Contractor created successfully",
      })
    }

    if (type === "professional") {
      const fullName = (data.fullName as string) || "Unnamed Professional"
      const email =
        (data.email as string) || nextEmail("professional")
      const phone = (data.phone as string) || "+255777000000"
      const professionalType = (data.professionalType as string) || "ARCHITECT"

      const validTypes = ["ARCHITECT", "ENGINEER", "SURVEYOR"]
      const resolvedType = validTypes.includes(professionalType)
        ? professionalType
        : "ARCHITECT"

      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: `Email ${email} already exists` },
          { status: 409 }
        )
      }

      const user = await prisma.user.create({
        data: {
          email,
          name: fullName,
          passwordHash,
          phone,
          role: "PROFESSIONAL",
          professionalProfile: {
            create: {
              fullName,
              professionalType: resolvedType as "ARCHITECT" | "ENGINEER" | "SURVEYOR",
              city: (data.location as string) || null,
            },
          },
        },
        include: { professionalProfile: true },
      })

      return NextResponse.json({
        id: user.id,
        fullName: user.professionalProfile?.fullName,
        email: user.email,
        message: "Professional created successfully",
      })
    }

    return NextResponse.json(
      { error: `Unknown type: ${type}` },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Seed creation failed",
      },
      { status: 500 }
    )
  }
}
