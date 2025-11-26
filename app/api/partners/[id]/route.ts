import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const partner = await prisma.partner.findUnique({
      where: { id: params.id },
    })

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json(partner)
  } catch (error) {
    console.error("Error fetching partner:", error)
    return NextResponse.json({ error: "Failed to fetch partner" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const partner = await prisma.partner.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(partner)
  } catch (error) {
    console.error("Error updating partner:", error)
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.partner.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting partner:", error)
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 })
  }
}
