export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/auth_validator";

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

    // Fetch users data
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        stakingPositions: true,
        activities: true,
        rewards: true,
      },
    });
    
    const formattedUsers = users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        totalStaked: user.stakingPositions.reduce(
            (acc, position) => acc + position.amount,
            0
        ),
        activePositions: user.stakingPositions.filter(
            (position) => position.isActive
        ).length,
        totalRewards: user.rewards.reduce(
            (acc, reward) => acc + reward.amount,
            0
        ),
        joinedAt: user.createdAt.toISOString()
    }));

    return NextResponse.json({ success: true, data: formattedUsers });
  } catch (error) {
    console.error("Error fetching users data:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
