export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/auth_validator";
import { StakingPositionDepositStatus } from "@prisma/client";

// The handler to get the users data for the admin
export async function POST(
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

    const stakingPositionId = params.id;

    // Fetch the staking position data
    const stakingPosition = await prisma.stakingPosition.findUnique({
      where: {
        id: stakingPositionId,
      },
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
      },
    });

    // Check if the staking position exists
    if (!stakingPosition) {
      return NextResponse.json(
        { success: false, message: "Staking position not found" },
        { status: 404 }
      );
    }

    // Approve the deposit
    const updatedStakingPosition = await prisma.stakingPosition.update({
      where: {
        id: stakingPositionId,
      },
      data: {
        depositStatus: StakingPositionDepositStatus.REJECTED,
        isActive: false,
        user: {
            update: {
                balance: {
                    decrement: stakingPosition.amount
                }
            }
        }
      },
    });

    return NextResponse.json({ success: true, data: updatedStakingPosition });
  } catch (error) {
    console.error("Error fetching deposits data:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
