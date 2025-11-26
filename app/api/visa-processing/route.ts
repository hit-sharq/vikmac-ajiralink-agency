import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const visaRecords = await prisma.visaProcessing.findMany({
      include: {
        applicant: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(visaRecords)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch visa records" }, { status: 500 })
  }
}
