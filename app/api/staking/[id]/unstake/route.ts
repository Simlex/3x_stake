import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/app/api/services/auth";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const positionId = params.id;

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

    // Find the staking position
    const position = await prisma.stakingPosition.findUnique({
      where: {
        id: positionId,
      },
    });

    if (!position) {
      return NextResponse.json(
        { success: false, message: "Staking position not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (position.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.$transaction([
      // Update position to inactive
      prisma.stakingPosition.update({
        where: {
          id: positionId,
        },
        data: {
          isActive: false,
          endDate: new Date(),
        },
      }),
      // Add the unstaked amount to the user's balance
      prisma.user.update({
        where: {
          id: userId,
        },
        // data: {
        //   balance: {
        //     increment: position.amount,
        //   },
        // },
      }),
      // Log the activity
      prisma.activity.create({
        data: {
          userId,
          type: "UNSTAKE",
          amount: position.amount,
          data: {
            details: `Unstaked ${position.amount} USDR`,
            relatedId: positionId,
          },
        },
      }),
    ]);

    // Update position to inactive
    // await prisma.stakingPosition.update({
    //   where: {
    //     id: positionId,
    //   },
    //   data: {
    //     isActive: false,
    //     endDate: new Date(),
    //   },
    // })

    // Add the unstaked amount to the user's balance
    // await prisma.user.update({
    //     where: {
    //         id: userId
    //     },
    //     data: {
    //         balance: {
    //             increment: position.amount;
    //         }
    //     }
    // })

    // Log the activity
    // await prisma.activity.create({
    //   data: {
    //     userId,
    //     type: "UNSTAKE",
    //     amount: position.amount,
    //     data: {
    //       details: `Unstaked ${position.amount} USDR`,
    //       relatedId: positionId,
    //     },
    //   },
    // })

    return NextResponse.json({
      success: true,
      data: { success: true },
    });
  } catch (error) {
    console.error("Error unstaking position:", error);
    return NextResponse.json(
      { success: false, message: "Failed to unstake position" },
      { status: 500 }
    );
  }
}
