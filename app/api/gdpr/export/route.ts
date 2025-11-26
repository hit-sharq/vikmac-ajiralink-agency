import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
  const user = await currentUser()
  if (!user || !user.emailAddresses[0]?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const email = user.emailAddresses[0].emailAddress

    // Export user-related data (contacts, etc.)
    const contacts = await prisma.contact.findMany({
      where: { email },
    })

    // Add other data as needed

    const exportData = {
      email,
      contacts,
      exportedAt: new Date().toISOString(),
    }

    return NextResponse.json({ data: exportData })
  } catch (error) {
    console.error("GDPR export error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
