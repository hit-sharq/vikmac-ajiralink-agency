import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import logger from "@/lib/logger"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const item = await prisma.galleryImage.findUnique({
      where: { id },
    })
    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (error) {
    logger.error("[v0] Error fetching gallery item:", error)
    return NextResponse.json({ error: "Failed to fetch gallery item" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    // Check if gallery item exists before update
    const existingItem = await prisma.galleryImage.findUnique({ where: { id } })
    if (!existingItem) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }
    const item = await prisma.galleryImage.update({
      where: { id },
      data: body,
    })
    return NextResponse.json(item)
  } catch (error) {
    logger.error("[v0] Error updating gallery item:", error)
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.galleryImage.delete({
      where: { id },
    })
    return NextResponse.json({ message: "Gallery item deleted successfully" })
  } catch (error) {
    logger.error("[v0] Error deleting gallery item:", error)
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}
