import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if already shortlisted
    const existing = await prisma.shortlist.findUnique({
      where: {
        jobRequestId_applicantId: {
          jobRequestId: body.jobRequestId,
          applicantId: body.applicantId,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Applicant already shortlisted" }, { status: 400 })
    }

    const shortlist = await prisma.shortlist.create({
      data: {
        jobRequestId: body.jobRequestId,
        applicantId: body.applicantId,
        status: "pending",
      },
    })

    // Update applicant status if needed
    await prisma.applicant.update({
      where: { id: body.applicantId },
      data: { status: "shortlisted" },
    })

    return NextResponse.json(shortlist, { status: 201 })
  } catch (error: any) {
    console.error("Error creating shortlist:", error)
    return NextResponse.json({ error: "Failed to create shortlist" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const jobId = request.nextUrl.searchParams.get("jobId")

    const shortlists = await prisma.shortlist.findMany({
      where: {
        jobRequestId: jobId || undefined,
      },
      include: {
        applicant: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(shortlists)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch shortlists" }, { status: 500 })
  }
}
