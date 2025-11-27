import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const desktopUsers = await prisma.desktopUser.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(desktopUsers)
  } catch (error) {
    console.error("Error fetching desktop users:", error)
    return NextResponse.json({ error: "Failed to fetch desktop users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const desktopUser = await prisma.desktopUser.create({
      data: {
        email: body.email,
        name: body.name,
        password: body.password, // Should be hashed in production
        role: body.role || "staff",
        status: body.status || "active",
      }
    })
    return NextResponse.json(desktopUser, { status: 201 })
  } catch (error) {
    console.error("Error creating desktop user:", error)
    return NextResponse.json({ error: "Failed to create desktop user" }, { status: 500 })
  }
}
