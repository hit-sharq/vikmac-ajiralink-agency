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
      include: {
        workExperience: true,
        certifications: true,
        visaProcessing: true,
      },
    })

    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
    }

    return NextResponse.json(applicant)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch applicant" }, { status: 500 })
  }
}
