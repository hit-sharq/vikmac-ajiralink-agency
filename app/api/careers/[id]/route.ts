import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const career = await prisma.career.findUnique({
      where: { id: params.id }
    })

    if (!career) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 })
    }

    return NextResponse.json(career)
  } catch (error) {
    console.error('Error fetching career:', error)
    return NextResponse.json({ error: 'Failed to fetch career' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const career = await prisma.career.update({
      where: { id: params.id },
      data: {
        title: body.title,
        company: body.company,
        description: body.description,
        requirements: body.requirements,
        location: body.location,
        type: body.type,
        salary: body.salary,
        applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
        applicationUrl: body.applicationUrl,
        contactEmail: body.contactEmail,
        featured: body.featured,
      }
    })
    return NextResponse.json(career)
  } catch (error) {
    console.error('Error updating career:', error)
    return NextResponse.json({ error: 'Failed to update career' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.career.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ message: 'Career deleted successfully' })
  } catch (error) {
    console.error('Error deleting career:', error)
    return NextResponse.json({ error: 'Failed to delete career' }, { status: 500 })
  }
}
