import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import logger from "@/lib/logger"
import { z } from "zod"
import sanitizeHtml from "sanitize-html"

const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  date: z.string().min(1),
  time: z.string().min(1).max(50),
  location: z.string().min(1).max(200),
  image: z.string().optional(),
  category: z.string().max(100).optional(),
  registrationLink: z.string().optional(),
  isStaple: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get('upcoming') === 'true'

    const where = upcoming ? {
      date: {
        gte: new Date()
      }
    } : {}

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "desc" },
    })
    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    logger.error("[v0] Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createEventSchema.safeParse(body)
    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error.issues)
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Sanitize description
    const sanitizedDescription = sanitizeHtml(validatedData.description)

    const event = await prisma.event.create({
      data: {
        title: validatedData.title.trim(),
        description: sanitizedDescription,
        date: new Date(validatedData.date),
        time: validatedData.time.trim(),
        location: validatedData.location.trim(),
        image: validatedData.image || "",
        category: validatedData.category?.trim() || "General",
        registrationLink: validatedData.registrationLink ?? "",
      },
    })

    // Update isStaple separately due to type issues
    if (validatedData.isStaple !== undefined) {
      await prisma.event.update({
        where: { id: event.id },
        data: { isStaple: validatedData.isStaple },
      })
    }
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    logger.error("[v0] Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
