import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const post = await prisma.blog.findUnique({
      where: { id },
    })
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData: any = {}

    if (body.title && typeof body.title === 'string') updateData.title = body.title.trim()
    if (body.excerpt && typeof body.excerpt === 'string') updateData.excerpt = body.excerpt.trim()
    if (body.content && typeof body.content === 'string') updateData.content = body.content.trim()
    if (body.author && typeof body.author === 'string') updateData.author = body.author.trim()
    if (body.category && typeof body.category === 'string' && body.category.trim()) updateData.category = body.category.trim()
    if (body.imageUrl || body.image) updateData.image = body.imageUrl || body.image
    if (body.publishedAt) updateData.publishedAt = new Date(body.publishedAt)

    const post = await prisma.blog.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json(post)
  } catch (error) {
    console.error("[v0] Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.blog.delete({
      where: { id },
    })
    return NextResponse.json({ message: "Blog post deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
