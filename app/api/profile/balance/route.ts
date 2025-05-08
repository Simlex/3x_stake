import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/app/api/services/auth";
import { cookies } from "next/headers";
import { subDays, isAfter } from "date-fns";

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

    // Fetch user balance and all staking positions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        balance: true,
        stakingPositions: {
          select: {
            amount: true,
            startDate: true,
            rewards: {
              where: { status: "PENDING" }, // unclaimed rewards
              select: { amount: true, createdAt: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    let lockedAmount = 0;

    const now = new Date();

    for (const position of user.stakingPositions) {
      const isLocked = isAfter(subDays(now, 30), position.startDate) === false;
      if (isLocked) {
        lockedAmount += position.amount;

        for (const reward of position.rewards) {
          // Also consider unclaimable profit if within 30 days
          lockedAmount += reward.amount;
        }
      }
    }
    console.log("🚀 ~ GET ~ lockedAmount:", lockedAmount)

    const withdrawableBalance = Math.max(user.balance - lockedAmount, 0);
    
    // fetch the sum amount of all pending withdrawals
    const pendingWithdrawals = await prisma.withdrawal.aggregate({
      where: {
        userId,
        status: "PENDING",
      },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        withdrawableBalance,
        pendingWithdrawals: pendingWithdrawals._sum.amount || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching user withdrawable balance:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user withdrawable balance" },
      { status: 500 }
    );
  }
}
