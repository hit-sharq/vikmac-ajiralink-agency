import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  try {
    const [memberCount, eventCount, newsCount] = await Promise.all([
      prisma.member.count(),
      prisma.event.count(),
      prisma.news.count(),
    ])

    return NextResponse.json({
      members: memberCount,
      events: eventCount,
      news: newsCount,
      yearsActive: 10, // This can be calculated from founding date
    })
  } catch (error) {
    console.error("[v0] Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
