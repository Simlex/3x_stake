import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Get user ID from request headers (set by middleware)
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bonusId } = await req.json();

    if (!bonusId) {
      return NextResponse.json(
        { error: "Bonus ID is required" },
        { status: 400 }
      );
    }

    // Get the referral bonus
    const bonus = await prisma.referralBonus.findUnique({
      where: { id: bonusId },
    });

    if (!bonus) {
      return NextResponse.json({ error: "Bonus not found" }, { status: 404 });
    }

    // Verify the bonus belongs to the user
    if (bonus.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if bonus is already claimed
    if (bonus.status === "CLAIMED") {
      return NextResponse.json(
        { error: "Bonus already claimed" },
        { status: 400 }
      );
    }

    // Update bonus status to claimed
    const updatedBonus = await prisma.referralBonus.update({
      where: { id: bonusId },
      data: {
        status: "CLAIMED",
        claimedAt: new Date(),
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: "REWARD",
        title: "Referral Bonus Claimed",
        message: `You successfully claimed $${bonus.amount.toFixed(
          2
        )} in referral bonuses.`,
        data: {
          bonusId: bonus.id,
          amount: bonus.amount,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Bonus claimed successfully",
      bonus: updatedBonus,
    });
  } catch (error: any) {
    console.error("Error claiming referral bonus:", error);
    return NextResponse.json(
      { error: "Failed to claim referral bonus" },
      { status: 500 }
    );
  }
}
