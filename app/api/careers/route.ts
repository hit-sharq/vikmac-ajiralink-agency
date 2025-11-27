import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Function to trigger auto-matching for new job
async function triggerAutoMatching(jobRequestId: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/auto-match/job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobRequestId }),
    })

    if (response.ok) {
      console.log('Auto-matching triggered successfully for job:', jobRequestId)
    } else {
      console.error('Failed to trigger auto-matching for job:', jobRequestId, 'Status:', response.status)
    }
  } catch (error) {
    console.error('Error triggering auto-matching:', error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const careers = await prisma.career.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(careers)
  } catch (error) {
    console.error('Error fetching careers:', error)
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const career = await prisma.career.create({
      data: {
        title: body.title,
        description: body.description,
        company: body.company,
        location: body.location,
        type: body.type,
        salary: body.salary,
        commission: body.commission,
        commissionType: body.commissionType,
        applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
        applicationUrl: body.applicationUrl,
        contactEmail: body.contactEmail,
        featured: body.featured || false,
      }
    })
    return NextResponse.json(career, { status: 201 })
  } catch (error) {
    console.error('Error creating career:', error)
    return NextResponse.json({ error: 'Failed to create career' }, { status: 500 })
  }
}
