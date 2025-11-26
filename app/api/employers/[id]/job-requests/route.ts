import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobRequests = await prisma.jobRequest.findMany({
      where: {
        employerId: params.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(jobRequests)
  } catch (error: any) {
    console.error("Error fetching job requests:", error)
    return NextResponse.json({ error: "Failed to fetch job requests" }, { status: 500 })
  }
}
