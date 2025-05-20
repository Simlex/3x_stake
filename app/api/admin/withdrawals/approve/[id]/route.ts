export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/auth_validator";
import { StakingPositionDepositStatus, WithdrawalStatus } from "@prisma/client";

// The handler to approve a withdrawal request
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

    const withdrawalId = params.id;

    // Fetch the withdrawal data
    const withdrawal = await prisma.withdrawal.findUnique({
      where: {
        id: withdrawalId,
      }
    });

    // Check if the withdrawal exists
    if (!withdrawal) {
      return NextResponse.json(
        { success: false, message: "Withdrawal not found" },
        { status: 404 }
      );
    }

    // Approve the withdrawal
    const updatedWithdrawal = await prisma.withdrawal.update({
      where: {
        id: withdrawalId,
      },
      data: {
        status: WithdrawalStatus.APPROVED,
      },
    });

    return NextResponse.json({ success: true, data: updatedWithdrawal });
  } catch (error) {
    console.error("Error approving withdrawal:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
