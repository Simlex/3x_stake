import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateSession } from "@/app/api/services/auth"
import { cookies } from "next/headers"
import { type Activity } from "@/app/model"

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

    // Get activity history
    // const activityHistory = await prisma.$queryRaw<Activity[]>`
    //   SELECT 
    //     id, 
    //     type, 
    //     amount, 
    //     created_at as "createdAt", 
    //     data->>'details' as details,
    //     data->>'relatedId' as "relatedId"
    //   FROM Activity
    //   WHERE user_id = ${userId}
    //   ORDER BY created_at DESC
    //   LIMIT 20
    // `
    
    const activityHistory = await prisma.activity.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Format activity for frontend
    const formattedActivity = activityHistory.map((activity) => ({
      id: activity.id,
      userId,
      type: activity.type,
    //   amount: Number.parseFloat(activity.amount),
      amount: activity.amount,
      date: activity.createdAt,
    //   details: activity.details,
    //   relatedId: activity.relatedId,
    }))

    return NextResponse.json({
      success: true,
      data: formattedActivity,
    })
  } catch (error) {
    console.error("Error fetching activity history:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch activity history" }, { status: 500 })
  }
}
