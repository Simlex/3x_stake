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

    // Get staking positions
    const stakingPositions = await prisma.stakingPosition.findMany({
      where: {
        userId,
        isActive: true,
      },
    })

    // Calculate total staked
    const totalStaked = stakingPositions.reduce((sum, position) => sum + position.amount, 0)

    // Get rewards
    const rewards = await prisma.reward.findMany({
      where: {
        userId,
      },
    })

    // Calculate total rewards
    const totalRewards = rewards.reduce((sum, reward) => sum + reward.amount, 0)

    // Get referrals count
    const referrals = await prisma.user.count({
      where: {
        referredBy: userId,
      },
    })

    // Get user for referral code
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        referralCode: true,
      },
    })

    // Get recent activity
    const recentActivity = await prisma.activity.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    // const recentActivity = await prisma.$queryRaw<Activity[]>`
    //   SELECT 
    //     id, 
    //     type, 
    //     amount, 
    //     created_at as "createdAt", 
    //     data->>'details' as details
    //   FROM Activity
    //   WHERE user_id = ${userId}
    //   ORDER BY created_at DESC
    //   LIMIT 5
    // `

    // Format activity for frontend
    const formattedActivity = recentActivity.map((activity: any) => ({
      id: activity.id,
      type: activity.type,
      amount: Number.parseFloat(activity.amount),
      date: activity.createdAt,
      details: activity.details,
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalStaked,
        activePositions: stakingPositions.length,
        totalRewards,
        referrals,
        referralCode: user?.referralCode || "",
        recentActivity: formattedActivity,
      },
    })
  } catch (error) {
    console.error("Error fetching profile summary:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch profile summary" }, { status: 500 })
  }
}
