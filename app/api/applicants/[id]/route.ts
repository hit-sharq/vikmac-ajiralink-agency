import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    const applicant = await prisma.applicant.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json(applicant)
  } catch (error: any) {
    console.error("Error updating applicant:", error)
    return NextResponse.json({ error: "Failed to update applicant" }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicant = await prisma.applicant.findUnique({
      where: { id: params.id },
      include: {
        documents: true,
        workExperience: true,
        certifications: true,
        visaProcessing: true,
        payments: true,
        shortlists: true,
        autoApplications: true,
      },
    })

    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
    }

    return NextResponse.json(applicant)
  } catch (error: any) {
    console.error("Error fetching applicant:", error)
    return NextResponse.json({ error: "Failed to fetch applicant" }, { status: 500 })
  }
}
