import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hashPassword } from "@/app/lib/auth"
import { logAudit } from "@/app/lib/audit-logger"
import { sendDesktopUserCredentials } from "@/app/lib/email"

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

    // Send email with credentials
    const emailResult = await sendDesktopUserCredentials(
      desktopUser.email,
      desktopUser.name,
      body.password // Send the plain text password
    )

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error)
      // Don't fail the user creation if email fails, but log it
    }

    await logAudit("USER_CREATED", "system", {
      userId: desktopUser.id,
      email: desktopUser.email,
      role: desktopUser.role,
      emailSent: emailResult.success,
    })

    return NextResponse.json({
      ...desktopUser,
      emailSent: emailResult.success
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating desktop user:", error)
    return NextResponse.json({ error: "Failed to create desktop user" }, { status: 500 })
  }
}
