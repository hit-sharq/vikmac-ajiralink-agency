import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { findMatchingCareers } from '@/lib/matching'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { applicantId } = await request.json()

    if (!applicantId) {
      return NextResponse.json({ error: 'Applicant ID is required' }, { status: 400 })
    }

    // Find matching jobs
    const matches = await findMatchingCareers(applicantId)

    // Create auto-applications for matches
    const autoApplications = []
    for (const match of matches) {
      // Check if auto-application already exists
      const existing = await prisma.autoApplication.findFirst({
        where: {
          applicantId: applicantId,
          career: {
            id: match.career.id
          }
        }
      })

      if (!existing) {
        const autoApplication = await prisma.autoApplication.create({
          data: {
            applicantId: applicantId,
            careerId: match.career.id,
            matchScore: match.score,
          }
        })
        autoApplications.push(autoApplication)
      }
    }

    return NextResponse.json({
      message: `Created ${autoApplications.length} auto-applications for applicant`,
      autoApplications
    })
  } catch (error) {
    console.error('Error creating auto-applications for applicant:', error)
    return NextResponse.json({ error: 'Failed to create auto-applications' }, { status: 500 })
  }
}
