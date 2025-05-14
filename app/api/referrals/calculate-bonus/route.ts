export const dynamic = 'force-dynamic';

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// This endpoint is meant to be called by a cron job or webhook
// when new rewards are generated, to calculate and distribute referral bonuses
export async function POST(req: NextRequest) {
  try {
    // In a production environment, this endpoint should be protected
    // with an API key or other authentication mechanism

    const { rewardId } = await req.json()

    if (!rewardId) {
      return NextResponse.json({ error: "Reward ID is required" }, { status: 400 })
    }

    // Get the reward
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
      include: {
        user: true,
        stakingPosition: {
            select: {
                stakingPlan: {
                    select: {
                        referralBonus: true,
                    }
                }
            }
        },
      },
    })

    if (!reward) {
      return NextResponse.json({ error: "Reward not found" }, { status: 404 })
    }

    // Check if the user was referred by someone
    if (!reward.user.referredBy) {
      return NextResponse.json({ message: "No referrer found for this user" })
    }

    // Get the direct referrer (level 1)
    const directReferrer = await prisma.user.findUnique({
      where: { id: reward.user.referredBy },
    })

    if (!directReferrer) {
      return NextResponse.json({ error: "Referrer not found" }, { status: 404 })
    }

    // Calculate and create level 1 bonus (use the referral bonus percentage from the staking plan)
    const level1BonusAmount = reward.amount * reward.stakingPosition.stakingPlan.referralBonus 

    const level1Bonus = await prisma.referralBonus.create({
      data: {
        userId: directReferrer.id,
        rewardId: reward.id,
        referralLevel: 1,
        amount: level1BonusAmount,
        status: "PENDING",
      },
    })

    // Create notification for level 1 referrer
    await prisma.notification.create({
      data: {
        userId: directReferrer.id,
        type: "REFERRAL",
        title: "New Referral Bonus",
        message: `You earned $${level1BonusAmount.toFixed(2)} from your referral's staking rewards.`,
        data: {
          bonusId: level1Bonus.id,
          amount: level1BonusAmount,
          level: 1,
        },
      },
    })

    // Check if there's a level 2 referrer (the person who referred the direct referrer)
    if (directReferrer.referredBy) {
      const level2Referrer = await prisma.user.findUnique({
        where: { id: directReferrer.referredBy },
      })

      if (level2Referrer) {
        // Calculate and create level 2 bonus (8% of reward)
        const level2BonusAmount = reward.amount * (reward.stakingPosition.stakingPlan.referralBonus / 2);

        const level2Bonus = await prisma.referralBonus.create({
          data: {
            userId: level2Referrer.id,
            rewardId: reward.id,
            referralLevel: 2,
            amount: level2BonusAmount,
            status: "PENDING",
          },
        })

        // Create notification for level 2 referrer
        await prisma.notification.create({
          data: {
            userId: level2Referrer.id,
            type: "REFERRAL",
            title: "New Downline Bonus",
            message: `You earned $${level2BonusAmount.toFixed(2)} from your downline's staking rewards.`,
            data: {
              bonusId: level2Bonus.id,
              amount: level2BonusAmount,
              level: 2,
            },
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Referral bonuses calculated and distributed successfully",
    })
  } catch (error: any) {
    console.error("Error calculating referral bonuses:", error)
    return NextResponse.json({ error: "Failed to calculate referral bonuses" }, { status: 500 })
  }
}
