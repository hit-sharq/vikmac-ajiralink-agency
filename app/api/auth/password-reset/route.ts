import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hashPassword, generateToken, verifyPassword } from "@/app/lib/auth"
import { logAudit } from "@/app/lib/audit-logger"

const prisma = new PrismaClient()

// Request password reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, action } = body

    if (!email || !action) {
      return NextResponse.json({ error: "Email and action are required" }, { status: 400 })
    }

    if (action === "request") {
      // Find user
      const user = await prisma.desktopUser.findUnique({
        where: { email },
      })

      if (!user) {
        // Don't reveal if user exists (security best practice)
        return NextResponse.json({ message: "If account exists, reset link will be sent" }, { status: 200 })
      }

      // Generate reset token
      const resetToken = generateToken()
      const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

      // Store reset token (in production, use a separate table)
      // For now, we'll return the token (admin can share it)
      await logAudit("PASSWORD_RESET_REQUESTED", user.id, { email })

      return NextResponse.json({
        message: "Password reset token generated",
        resetToken: resetToken,
        expiresIn: "1 hour",
      })
    }

    if (action === "reset") {
      const { resetToken, newPassword } = body

      if (!resetToken || !newPassword) {
        return NextResponse.json({ error: "Reset token and new password are required" }, { status: 400 })
      }

      // Find user by email
      const user = await prisma.desktopUser.findUnique({
        where: { email },
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 })
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword)

      // Update password
      await prisma.desktopUser.update({
        where: { email },
        data: { password: hashedPassword },
      })

      await logAudit("PASSWORD_CHANGED", user.id, { method: "reset" })

      return NextResponse.json({
        message: "Password reset successfully",
      })
    }

    if (action === "change") {
      const { currentPassword, newPassword } = body

      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
      }

      // Find user by email
      const user = await prisma.desktopUser.findUnique({
        where: { email },
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Verify current password
      const isValidPassword = await verifyPassword(currentPassword, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword)

      // Update password
      await prisma.desktopUser.update({
        where: { email },
        data: { password: hashedPassword },
      })

      await logAudit("PASSWORD_CHANGED", user.id, { method: "change" })

      return NextResponse.json({
        message: "Password changed successfully",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[Auth] Password reset error:", error)
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 })
  }
}
