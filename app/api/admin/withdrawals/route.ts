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

    // Fetch all withdrawals
    const withdrawals = await prisma.withdrawal.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedWithdrawals = withdrawals.map((withdrawal) => ({
      id: withdrawal.id,
      userId: withdrawal.userId,
      amount: withdrawal.amount,
      wallet: withdrawal.wallet,
      network: withdrawal.network,
      status: withdrawal.status,
      createdAt: withdrawal.createdAt.toISOString(),
      updatedAt: withdrawal.updatedAt.toISOString(),
      user: {
        id: withdrawal.user.id,
        username: withdrawal.user.username,
      },
    }));

    return NextResponse.json({ success: true, data: formattedWithdrawals }, { status: 200 });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
