import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let visaRecord = await prisma.visaProcessing.findUnique({
      where: { applicantId: params.id },
      include: { applicant: true },
    })

    if (!visaRecord) {
      visaRecord = await prisma.visaProcessing.create({
        data: { applicantId: params.id },
        include: { applicant: true },
      })
    }

    return NextResponse.json(visaRecord)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch visa record" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const visaRecord = await prisma.visaProcessing.update({
      where: { id: params.id },
      data: {
        visaStatus: body.visaStatus,
        medicalStatus: body.medicalStatus,
        contractSigned: body.contractSigned,
        trainingStatus: body.trainingStatus,
        flightBooked: body.flightBooked,
        visaNumber: body.visaNumber,
        flightDetails: body.flightDetails,
        deploymentDate: body.deploymentDate ? new Date(body.deploymentDate) : null,
        deploymentNotes: body.deploymentNotes,
      },
      include: { applicant: true },
    })

    return NextResponse.json(visaRecord)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update visa record" }, { status: 500 })
  }
}
