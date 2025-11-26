import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function DELETE() {
  const user = await currentUser()
  if (!user || !user.emailAddresses[0]?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const email = user.emailAddresses[0].emailAddress

    // Delete user-related data
    await prisma.contact.deleteMany({
      where: { email },
    })

    // Add other deletions as needed

    return NextResponse.json({ message: "User data deleted successfully" })
  } catch (error) {
    console.error("GDPR delete error:", error)
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 })
  }
}
