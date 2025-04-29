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
    // const session = await validateSession(authToken)

    // if (!session) {
    //   return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 })
    // }

    // Get staking plans
    const stakingPlans = await prisma.stakingPlan.findMany();

    return NextResponse.json({
      success: true,
      data: stakingPlans
    })
  } catch (error) {
    console.error("Error fetching staking plans:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch staking plans" },
      { status: 500 }
    )
  }
}