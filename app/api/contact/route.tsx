import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import nodemailer from "nodemailer"
import { z } from "zod"
import DOMPurify from "isomorphic-dompurify"

const prisma = new PrismaClient()

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  subject: z.string().min(1).max(200),
  interests: z.string().max(100).optional(),
  message: z.string().min(1).max(2000),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = contactSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.issues }, { status: 400 })
    }

    const validatedData = validationResult.data

    // Sanitize message
    const sanitizedMessage = DOMPurify.sanitize(validatedData.message)

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name.trim(),
        email: validatedData.email.trim(),
        subject: validatedData.subject.trim(),
        message: `${sanitizedMessage}${validatedData.phone ? `\n\nPhone: ${validatedData.phone}` : ""}${validatedData.interests ? `\n\nAreas of Interest: ${validatedData.interests}` : ""}`,
      },
    })

    // Send email notification using SMTP settings for well-detailed form data - added phone and interests fields
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from: `"Vikmac Ajira Link Agency" <${process.env.SMTP_USER}>`,
        replyTo: validatedData.email, // Set reply-to to the sender's email
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: `New Contact Form Submission: ${validatedData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 30px; margin: 20px 0;">
              <h2 style="color: #333; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #8eb69b; padding-bottom: 10px;">New Contact Form Submission</h2>

              <div style="margin-bottom: 20px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px;">Contact Details</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
                  <p style="margin: 5px 0;"><strong>Name:</strong> ${validatedData.name}</p>
                  <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${validatedData.email}" style="color: #8eb69b;">${validatedData.email}</a></p>
                  <p style="margin: 5px 0;"><strong>Phone:</strong> ${validatedData.phone || "Not provided"}</p>
                </div>
              </div>

              <div style="margin-bottom: 20px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px;">Inquiry Details</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
                  <p style="margin: 5px 0;"><strong>Subject:</strong> ${validatedData.subject}</p>
                  <p style="margin: 5px 0;"><strong>Areas of Interest:</strong> ${validatedData.interests || "Not specified"}</p>
                </div>
              </div>

              <div style="margin-bottom: 20px;">
                <h3 style="color: #8eb69b; margin-bottom: 15px;">Message</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #8eb69b;">
                  <p style="margin: 0; line-height: 1.6;">${sanitizedMessage.replace(/\n/g, "<br>")}</p>
                </div>
              </div>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="text-align: center; color: #666; font-size: 14px; margin: 0;">
                <em>Submitted at: ${new Date().toLocaleString()}</em>
              </p>
            </div>
          </div>
        `,
      })
      // Improved email template with card-like design for better presentation of contact form submissions
    } catch (emailError) {
      console.error("Error sending contact email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error("Error creating contact:", error)
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(contacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}
