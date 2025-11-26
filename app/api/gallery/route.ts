import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"
import { sanitizeHtml } from "@/lib/sanitize"

const createGallerySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url(),
  category: z.string().max(100).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    const items = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    })
    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching gallery items:", error)
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createGallerySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.issues }, { status: 400 })
    }

    const validatedData = validationResult.data

    const sanitizedDescription = validatedData.description ? sanitizeHtml(validatedData.description) : null

    const item = await prisma.galleryImage.create({
      data: {
        title: validatedData.title.trim(),
        description: sanitizedDescription,
        imageUrl: validatedData.imageUrl,
        category: validatedData.category?.trim() || "General",
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating gallery item:", error)
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 })
  }
}
