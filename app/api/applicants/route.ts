import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const applicants = await prisma.applicant.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(applicants)
  } catch (error: any) {
    console.error("Error fetching applicants:", error)
    return NextResponse.json({ error: "Failed to fetch applicants" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    const applicant = await prisma.applicant.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(applicant)
  } catch (error: any) {
    console.error("Error updating applicant:", error)
    return NextResponse.json({ error: "Failed to update applicant" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const applicant = await prisma.applicant.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender,
        nationality: body.nationality,
        passportNumber: body.passportNumber,
        passportExpiryDate: new Date(body.passportExpiryDate),
        category: body.category,
        yearsOfExperience: body.yearsOfExperience,
        trainingCompleted: body.trainingCompleted,
        medicalClearance: body.medicalClearance,
        status: "new",
      },
    })

    // Create work experience records
    if (body.workExperience?.length > 0) {
      await prisma.workExperience.createMany({
        data: body.workExperience.map((exp: any) => ({
          applicantId: applicant.id,
          jobTitle: exp.jobTitle,
          company: exp.company,
          country: exp.country,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          description: exp.description,
        })),
      })
    }

    // Create certifications records
    if (body.certifications?.length > 0) {
      await prisma.certification.createMany({
        data: body.certifications.map((cert: any) => ({
          applicantId: applicant.id,
          certName: cert.certName,
          issuedBy: cert.issuedBy,
          issueDate: new Date(cert.issueDate),
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
        })),
      })
    }

    return NextResponse.json(applicant, { status: 201 })
  } catch (error: any) {
    console.error("Error creating applicant:", error)
    return NextResponse.json({ error: "Failed to create applicant" }, { status: 500 })
  }
}
