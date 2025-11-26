import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const news = await prisma.news.findUnique({
      where: { id },
    })
    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 })
    }
    return NextResponse.json(news)
  } catch (error) {
    console.error("[v0] Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const news = await prisma.news.update({
      where: { id },
      data: {
        ...body,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      },
    })
    return NextResponse.json(news)
  } catch (error) {
    console.error("[v0] Error updating news:", error)
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.news.delete({
      where: { id },
    })
    return NextResponse.json({ message: "News deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting news:", error)
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 })
  }
}
