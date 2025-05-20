import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateSession } from "@/app/api/services/auth"
import { cookies } from "next/headers"

// Method to handle GET requests for user withdrawal initiation
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

    // Check if a user with the given ID exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Parse the request body to get withdrawal details
    const { amount, address, network, stakingPositionId } = await req.json()

    if (!amount || !address || !network) {
      return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 })
    }
    
    console.log("🚀 ~ POST ~ stakingPositionId:", stakingPositionId)

    // Create a withdrawal record in the database
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        amount,
        wallet: address,
        network,
        stakingPositionId: stakingPositionId
      },
    })
    
    await prisma.stakingPosition.update({
        where: {
            id: stakingPositionId
        },
        data: {
            withdrawal: {
                connect: {
                    id: withdrawal.id
                }
            }
        }
    })
    
    // Return a success response with the withdrawal details
    return NextResponse.json({ success: true, withdrawal }, { status: 201 })

  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch user profile" }, { status: 500 })
  }
}