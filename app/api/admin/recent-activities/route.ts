export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/auth_validator";

// This route is used to get the recent activities of the user
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

    // Fetch recent activities
    const recentActivities = await prisma.activity.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true, // Assuming you have a username field in the user table
          },
        },
      },
      take: 10,
    });

    const formattedActivities = recentActivities.map((activity) => {
      return {
        id: activity.id,
        type: activity.type,
        user: activity.user.username,
        data: activity.data,
        time: new Date(activity.createdAt).toLocaleString(), // Format the date as needed
      };
    });

    console.log("🚀 ~ GET ~ formattedActivities:", formattedActivities);
    return NextResponse.json(
      { success: true, data: formattedActivities },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
