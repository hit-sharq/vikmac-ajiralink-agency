import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const userId = searchParams.get("userId")

    const query: any = {}
    if (userId) query.user_id = userId

    const logs = await prisma.$queryRaw`
      SELECT * FROM audit_logs 
      WHERE ${userId ? "user_id = $1" : "1=1"}
      ORDER BY created_at DESC 
      LIMIT $${userId ? "2" : "1"}
    `

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}
