export const dynamic = 'force-dynamic';

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/app/api/services/auth";
import { cookies } from "next/headers";
import { StakingPositionDepositStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
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
    const { amount, planId, network, apr } = await req.json();

    // Validate input
    if (!amount || isNaN(amount)) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 }
      );
    }

    // Get user balance
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { id: true }
    // })
    const now = new Date();
    const endDate = new Date(now.setDate(now.getDate() + 30));

    const nextClaimDeadline = new Date(now.setDate(now.getDate() + 1));
    console.log("🚀 ~ POST ~ amount:", amount)

    // Create staking position with transaction
    const [stakingPosition, updatedUser] = await prisma.$transaction([
      prisma.stakingPosition.create({
        data: {
          userId,
          amount,
          startDate: new Date(),
          endDate,
          isActive: true,
          nextClaimDeadline,
          depositStatus: StakingPositionDepositStatus.PENDING,
          apy: apr, // Set your APY here or get from config
          planId,
          network,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
      }),
    ]);
    console.log("🚀 ~ POST ~ updatedUser:", updatedUser)

    // Log the activity
    await prisma.activity.create({
      data: {
        userId,
        type: "STAKE",
        amount,
        data: {
          details: `Staked ${amount} USDT`,
          relatedId: stakingPosition.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: stakingPosition.id,
        amount: stakingPosition.amount,
        startDate: stakingPosition.startDate,
        apy: stakingPosition.apy,
      },
    });
  } catch (error) {
    console.error("Error staking funds:", error);
    return NextResponse.json(
      { success: false, message: "Failed to stake funds" },
      { status: 500 }
    );
  }
}
