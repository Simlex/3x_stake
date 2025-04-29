import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateSession } from "@/app/api/services/auth"
import { cookies } from "next/headers"
import { RewardStatus } from "@/app/model"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rewardId = params.id

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

    // Find the reward
    const reward = await prisma.reward.findUnique({
      where: {
        id: rewardId,
      },
    })

    if (!reward) {
      return NextResponse.json({ success: false, message: "Reward not found" }, { status: 404 })
    }

    // Verify ownership
    if (reward.userId !== userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    // Check if already claimed
    if (reward.status === RewardStatus.CLAIMED) {
      return NextResponse.json({ success: false, message: "Reward already claimed" }, { status: 400 })
    }

    // Update reward to claimed
    await prisma.reward.update({
      where: {
        id: rewardId,
      },
      data: {
        status: RewardStatus.CLAIMED,
        claimedAt: new Date(),
      },
    })

    // Log the activity
    await prisma.activity.create({
      data: {
        userId,
        type: "REWARD",
        amount: reward.amount,
        data: {
          details: `Claimed ${reward.amount} USDR reward`,
          relatedId: rewardId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: { success: true },
    })
  } catch (error) {
    console.error("Error claiming reward:", error)
    return NextResponse.json({ success: false, message: "Failed to claim reward" }, { status: 500 })
  }
}
