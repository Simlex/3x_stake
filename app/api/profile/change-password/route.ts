import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateSession } from "@/app/api/services/auth"
import { cookies } from "next/headers"
import { compare, hash } from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    // Get auth token from cookies
    const authToken = cookies().get("auth_token")?.value

    if (!authToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Validate the session
    const session = await validateSession(authToken)

    if (!session) {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 })
    }

    const userId = session.user.id
    const { currentPassword, newPassword } = await req.json()

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    })

    // Log the activity
    await prisma.activity.create({
      data: {
        userId,
        type: "SECURITY",
        amount: 0,
        data: {
          details: "Password changed",
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: { success: true },
    })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ success: false, message: "Failed to change password" }, { status: 500 })
  }
}
