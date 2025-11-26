import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id },
    })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    return NextResponse.json(project)
  } catch (error) {
    console.error("[v0] Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData: any = {}

    if (body.title && typeof body.title === 'string') updateData.title = body.title.trim()
    if (body.description && typeof body.description === 'string') updateData.description = body.description.trim()
    if (body.category && typeof body.category === 'string' && body.category.trim()) updateData.category = body.category.trim()
    if (body.imageUrl || body.image) updateData.image = body.imageUrl || body.image
    if (body.technologies && Array.isArray(body.technologies)) updateData.technologies = body.technologies
    if (body.liveUrl !== undefined) updateData.liveUrl = body.liveUrl || null
    if (body.githubUrl !== undefined) updateData.githubUrl = body.githubUrl || null
    if (body.featured !== undefined) updateData.featured = body.featured

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json(project)
  } catch (error) {
    console.error("[v0] Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.project.delete({
      where: { id },
    })
    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
