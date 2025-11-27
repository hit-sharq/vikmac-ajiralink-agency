
import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function calculateMatchScore(applicant: any, jobRequest: any): number {
  let score = 0

  // Category match (40 points)
  if (applicant.category.toLowerCase() === jobRequest.category.toLowerCase()) {
    score += 40
  }

  // Experience match (30 points)
  if (applicant.yearsOfExperience >= jobRequest.requiredExperience) {
    score += 30
  } else if (applicant.yearsOfExperience >= jobRequest.requiredExperience - 1) {
    score += 15
  }

  // Gender preference match (10 points)
  if (jobRequest.gender) {
    if (applicant.gender === jobRequest.gender) {
      score += 10
    }
  } else {
    score += 10
  }

  // Status checks (20 points)
  if (applicant.trainingCompleted) {
    score += 10
  }
  if (applicant.medicalClearance) {
    score += 10
  }

  return Math.min(100, score)
}

export async function GET(request: NextRequest) {
  try {
    const jobId = request.nextUrl.searchParams.get("jobId")

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    const jobRequest = await prisma.jobRequest.findUnique({
      where: { id: jobId },
    })

    if (!jobRequest) {
      return NextResponse.json({ error: "Job request not found" }, { status: 404 })
    }

    // Find applicants with status ready or higher
    const applicants = await prisma.applicant.findMany({
      where: {
        status: {
          in: ["ready", "shortlisted", "selected"],
        },
      },
    })

    // Calculate match scores
    const matches = applicants
      .map((applicant) => ({
        applicant,
        matchScore: calculateMatchScore(applicant, jobRequest),
      }))
      .filter((match) => match.matchScore >= 50)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20) // Top 20 matches

    return NextResponse.json(matches)
  } catch (error: any) {
    console.error("Error finding matches:", error)
    return NextResponse.json({ error: "Failed to find matches" }, { status: 500 })
  }
}
