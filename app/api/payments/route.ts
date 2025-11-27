import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(payments)
  } catch (error: any) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const payment = await prisma.payment.create({
      data: {
        applicantId: body.applicantId,
        employerId: body.employerId || null,
        type: body.type || "processing-fee",
        amount: body.amount,
        currency: body.currency || "USD",
        status: body.status || "pending",
        description: body.description || "",
      },
      include: {
        applicant: true,
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error: any) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
