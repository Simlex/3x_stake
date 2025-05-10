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

    // Get staking positions with plan details
    const stakingPositions = await prisma.stakingPosition.findMany({
      where: {
        userId,
      },
      include: {
        stakingPlan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate rewards for each position
    const positionsWithRewards = await Promise.all(
      stakingPositions.map(async (position) => {
        // Get total rewards for this position
        const rewards = await prisma.reward.aggregate({
          where: {
            stakingPositionId: position.id,
          },
          _sum: {
            amount: true,
          },
        })

        // Format for frontend
        return {
          id: position.id,
          userId: position.userId,
          planId: position.planId,
          planName: position.stakingPlan.name,
          amount: position.amount,
          network: position.network,
          startDate: position.startDate.toISOString(),
          endDate: position.endDate?.toISOString(),
          lastClaimedAt: position.lastClaimedAt?.toISOString(),
          apr: position.stakingPlan.apr,
          rewards: rewards._sum.amount || 0,
          isActive: position.isActive,
          depositStatus: position.depositStatus,
          createdAt: position.createdAt.toISOString(),
          updatedAt: position.updatedAt.toISOString(),
        }
      }),
    )

    return NextResponse.json({
      success: true,
      data: positionsWithRewards,
    })
  } catch (error) {
    console.error("Error fetching staking positions:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch staking positions" }, { status: 500 })
  }
}
