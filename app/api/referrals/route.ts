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

    // Get direct referrals (first level)
    const directReferrals = await prisma.user.findMany({
      where: { referredBy: user.id },
      select: {
        id: true,
        username: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            referredUsers: true,
          },
        },
        stakingPositions: {
          select: {
            amount: true,
            isActive: true,
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
        username: true,
        referredBy: true,
        createdAt: true,
        lastLoginAt: true,
        stakingPositions: {
          select: {
            amount: true,
            isActive: true,
            rewards: {
              select: {
                amount: true,
              },
            },
          },
        },
      },
    })

    // Calculate total referrals
    const totalReferrals = directReferrals.length

    // Calculate bonuses
    let totalBonus = 0

    // Format direct referrals with calculated data
    const formattedDirectReferrals = directReferrals.map((referral) => {
      // Calculate total staked
      const totalStaked = referral.stakingPositions.reduce((sum, pos) => sum + pos.amount, 0)

      // Calculate total rewards
      const totalRewards = referral.stakingPositions.reduce((sum, pos) => {
        return sum + pos.rewards.reduce((rewardSum, reward) => rewardSum + reward.amount, 0)
      }, 0)

      // Calculate bonus (10% of their rewards)
      const bonusEarned = totalRewards * 0.1
      totalBonus += bonusEarned

      // Calculate downline bonus
      const downlineUsers = downlineReferrals.filter((down) => down.referredBy === referral.id)
      const downlineRewards = downlineUsers.reduce((sum, downUser) => {
        return (
          sum +
          downUser.stakingPositions.reduce((posSum, pos) => {
            return posSum + pos.rewards.reduce((rewardSum, reward) => rewardSum + reward.amount, 0)
          }, 0)
        )
      }, 0)

      const downlineBonus = downlineRewards * 0.08
      totalBonus += downlineBonus

      // Determine if user is active (logged in within the last 30 days)
      const isActive = referral.lastLoginAt
        ? new Date(referral.lastLoginAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
        : false

      return {
        id: referral.id,
        username: referral.username,
        isActive,
        joinedAt: referral.createdAt,
        totalStaked,
        bonusEarned,
        referralCount: referral._count.referredUsers,
        downlineBonus,
      }
    })

    // Format downline referrals
    const formattedDownlineReferrals = downlineReferrals.map((referral) => {
      // Calculate total staked
      const totalStaked = referral.stakingPositions.reduce((sum, pos) => sum + pos.amount, 0)

      // Calculate total rewards
      const totalRewards = referral.stakingPositions.reduce((sum, pos) => {
        return sum + pos.rewards.reduce((rewardSum, reward) => rewardSum + reward.amount, 0)
      }, 0)

      // Calculate bonus (8% of their rewards)
      const bonusEarned = totalRewards * 0.08

      // Determine if user is active (logged in within the last 30 days)
      const isActive = referral.lastLoginAt
        ? new Date(referral.lastLoginAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
        : false

      return {
        id: referral.id,
        username: referral.username,
        isActive,
        joinedAt: referral.createdAt,
        totalStaked,
        bonusEarned,
        referredBy: referral.referredBy,
      }
    })

    return NextResponse.json({
      referralCode: user.referralCode,
      totalReferrals,
      totalBonus,
      directReferrals: formattedDirectReferrals,
      downlineReferrals: formattedDownlineReferrals,
    })
  } catch (error: any) {
    console.error("Error fetching referral data:", error)
    return NextResponse.json({ error: "Failed to fetch referral data" }, { status: 500 })
  }
}
