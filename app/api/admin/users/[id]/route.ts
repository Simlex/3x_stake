export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/auth_validator";

// The handler to get the user data for the admin
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = params.id;

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        stakingPositions: {
          include: {
            stakingPlan: {
              select: {
                name: true,
              },
            },
            rewards: {
              select: {
                amount: true,
              },
            },
          },
        },
        activities: true,
        rewards: true,
      },
    });

    // if user not found
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const formattedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stakingPositions: user.stakingPositions.map((position) => ({
        id: position.id,
        planName: position.stakingPlan.name,
        network: position.network,
        amount: position.amount,
        startDate: position.startDate,
        endDate: position.endDate,
        apr: position.apy,
        rewards: position.rewards.reduce(
          (acc, reward) => acc + reward.amount,
          0
        ),
        isActive: position.isActive,
        lastClaimedAt: position.lastClaimedAt,
      })),
      activities: user.activities.map((activity) => ({
        id: activity.id,
        type: activity.type,
        data: activity.data,
        amount: activity.amount,
        date: activity.createdAt,
      })),
      rewards: user.rewards.map((reward) => ({
        id: reward.id,
        amount: reward.amount,
        status: reward.status,
        createdAt: reward.createdAt,
      })),
    };

    return NextResponse.json({
      success: true,
      data: formattedUser,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
