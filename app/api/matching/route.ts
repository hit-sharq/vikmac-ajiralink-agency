import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const jobRequests = await prisma.jobRequest.findMany({
      include: {
        employer: {
          select: {
            id: true,
            companyName: true,
            email: true,
          },
        },
        autoApplications: {
          include: {
            applicant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                category: true,
                nationality: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(jobRequests)
  } catch (error) {
    console.error('Error fetching matching data:', error)
    return NextResponse.json({ error: 'Failed to fetch matching data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobRequestId } = body

    if (!jobRequestId) {
      return NextResponse.json({ error: 'Job request ID is required' }, { status: 400 })
    }

    // Find matching applicants for the job request
    const matches = await findMatchingApplicants(jobRequestId)

    return NextResponse.json({
      message: `Found ${matches.length} matching applicants`,
      matches
    })
  } catch (error) {
    console.error('Error processing matching request:', error)
    return NextResponse.json({ error: 'Failed to process matching request' }, { status: 500 })
  }
}

// Helper function to find matching applicants
async function findMatchingApplicants(jobRequestId: string) {
  const jobRequest = await prisma.jobRequest.findUnique({
    where: { id: jobRequestId }
  })

  if (!jobRequest) {
    return []
  }

  // Get all applicants who have enabled auto-matching
  const applicants = await prisma.applicant.findMany({
    where: {
      status: { in: ['new', 'ready'] }
    },
    select: {
      id: true,
      category: true,
      nationality: true,
      yearsOfExperience: true,
      gender: true,
      dateOfBirth: true,
      passportNumber: true,
    }
  })

  // Calculate match scores (simplified version)
  const matches = applicants
    .map(applicant => ({
      applicant: applicant,
      score: calculateMatchScore(applicant, jobRequest)
    }))
    .filter(match => match.score >= 60)
    .sort((a, b) => b.score - a.score)

  return matches
}

// Simplified match score calculation
function calculateMatchScore(applicant: any, jobRequest: any): number {
  let score = 0

  if (applicant.category === jobRequest.category) score += 25
  if (applicant.nationality === jobRequest.country) score += 25
  if (applicant.yearsOfExperience >= jobRequest.requiredExperience) score += 20
  if (applicant.passportNumber && applicant.passportNumber.trim() !== '') score += 15

  return Math.min(score, 100)
}
