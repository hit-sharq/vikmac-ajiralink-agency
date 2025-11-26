import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const employer = await prisma.employer.create({
      data: {
        companyName: body.companyName,
        email: body.email,
        contactPerson: body.contactPerson,
        phone: body.phone,
        country: body.country,
        address: body.address || "",
        status: "active",
      },
    })

    return NextResponse.json(employer, { status: 201 })
  } catch (error: any) {
    console.error("Error creating employer:", error)
    return NextResponse.json({ error: "Failed to create employer" }, { status: 500 })
  }
}
