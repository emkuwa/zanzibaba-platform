import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, password, companyName, role } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone: phone || null,
        role: role || "SUPPLIER",
      },
    })

    if (role === "SUPPLIER" || !role) {
      await prisma.supplierProfile.create({
        data: {
          userId: user.id,
          companyName: companyName || name,
        },
      })
    }

    const { passwordHash: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed", details: String(error) },
      { status: 500 }
    )
  }
}
