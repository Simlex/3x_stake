export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { StakingPositionDepositStatus } from "@prisma/client";
import { validateAdminSession } from "@/lib/auth_validator";

// The handler to get the dashboard stats data for the admin
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
    const session = await validateAdminSession(authToken);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Invalid session" },
        { status: 401 }
      );
    }

    const adminUserId = session.admin.id;

    // Check if the user is an admin
    const adminUser = await prisma.admin.findUnique({
      where: {
        id: adminUserId,
      },
    });

    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "User is not an admin" },
        { status: 403 }
      );
    }
    // Fetch dashboard stats
    const totalUsers = await prisma.user.count();
    const activeStakes = await prisma.stakingPosition.count({
      where: {
        isActive: true,
        depositStatus: StakingPositionDepositStatus.APPROVED,
      },
    });
    const pendingDeposits = await prisma.stakingPosition.count({
      where: {
        depositStatus: StakingPositionDepositStatus.PENDING,
      },
    });
    const totalStaked = await prisma.stakingPosition.aggregate({
      where: {
        depositStatus: StakingPositionDepositStatus.APPROVED,
      },
      _sum: {
        amount: true,
      },
    });
    const totalStakedAmount = totalStaked._sum.amount || 0;

    console.log("🚀 ~ GET ~ totalStakedAmount:", totalStakedAmount);

    // Return the stats
    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeStakes,
        pendingDeposits,
        totalStaked: totalStakedAmount,
      },
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch stats" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
