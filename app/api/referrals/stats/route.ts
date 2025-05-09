export const dynamic = 'force-dynamic';

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    // Get user ID from request headers (set by middleware)
    const userId = req.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user with referral code
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        referralCode: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Count direct referrals
    const directReferralsCount = await prisma.user.count({
      where: { referredBy: user.id },
    })

    // Get all referral bonuses for this user
    const referralBonuses = await prisma.referralBonus.findMany({
      where: { userId },
    })

    // Calculate total bonus amount
    const totalBonus = referralBonuses.reduce((sum, bonus) => sum + bonus.amount, 0)

    // Alternative approach: Calculate bonuses directly from rewards
    // This is more accurate but more computationally expensive
    if (totalBonus === 0) {
      // Get direct referrals with their rewards
      const directReferrals = await prisma.user.findMany({
        where: { referredBy: user.id },
        select: {
          id: true,
          stakingPositions: {
            select: {
              rewards: {
                select: {
                  amount: true,
                },
              },
            },
          },
        },
      })

      // Get downline referrals (second level)
      const directReferralIds = directReferrals.map((ref) => ref.id)
      const downlineReferrals = await prisma.user.findMany({
        where: {
          referredBy: {
            in: directReferralIds,
          },
        },
        select: {
          id: true,
          stakingPositions: {
            select: {
              rewards: {
                select: {
                  amount: true,
                },
              },
            },
          },
        },
      })

      // Calculate direct referral bonuses (10% of their rewards)
      let calculatedTotalBonus = 0
      for (const referral of directReferrals) {
        const totalRewards = referral.stakingPositions.reduce((sum, pos) => {
          return sum + pos.rewards.reduce((rewardSum, reward) => rewardSum + reward.amount, 0)
        }, 0)
        calculatedTotalBonus += totalRewards * 0.1
      }

      // Calculate downline referral bonuses (8% of their rewards)
      for (const referral of downlineReferrals) {
        const totalRewards = referral.stakingPositions.reduce((sum, pos) => {
          return sum + pos.rewards.reduce((rewardSum, reward) => rewardSum + reward.amount, 0)
        }, 0)
        calculatedTotalBonus += totalRewards * 0.08
      }

      // Use the calculated total if no bonuses were found in the database
      return NextResponse.json({
        referralCode: user.referralCode,
        totalReferrals: directReferralsCount,
        totalBonus: calculatedTotalBonus,
      })
    }

    return NextResponse.json({
      referralCode: user.referralCode,
      totalReferrals: directReferralsCount,
      totalBonus,
    })
  } catch (error: any) {
    console.error("Error fetching referral stats:", error)
    return NextResponse.json({ error: "Failed to fetch referral stats" }, { status: 500 })
  }
}
