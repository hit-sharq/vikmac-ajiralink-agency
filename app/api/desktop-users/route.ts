import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { hashPassword } from "@/app/lib/auth"
import { logAudit } from "@/app/lib/audit-logger"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const desktopUsers = await prisma.desktopUser.findMany({
      orderBy: { createdAt: "desc" },
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

    const hashedPassword = await hashPassword(body.password)

    const desktopUser = await prisma.desktopUser.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
        role: body.role || "staff",
        status: body.status || "active",
      },
    })

    await logAudit("USER_CREATED", "system", {
      userId: desktopUser.id,
      email: desktopUser.email,
      role: desktopUser.role,
    })

    return NextResponse.json(desktopUser, { status: 201 })
  } catch (error) {
    console.error("Error creating desktop user:", error)

    // Handle unique constraint violation (duplicate email)
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({
        error: "A user with this email already exists. Please use a different email address."
      }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to create desktop user" }, { status: 500 })
  }
}
