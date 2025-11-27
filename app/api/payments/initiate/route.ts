import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { pesapalService } from "@/lib/pesapal"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId } = body

    // Get payment details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        applicant: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Initiate Pesapal payment
    const pesapalResponse = await pesapalService.initiatePayment({
      amount: payment.amount,
      currency: payment.currency,
      description: payment.description || `Payment for ${payment.type}`,
      reference: payment.id,
      email: payment.applicant.email,
      phone: payment.applicant.phone || undefined,
      firstName: payment.applicant.firstName,
      lastName: payment.applicant.lastName
    })

    // Update payment with Pesapal tracking ID
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'processing',
        // Store Pesapal order tracking ID if available
        description: `${payment.description || ''} - Pesapal Order: ${pesapalResponse.order_tracking_id || pesapalResponse.id}`.trim()
      }
    })

    return NextResponse.json({
      redirect_url: pesapalResponse.redirect_url,
      order_tracking_id: pesapalResponse.order_tracking_id || pesapalResponse.id
    })

  } catch (error: any) {
    console.error("Error initiating Pesapal payment:", error)
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 })
  }
}
