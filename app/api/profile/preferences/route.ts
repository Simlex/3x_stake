import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateSession } from "@/lib/auth"
import { cookies } from "next/headers"
import { Theme } from "@/app/model"

export async function GET(req: NextRequest) {
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

    // Get user preferences
    let preferences = await prisma.userPreference.findUnique({
      where: {
        userId,
      },
    })

    // If preferences don't exist, create default ones
    if (!preferences) {
      preferences = await prisma.userPreference.create({
        data: {
          userId,
          theme: Theme.DARK,
          emailNotifications: true,
          pushNotifications: true,
          marketingEmails: false,
        },
      })
    }

    // Format for frontend
    const formattedPreferences = {
      id: preferences.id,
      userId: preferences.userId,
      theme: preferences.theme,
      emailNotifications: preferences.emailNotifications,
      stakingUpdates: preferences.pushNotifications, // Map to stakingUpdates for frontend
      marketingEmails: preferences.marketingEmails,
      securityAlerts: true, // Default to true as it's important
    }

    return NextResponse.json({
      success: true,
      data: formattedPreferences,
    })
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch user preferences" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
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
    const data = await req.json()

    // Map frontend preferences to database model
    const dbPreferences = {
      theme: data.theme,
      emailNotifications: data.emailNotifications,
      pushNotifications: data.stakingUpdates, // Map from stakingUpdates
      marketingEmails: data.marketingEmails,
    }

    // Update preferences (upsert in case they don't exist)
    const preferences = await prisma.userPreference.upsert({
      where: {
        userId,
      },
      update: dbPreferences,
      create: {
        userId,
        ...dbPreferences,
      },
    })

    // Format for frontend response
    const formattedPreferences = {
      id: preferences.id,
      userId: preferences.userId,
      theme: preferences.theme,
      emailNotifications: preferences.emailNotifications,
      stakingUpdates: preferences.pushNotifications,
      marketingEmails: preferences.marketingEmails,
      securityAlerts: true, // Default to true as it's important
    }

    return NextResponse.json({
      success: true,
      data: formattedPreferences,
    })
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return NextResponse.json({ success: false, message: "Failed to update user preferences" }, { status: 500 })
  }
}
