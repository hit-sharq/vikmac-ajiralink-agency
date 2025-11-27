import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicantId = searchParams.get('applicantId')

    if (!applicantId) {
      return NextResponse.json({ error: 'Applicant ID is required' }, { status: 400 })
    }

    const autoApplications = await prisma.autoApplication.findMany({
      where: {
        applicantId: applicantId,
        status: 'pending'
      },
      include: {
        jobRequest: {
          include: {
            employer: true
          }
        }
      },
      orderBy: [
        { matchScore: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(autoApplications)
  } catch (error) {
    console.error('Error fetching auto-applications:', error)
    return NextResponse.json({ error: 'Failed to fetch auto-applications' }, { status: 500 })
  }
}
