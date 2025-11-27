import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, notes } = await request.json()

    if (!action || !['submit', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "submit" or "decline"' }, { status: 400 })
    }

    // Get the auto-application
    const autoApplication = await prisma.autoApplication.findUnique({
      where: { id: params.id },
      include: {
        applicant: true,
        jobRequest: {
          include: {
            employer: true
          }
        }
      }
    })

    if (!autoApplication) {
      return NextResponse.json({ error: 'Auto-application not found' }, { status: 404 })
    }

    if (autoApplication.status !== 'pending') {
      return NextResponse.json({ error: 'Application has already been processed' }, { status: 400 })
    }

    if (action === 'submit') {
      // Update auto-application status
      await prisma.autoApplication.update({
        where: { id: params.id },
        data: {
          status: 'submitted',
          reviewedAt: new Date(),
          submittedAt: new Date(),
          notes: notes || 'Auto-submitted application'
        }
      })

      // Create a shortlist record for staff review
      await prisma.shortlist.create({
        data: {
          jobRequestId: autoApplication.jobRequestId,
          applicantId: autoApplication.applicantId,
          status: 'pending',
          notes: 'Auto-submitted application pending staff review'
        }
      })

      return NextResponse.json({
        message: 'Application submitted successfully',
        autoApplication: {
          ...autoApplication,
          status: 'submitted',
          reviewedAt: new Date(),
          submittedAt: new Date()
        }
      })
    } else if (action === 'decline') {
      // Update auto-application status
      await prisma.autoApplication.update({
        where: { id: params.id },
        data: {
          status: 'declined',
          reviewedAt: new Date(),
          declinedAt: new Date(),
          notes: notes || 'Application declined by applicant'
        }
      })

      return NextResponse.json({
        message: 'Application declined',
        autoApplication: {
          ...autoApplication,
          status: 'declined',
          reviewedAt: new Date(),
          declinedAt: new Date()
        }
      })
    }
  } catch (error) {
    console.error('Error processing auto-application:', error)
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 })
  }
}
