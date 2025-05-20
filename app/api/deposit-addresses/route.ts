export const dynamic = 'force-dynamic';

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateSession } from "@/app/api/services/auth"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  try {
    // Get auth token from cookies
    const authToken = cookies().get("auth_token")?.value

    if (!authToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Validate the session
    const session = await validateSession(authToken)

    if (!session) {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 })
    }

    const userId = session.user.id

    // Get all deposit addresses 
    const depositAddresses = await prisma.depositAddresses.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: depositAddresses,
      message: "Deposit addresses fetched successfully",
    })
  } catch (error) {
    console.error("Error fetching deposit addresses:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch deposit addresses" }, { status: 500 })
  }
}