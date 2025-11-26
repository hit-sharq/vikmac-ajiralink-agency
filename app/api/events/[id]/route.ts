import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
    })
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }
    return NextResponse.json(event)
  } catch (error) {
    console.error("[v0] Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    console.log("Received PUT body for event:", body) // Log the request body for debugging

    const updateData: any = {}

    if (body.title && typeof body.title === 'string') updateData.title = body.title
    if (body.description && typeof body.description === 'string') updateData.description = body.description
    if (body.date) updateData.date = new Date(body.date)
    if (body.time && typeof body.time === 'string') updateData.time = body.time
    if (body.location && typeof body.location === 'string') updateData.location = body.location
    if (body.imageUrl || body.image) updateData.image = body.imageUrl || body.image
    if (body.category && typeof body.category === 'string') updateData.category = body.category
    if (body.registrationLink && typeof body.registrationLink === 'string') updateData.registrationLink = body.registrationLink

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json(event)
  } catch (error) {
    console.error("[v0] Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.event.delete({
      where: { id },
    })
    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
