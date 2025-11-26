import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        applicant: true,
      },
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Generate a simple text receipt
    const receiptContent = `
VIKMAC AJIRA LINK AGENCY
PAYMENT RECEIPT
================================

Receipt Number: ${payment.id}
Date: ${new Date(payment.createdAt).toLocaleDateString()}

Applicant Information:
Name: ${payment.applicant.firstName} ${payment.applicant.lastName}
Email: ${payment.applicant.email}
Category: ${payment.applicant.category}

Payment Details:
Type: ${payment.type}
Amount: ${payment.currency} ${payment.amount.toFixed(2)}
Status: ${payment.status}
Description: ${payment.description}

Payment Date: ${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "N/A"}

Thank you for your payment!
================================
Vikmac Ajira Link Agency
    `.trim()

    return new Response(receiptContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="receipt-${payment.id}.txt"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to generate receipt" }, { status: 500 })
  }
}
