import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const payment = await prisma.manualPayment.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } } },
  })

  if (!payment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (payment.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(payment)
}
