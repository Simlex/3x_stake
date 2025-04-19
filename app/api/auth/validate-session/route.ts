// Create a new API route to validate the session

import { type NextRequest, NextResponse } from "next/server"
import { validateSession } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  try {
    // Get auth token from cookies
    const authToken = cookies().get("auth_token")?.value

    if (!authToken) {
      return NextResponse.json({ error: "No authentication token found" }, { status: 401 })
    }

    // Validate the session
    const session = await validateSession(authToken)

    if (!session) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }

    // Return user data
    return NextResponse.json({ user: session.user })
  } catch (error: any) {
    console.error("Session validation error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}
