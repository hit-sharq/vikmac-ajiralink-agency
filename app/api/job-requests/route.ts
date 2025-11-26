import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const jobRequests = await prisma.jobRequest.findMany({
      where: { status: "open" },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(jobRequests)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch job requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const jobRequest = await prisma.jobRequest.create({
      data: {
        employerId: body.employerId,
        category: body.category,
        country: body.country,
        numberOfWorkers: body.numberOfWorkers,
        salaryMin: body.salaryMin,
        salaryMax: body.salaryMax,
        currency: "USD",
        contractDuration: body.contractDuration,
        jobDescription: body.jobDescription,
        requiredExperience: body.requiredExperience,
        gender: body.gender || null,
        ageMin: body.ageMin || null,
        ageMax: body.ageMax || null,
        status: "open",
      },
    })

    return NextResponse.json(jobRequest, { status: 201 })
  } catch (error: any) {
    console.error("Error creating job request:", error)
    return NextResponse.json({ error: "Failed to create job request" }, { status: 500 })
  }
}
