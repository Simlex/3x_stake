export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/app/api/services/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    // Get auth token from cookies
    const authToken = cookies().get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate the session
    const session = await validateSession(authToken);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Invalid session" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user with referral code
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        referralCode: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get direct referrals (first level)
    const directReferrals = await prisma.user.findMany({
      where: { referredBy: user.id },
      select: {
        id: true,
        username: true,
        createdAt: true,
        lastLoginAt: true,
        referredBy: true,
        _count: {
          select: {
            referredUsers: true,
          },
        },
        stakingPositions: {
          select: {
            amount: true,
            isActive: true,
            stakingPlan: {
              select: {
                referralBonus: true,
              },
            },
            rewards: {
              select: {
                amount: true,
              },
            },
          },
        },
      },
    });
    console.log("🚀 ~ GET ~ directReferrals:", directReferrals);

    // Get downline referrals (second level)
    const directReferralIds = directReferrals.map((ref) => ref.id);

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
            stakingPlan: {
              select: {
                firstDownlineBonus: true,
              },
            },
          },
        },
        _count: {
          select: {
            referredUsers: true,
          },
        },
      },
    });
    console.log("🚀 ~ GET ~ downlineReferrals:", downlineReferrals);

    // Get the 2nd level referrals (referrals of downline users)
    // Get second downline referrals (referrals of downline users)
    const downlineReferralIds = downlineReferrals.map((ref) => ref.id);

    const secondDownlineReferrals = await prisma.user.findMany({
      where: {
        referredBy: {
          in: downlineReferralIds,
        },
      },
      select: {
        id: true,
        referredBy: true,
        username: true,
        createdAt: true,
        stakingPositions: {
          select: {
            amount: true,
            rewards: {
              select: {
                amount: true,
              },
            },
            stakingPlan: {
              select: {
                referralBonus: true,
                secondDownlineBonus: true,
              },
            },
          },
        },
      },
    });

    // Calculate total referrals
    const totalReferrals = directReferrals.length;

    // Calculate bonuses
    let totalBonus = 0;

    // Format direct referrals with calculated data
    const formattedDirectReferrals = directReferrals.map((referral, index) => {
      // Calculate total staked
      const totalStaked = referral.stakingPositions.reduce(
        (sum, pos) => sum + pos.amount,
        0
      );

      // Calculate total rewards
      const totalRewards = referral.stakingPositions.reduce((sum, pos) => {
        return (
          sum +
          pos.rewards.reduce(
            (rewardSum, reward) =>
              rewardSum + reward.amount * pos.stakingPlan.referralBonus,
            0
          )
        ); // Use referral bonus from staking plan to calculate rewards
      }, 0);

      // Calculate bonus (relative % of their rewards)
      const bonusEarned = totalRewards;
      totalBonus += bonusEarned;

      // Calculate downline bonus
      const downlineUsers = downlineReferrals.filter(
        (down) => down.referredBy === referral.id
      );
      const downlineRewards = downlineUsers.reduce((sum, downUser) => {
        return (
          sum +
          downUser.stakingPositions.reduce((posSum, pos) => {
            return (
              posSum +
              pos.rewards.reduce(
                (rewardSum, reward) =>
                  rewardSum +
                  reward.amount * pos.stakingPlan.firstDownlineBonus,
                0
              )
            );
          }, 0)
        );
      }, 0);

      const downlineBonus = downlineRewards;
      totalBonus += downlineBonus;

      // Calculate second downline bonus (50% of downline bonus)
      const secondLevelUsers = secondDownlineReferrals.filter((s) => {
        return downlineUsers.some((d) => d.id === s.referredBy);
      });

      const secondLevelBonus = secondLevelUsers.reduce((sum, s) => {
        return (
          sum +
          s.stakingPositions.reduce((posSum, pos) => {
            return (
              posSum +
              pos.rewards.reduce((rewardSum, reward) => {
                return (
                  rewardSum +
                  reward.amount * pos.stakingPlan.secondDownlineBonus
                );
              }, 0)
            );
          }, 0)
        );
      }, 0);

      totalBonus += secondLevelBonus;

      // Determine if user is active (logged in within the last 30 days)
      const isActive = referral.lastLoginAt
        ? new Date(referral.lastLoginAt).getTime() >
          Date.now() - 30 * 24 * 60 * 60 * 1000
        : false;

      return {
        id: referral.id,
        username: referral.username,
        isActive,
        joinedAt: referral.createdAt,
        totalStaked,
        bonusEarned,
        referralCount: referral._count.referredUsers,
        downlineBonus,
      };
    });

    // Format downline referrals
    const formattedDownlineReferrals = downlineReferrals.map((referral) => {
      // Calculate total staked
      const totalStaked = referral.stakingPositions.reduce(
        (sum, pos) => sum + pos.amount,
        0
      );

      // Calculate total rewards
      const totalRewards = referral.stakingPositions.reduce((sum, pos) => {
        return (
          sum +
          pos.rewards.reduce(
            (rewardSum, reward) =>
              rewardSum + reward.amount * pos.stakingPlan.firstDownlineBonus,
            0
          )
        );
      }, 0);

      // Calculate bonus (no longer 8% of their rewards)
      const bonusEarned = totalRewards;

      // Determine if user is active (logged in within the last 30 days)
      const isActive = referral.lastLoginAt
        ? new Date(referral.lastLoginAt).getTime() >
          Date.now() - 30 * 24 * 60 * 60 * 1000
        : false;

      // Calculate downline bonus
      const downlineUsers = directReferrals.filter(
        (down) => down.referredBy === referral.id
      );
      const downlineRewards = downlineUsers.reduce((sum, downUser) => {
        return (
          sum +
          downUser.stakingPositions.reduce((posSum, pos) => {
            return (
              posSum +
              pos.rewards.reduce(
                (rewardSum, reward) =>
                  rewardSum + reward.amount * pos.stakingPlan.referralBonus,
                0
              )
            );
          }, 0)
        );
      }, 0);
      const downlineBonus = downlineRewards;

      return {
        id: referral.id,
        username: referral.username,
        isActive,
        joinedAt: referral.createdAt,
        totalStaked,
        bonusEarned,
        referredBy: referral.referredBy,
        referralCount: referral._count.referredUsers,
        downlineBonus,
      };
    });

    // Format second downline referrals
    const formattedSecondDownlineReferrals = secondDownlineReferrals.map(
      (referral) => {
        const totalRewards = referral.stakingPositions.reduce((sum, pos) => {
          return (
            sum +
            pos.rewards.reduce(
              (rewardSum, reward) =>
                rewardSum +
                reward.amount * (pos.stakingPlan.secondDownlineBonus ?? 0),
              0
            )
          );
        }, 0);

        // Calculate total staked
        const totalStaked = referral.stakingPositions.reduce(
          (sum, pos) => sum + pos.amount,
          0
        );

        return {
          id: referral.id,
          referredBy: referral.referredBy,
          bonusEarned: totalRewards,
          username: referral.username,
          joinedAt: referral.createdAt,
          totalStaked,
        };
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        totalReferrals,
        totalBonus,
        directReferrals: formattedDirectReferrals,
        downlineReferrals: formattedDownlineReferrals,
        secondDownlineReferrals: formattedSecondDownlineReferrals,
      },
    });
  } catch (error: any) {
    console.error("Error fetching referral data:", error);
    return NextResponse.json(
      { error: "Failed to fetch referral data" },
      { status: 500 }
    );
  }
}
