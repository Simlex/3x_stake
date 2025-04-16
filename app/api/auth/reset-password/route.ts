import { type NextRequest, NextResponse } from "next/server"
import { resetPassword } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    // Validate input
    if (!token || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    const result = await resetPassword({ token, password })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Password reset error:", error)

    return NextResponse.json({ error: error.message || "An error occurred during password reset" }, { status: 400 })
  }
}
