import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/app/api/services/auth";
import { cookies } from "next/headers";
import { RewardStatus } from "@/app/model";
import { calculateDailyReward } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stakingPositionId = params.id;

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

    // Find the position
    const stakingPosition = await prisma.stakingPosition.findUnique({
      where: {
        id: stakingPositionId,
      },
      include: {
        stakingPlan: {
            select: {
                apr: true,
                aprMax: true
            }
        }
      }
    });

    if (!stakingPosition) {
      return NextResponse.json(
        { success: false, message: "Staking Position not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (stakingPosition.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const now = new Date();

    // Check if already claimed ~ if we have still within last claimed at & next claimed deadline
    if (
      stakingPosition.lastClaimedAt &&
      stakingPosition.lastClaimedAt <= now &&
      now <= stakingPosition.nextClaimDeadline!
    ) {
      return NextResponse.json(
        { success: false, message: "Reward already claimed" },
        { status: 400 }
      );
    }

    const nextClaimDeadline = new Date(now.setDate(now.getDate() + 1));

    const {reward: rewardAmount, apr} = calculateDailyReward(
      stakingPosition.amount, 
      Number(stakingPosition.stakingPlan.apr),
      Number(stakingPosition.stakingPlan.aprMax),
    );

    await prisma.$transaction([
      // Update the nextClaimDeadline column in staking position
      prisma.stakingPosition.update({
        where: {
          id: stakingPosition.id,
        },
        data: {
          lastClaimedAt: new Date(),
          nextClaimDeadline,
        },
      }),
      // Update reward to claimed
      prisma.reward.create({
        data: {
          userId: stakingPosition.userId,
          stakingPositionId: stakingPosition.id,
          amount: rewardAmount,
          status: RewardStatus.CLAIMED,
          claimedAt: new Date(),
        },
      }),
      // Increment the user's balance
      prisma.user.update({
        where: {
            id: stakingPosition.userId
        },
        data: {
            balance: {
                increment: rewardAmount
            }
        }
      }),
      // Log the activity
      prisma.activity.create({
        data: {
          userId,
          type: "REWARD",
          amount: rewardAmount,
          data: {
            details: `Claimed ${rewardAmount} USDT reward`,
            //   relatedId: rewardId,
          },
        },
      }),
    ]);

    // Update the nextClaimDeadline column in staking position
    // await prisma.stakingPosition.update({
    //   where: {
    //     id: stakingPosition.id,
    //   },
    //   data: {
    //     nextClaimDeadline,
    //   },
    // });

    // Update reward to claimed
    // await prisma.reward.create({
    //   data: {
    //     userId: stakingPosition.userId,
    //     stakingPositionId: stakingPosition.id,
    //     amount: calculateDailyReward(
    //       stakingPosition.amount,
    //       Number(stakingPosition.apy)
    //     ),
    //     status: RewardStatus.CLAIMED,
    //     claimedAt: new Date(),
    //   },
    // });

    // Log the activity
    // await prisma.activity.create({
    //   data: {
    //     userId,
    //     type: "REWARD",
    //     amount: stakingPosition.amount,
    //     data: {
    //       details: `Claimed ${stakingPosition.amount} USDT reward`,
    //       //   relatedId: rewardId,
    //     },
    //   },
    // });

    return NextResponse.json({
      success: true,
      data: { success: true },
    });
  } catch (error) {
    console.error("Error claiming reward:", error);
    return NextResponse.json(
      { success: false, message: "Failed to claim reward" },
      { status: 500 }
    );
  }
}
