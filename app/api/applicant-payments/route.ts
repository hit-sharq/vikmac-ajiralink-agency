import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const applicant = await prisma.applicant.findUnique({
      where: { email },
    })

    if (!applicant) {
      return NextResponse.json([])
    }

    const payments = await prisma.payment.findMany({
      where: {
        applicantId: applicant.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(payments)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}
