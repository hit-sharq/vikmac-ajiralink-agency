import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"
import DOMPurify from "isomorphic-dompurify"

const createBlogSchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1),
  author: z.string().min(1).max(100),
  category: z.string().max(50).optional(),
  imageUrl: z.string().url().optional(),
  image: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const posts = await prisma.blog.findMany({
      orderBy: { publishedAt: "desc" },
      take: limit,
    })
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createBlogSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Sanitize content
    const sanitizedContent = DOMPurify.sanitize(validatedData.content)

    const post = await prisma.blog.create({
      data: {
        title: validatedData.title.trim(),
        excerpt: validatedData.excerpt.trim(),
        content: sanitizedContent,
        author: validatedData.author.trim(),
        category: validatedData.category?.trim() || "General",
        image: validatedData.imageUrl || validatedData.image || "",
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : new Date(),
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
