import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        applicant: true,
      },
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json(payment)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const payment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        status: body.status,
        paymentDate: body.status === "completed" ? new Date() : null,
      },
      include: {
        applicant: true,
      },
    })

    return NextResponse.json(payment)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}
