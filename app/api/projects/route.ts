import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import logger from "@/lib/logger"
import { z } from "zod"
import DOMPurify from "isomorphic-dompurify"

const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  category: z.string().max(50).optional(),
  image: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  technologies: z.array(z.string()).optional(),
  liveUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    })
    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    logger.error("[v0] Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createProjectSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Sanitize description
    const sanitizedDescription = DOMPurify.sanitize(validatedData.description)

    const project = await prisma.project.create({
      data: {
        title: validatedData.title.trim(),
        description: sanitizedDescription,
        category: validatedData.category?.trim() || "website",
        image: validatedData.image || validatedData.imageUrl || "",
        technologies: validatedData.technologies || [],
        liveUrl: validatedData.liveUrl || null,
        githubUrl: validatedData.githubUrl || null,
        featured: validatedData.featured || false,
      },
    })
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    logger.error("[v0] Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
