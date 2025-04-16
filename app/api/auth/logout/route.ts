import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    // Clear auth cookie
    cookies().delete("auth_token")

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Logout error:", error)

    return NextResponse.json({ error: "An error occurred during logout" }, { status: 500 })
  }
}
