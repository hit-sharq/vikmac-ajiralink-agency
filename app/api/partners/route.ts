import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createPartnerSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  category: z.string().default("general"),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).optional(),
})

const updatePartnerSchema = createPartnerSchema.extend({
  id: z.string().min(1),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    console.log("Fetching partners from database")
    const partners = await prisma.partner.findMany({
      orderBy: { order: "asc" },
      take: limit,
    })
    console.log("Found partners:", partners.length)
    return NextResponse.json(partners, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error("Error fetching partners:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createPartnerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    console.log("Creating new partner:", validatedData.name)
    const partner = await prisma.partner.create({
      data: {
        name: validatedData.name.trim(),
        description: validatedData.description?.trim(),
        logoUrl: validatedData.logoUrl,
        website: validatedData.website,
        category: validatedData.category,
        featured: validatedData.featured || false,
        order: validatedData.order || 0,
      },
    })

    return NextResponse.json(partner)
  } catch (error) {
    console.error("Error creating partner:", error)
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = updatePartnerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    console.log("Updating partner:", validatedData.id)
    const partner = await prisma.partner.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name.trim(),
        description: validatedData.description?.trim(),
        logoUrl: validatedData.logoUrl,
        website: validatedData.website,
        category: validatedData.category,
        featured: validatedData.featured || false,
        order: validatedData.order || 0,
      },
    })

    return NextResponse.json(partner)
  } catch (error) {
    console.error("Error updating partner:", error)
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Partner ID is required" }, { status: 400 })
    }

    console.log("Deleting partner:", id)
    await prisma.partner.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting partner:", error)
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 })
  }
}
