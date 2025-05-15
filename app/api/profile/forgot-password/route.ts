import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // For security reasons, don't reveal if the email exists or not
    // We'll return success even if the email doesn't exist
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // Generate a reset token
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store the reset token in the database
    await prisma.passwordReset.create({
      data: {
        token,
        email,
        userId: user.id,
        expiresAt,
      },
    })

    // ========== EMAIL SENDING ==========
    // await sendPasswordResetEmail({
    //   to: email,
    //   subject: "Reset Your Password",
    //   resetLink: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`,
    //   username: user.username
    // })

    // For development, log the reset link to the console
    console.log(
      `Password reset link for ${email}: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`,
    )
    // ===============================================

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Password reset request error:", error)

    // Don't reveal specific errors for security
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
