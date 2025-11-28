import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hashPassword } from "@/app/lib/auth"
import { logAudit } from "@/app/lib/audit-logger"

const prisma = new PrismaClient()

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params

    const updateData: any = {}

    if (body.role) updateData.role = body.role
    if (body.status) updateData.status = body.status
    if (body.name) updateData.name = body.name

    if (body.password) {
      updateData.password = await hashPassword(body.password)
    }

    const user = await prisma.desktopUser.update({
      where: { id },
      data: updateData,
    })

    await logAudit("USER_UPDATED", "system", {
      userId: id,
      changes: body,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating desktop user:", error)
    return NextResponse.json({ error: "Failed to update desktop user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await prisma.desktopUser.delete({
      where: { id },
    })

    await logAudit("USER_DELETED", "system", { userId: id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting desktop user:", error)
    return NextResponse.json({ error: "Failed to delete desktop user" }, { status: 500 })
  }
}
