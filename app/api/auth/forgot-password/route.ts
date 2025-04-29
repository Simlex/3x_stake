import { type NextRequest, NextResponse } from "next/server"
import { requestPasswordReset } from "@/app/api/services/auth"

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

    const result = await requestPasswordReset(email)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Password reset request error:", error)

    // Don't reveal specific errors for security
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
