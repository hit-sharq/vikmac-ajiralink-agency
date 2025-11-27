import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { findMatchingApplicants } from '@/lib/matching'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { jobRequestId } = await request.json()

    if (!jobRequestId) {
      return NextResponse.json({ error: 'Job request ID is required' }, { status: 400 })
    }

    // Find matching applicants
    const matches = await findMatchingApplicants(jobRequestId)

    // Create auto-applications for matches
    const autoApplications = []
    for (const match of matches) {
      // Check if auto-application already exists
      const existing = await prisma.autoApplication.findUnique({
        where: {
          applicantId_jobRequestId: {
            applicantId: match.applicant.id,
            jobRequestId: jobRequestId
          }
        }
      })

      if (!existing) {
        const autoApplication = await prisma.autoApplication.create({
          data: {
            applicantId: match.applicant.id,
            jobRequestId: jobRequestId,
            matchScore: match.score,
          }
        })
        autoApplications.push(autoApplication)
      }
    }

    return NextResponse.json({
      message: `Created ${autoApplications.length} auto-applications`,
      autoApplications
    })
  } catch (error) {
    console.error('Error creating auto-applications for job:', error)
    return NextResponse.json({ error: 'Failed to create auto-applications' }, { status: 500 })
  }
}
