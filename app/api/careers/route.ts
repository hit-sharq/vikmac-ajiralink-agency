import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const careers = await prisma.career.findMany({
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
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
        company: body.company,
        description: body.description,
        requirements: body.requirements,
        location: body.location,
        type: body.type,
        salary: body.salary,
        applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
        applicationLink: body.applicationLink,
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
