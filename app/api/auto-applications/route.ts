import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const autoApplications = await prisma.autoApplication.findMany({
      include: {
        applicant: true,
        career: true,
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(autoApplications)
  } catch (error) {
    console.error('Error fetching auto-applications:', error)
    return NextResponse.json({ error: 'Failed to fetch auto-applications' }, { status: 500 })
  }
}
