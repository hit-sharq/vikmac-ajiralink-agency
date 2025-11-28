import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { verifyPassword } from "@/app/lib/auth"
import { logAudit } from "@/app/lib/audit-logger"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = await prisma.desktopUser.findUnique({
      where: { email },
    })

    if (!user || user.status !== "active") {
      await logAudit("LOGIN", email, { success: false, reason: "user_not_found_or_inactive" })
      return NextResponse.json({ error: "Invalid credentials or account is inactive" }, { status: 401 })
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.password)

    if (!passwordValid) {
      await logAudit("LOGIN", user.id, { success: false, reason: "invalid_password" })
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    await logAudit("LOGIN", user.id, { success: true })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
  } catch (error) {
    console.error("[Auth] Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
