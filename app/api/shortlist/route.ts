import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status) {
      where.status = status
    }

    const shortlists = await prisma.shortlist.findMany({
      where,
      include: {
        applicant: true,
        jobRequest: {
          include: {
            employer: true
          }
        }
      },
      orderBy: [
        { updatedAt: 'desc' }
      ]
    })

    return NextResponse.json(shortlists)
  } catch (error) {
    console.error('Error fetching shortlists:', error)
    return NextResponse.json({ error: 'Failed to fetch shortlists' }, { status: 500 })
  }
}
