import { type NextRequest, NextResponse } from "next/server"
import { signUp } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json()

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    const result = await signUp({ username, email, password })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Signup error:", error)

    return NextResponse.json({ error: error.message || "An error occurred during signup" }, { status: 500 })
  }
}
