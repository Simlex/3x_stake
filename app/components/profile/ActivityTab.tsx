"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Wallet, CreditCard, Users, LogIn, UserPlus } from "lucide-react"
import { profileApi } from "@/lib/profile"
import { type Activity, ActivityType } from "@/app/model"
import { Skeleton } from "@/app/components/ui/skeleton"
import { Button } from "@/app/components/ui/button"

const ActivityTab = () => {
  const [activityData, setActivityData] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setIsLoading(true)
        const data = await profileApi.getActivityHistory()
        setActivityData(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch activity data:", err)
        setError("Failed to load activity data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivityData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get icon based on activity type
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.STAKE:
        return <Wallet className="h-5 w-5" />
      case ActivityType.UNSTAKE:
        return <Wallet className="h-5 w-5" />
      case ActivityType.REWARD:
        return <CreditCard className="h-5 w-5" />
      case ActivityType.REFERRAL:
        return <Users className="h-5 w-5" />
      case ActivityType.LOGIN:
        return <LogIn className="h-5 w-5" />
      case ActivityType.SIGNUP:
        return <UserPlus className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  // Get background color based on activity type
  const getActivityBgColor = (type: ActivityType) => {
    switch (type) {
      case ActivityType.STAKE:
        return "bg-purple-500/20 text-purple-400"
      case ActivityType.UNSTAKE:
        return "bg-amber-500/20 text-amber-400"
      case ActivityType.REWARD:
        return "bg-green-500/20 text-green-400"
      case ActivityType.REFERRAL:
        return "bg-blue-500/20 text-blue-400"
      case ActivityType.LOGIN:
        return "bg-gray-500/20 text-gray-400"
      case ActivityType.SIGNUP:
        return "bg-pink-500/20 text-pink-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-500/20 rounded-lg text-center">
        <p className="text-red-200">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-0 glass-effect">
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
        <CardDescription>Track your recent transactions and account activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </div>
                </div>
              ))
          ) : activityData.length > 0 ? (
            // Actual activity data
            activityData.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${getActivityBgColor(activity.type)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium">{activity.details}</p>
                    <p className="text-sm text-gray-400">{formatDate(activity.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-medium ${
                      activity.type === ActivityType.STAKE || activity.type === ActivityType.UNSTAKE
                        ? ""
                        : activity.type === ActivityType.REWARD || activity.type === ActivityType.REFERRAL
                          ? "text-green-500"
                          : ""
                    }`}
                  >
                    {activity.amount > 0 && (
                      <>
                        {activity.type === ActivityType.STAKE || activity.type === ActivityType.UNSTAKE ? "-" : "+"} $
                        {activity.amount}
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">{activity.type}</div>
                </div>
              </div>
            ))
          ) : (
            // No activity
            <div className="text-center py-8 text-gray-400">
              <p>No activity recorded yet.</p>
              <p className="mt-2">Your transactions will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ActivityTab
