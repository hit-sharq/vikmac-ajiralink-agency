import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hashPassword, generateToken } from "@/app/lib/auth"
import { logAudit } from "@/app/lib/audit-logger"

const prisma = new PrismaClient()

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { action } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "generate-token") {
      const user = await prisma.desktopUser.findUnique({
        where: { id },
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Generate temporary password
      const tempPassword = generateToken().substring(0, 12)

      // Hash and save
      const hashedPassword = await hashPassword(tempPassword)
      await prisma.desktopUser.update({
        where: { id },
        data: { password: hashedPassword },
      })

      await logAudit("PASSWORD_RESET", id, {
        email: user.email,
        method: "admin-reset",
      })

      return NextResponse.json({
        tempPassword: tempPassword,
        message: "Share this temporary password with the user. They should change it on first login.",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[Auth] Password reset error:", error)
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 })
  }
}
