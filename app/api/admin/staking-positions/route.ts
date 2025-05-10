export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/auth_validator";
import { is } from "cheerio/dist/commonjs/api/traversing";

// The handler to get the users data for the admin
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

    // Fetch all staking positions
    const positions = await prisma.stakingPosition.findMany({
      include: {
        stakingPlan: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        rewards: {
          select: {
            amount: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedPositions = positions.map((position) => ({
      id: position.id,
      userId: position.userId,
      username: position.user.username,
      planName: position.stakingPlan.name,
      amount: position.amount,
      network: position.network,
      startDate: new Date(position.startDate).toLocaleString(),
      endDate: position.endDate
        ? new Date(position.endDate).toLocaleString()
        : null,
      apr: position.apy,
      rewards: position.rewards.reduce((acc, reward) => acc + reward.amount, 0),
      isActive: position.isActive,
      depositStatus: position.depositStatus,
    }));

    return NextResponse.json({ success: true, data: formattedPositions });
  } catch (error) {
    console.error("Error fetching staking positions data:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
