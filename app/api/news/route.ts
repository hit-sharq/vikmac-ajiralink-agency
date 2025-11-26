import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import logger from "@/lib/logger"
import { z } from "zod"
import DOMPurify from "isomorphic-dompurify"

const createNewsSchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1).max(10000),
  category: z.string().max(100).optional(),
  image: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  author: z.string().min(1).max(100),
  publishedAt: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const news = await prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
      take: limit,
    })
    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    logger.error("[v0] Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createNewsSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Ensure image field is provided
    const image = validatedData.image || validatedData.imageUrl
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    // Sanitize content
    const sanitizedContent = DOMPurify.sanitize(validatedData.content)

    const data: any = {
      title: validatedData.title.trim(),
      excerpt: validatedData.excerpt.trim(),
      content: sanitizedContent,
      category: validatedData.category?.trim() || "General",
      image: image,
      author: validatedData.author.trim(),
    }

    if (validatedData.publishedAt) {
      data.publishedAt = new Date(validatedData.publishedAt)
    }

    const news = await prisma.news.create({
      data,
    })
    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    logger.error("[v0] Error creating news:", error)
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 })
  }
}
