// app/api/rewards/[userId]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/app/api/services/auth";
import { cookies } from "next/headers";
import { RewardStatus } from "@/app/model";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Authentication
    const authToken = cookies().get("auth_token")?.value;
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const session = await validateSession(authToken);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Invalid session" },
        { status: 401 }
      );
    }

    // Verify the requesting user has permission to view these rewards
    if (session.user.id !== params.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to view these rewards" },
        { status: 403 }
      );
    }

    // Fetch all claimed rewards
    const rewards = await prisma.reward.findMany({
      where: {
        userId: params.userId,
        status: RewardStatus.CLAIMED,
      },
      include: {
        stakingPosition: {
          select: {
            id: true,
            amount: true,
            apy: true,
            network: true,
          },
        },
      },
      orderBy: {
        claimedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: rewards,
    });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch rewards" },
      { status: 500 }
    );
  }
}
