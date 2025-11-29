import nodemailer from "nodemailer"

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendDesktopUserCredentials(email: string, name: string, password: string) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@vikmac.com",
      to: email,
      subject: "Your Vikmac Desktop Account Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Vikmac Desktop Application</h2>
          <p>Dear ${name},</p>
          <p>Your desktop account has been created successfully. Here are your login credentials:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          <p><strong>Important:</strong> Please change your password after your first login for security reasons.</p>
          <p>You can access the desktop application by running the Vikmac desktop app and logging in with these credentials.</p>
          <p>If you have any questions, please contact your administrator.</p>
          <p>Best regards,<br>Vikmac Team</p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@vikmac.com",
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your password. Click the link below to reset it:</p>
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>Vikmac Team</p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending password reset email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
