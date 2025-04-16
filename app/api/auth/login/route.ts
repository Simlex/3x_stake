import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    console.log("🚀 ~ POST ~ password:", password)
    console.log("🚀 ~ POST ~ username:", username)
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await signIn({ username, password })

    console.log("🚀 ~ POST ~ result:", result)
    
    // Set auth cookie
    cookies().set({
      name: "auth_token",
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Don't return the token in the response
    return NextResponse.json({
      user: result.user,
    })
  } catch (error: any) {
    console.error("Login error:", error)

    return NextResponse.json({ error: error.message || "Invalid credentials" }, { status: 401 })
  }
}
