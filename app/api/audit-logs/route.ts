import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const userId = searchParams.get("userId")

    let logs
    if (userId) {
      logs = await prisma.$queryRaw`
        SELECT * FROM "AuditLog"
        WHERE "userId" = ${userId}
        ORDER BY "createdAt" DESC
        LIMIT ${limit}
      `
    } else {
      logs = await prisma.$queryRaw`
        SELECT * FROM "AuditLog"
        ORDER BY "createdAt" DESC
        LIMIT ${limit}
      `
    }

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}
