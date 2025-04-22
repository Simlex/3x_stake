"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Wallet, Users, Clock, ChevronRight, CreditCard } from "lucide-react"
import Link from "next/link"
import { profileApi } from "@/lib/profile"
import { type UserProfileSummary, ActivityType } from "@/app/model"
import { Skeleton } from "@/app/components/ui/skeleton"

const OverviewTab = () => {
  const [profileData, setProfileData] = useState<UserProfileSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true)
        const data = await profileApi.getProfileSummary()
        setProfileData(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch profile data:", err)
        setError("Failed to load profile data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Activity icon based on type
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.STAKE:
        return <Wallet className="h-4 w-4" />
      case ActivityType.UNSTAKE:
        return <Wallet className="h-4 w-4" />
      case ActivityType.REWARD:
        return <CreditCard className="h-4 w-4" />
      case ActivityType.REFERRAL:
        return <Users className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Activity background color based on type
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-purple-500" />
              Staking Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Staked</span>
                {isLoading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <span className="font-medium">${profileData?.totalStaked.toLocaleString()}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Positions</span>
                {isLoading ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  <span className="font-medium">{profileData?.activePositions}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Rewards</span>
                {isLoading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <span className="font-medium text-green-500">${profileData?.totalRewards.toLocaleString()}</span>
                )}
              </div>

              <Button variant="outline" className="w-full mt-2" asChild>
                <Link href="/#plans">
                  Stake More <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-pink-500" />
              Referral Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Your Referrals</span>
                {isLoading ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  <span className="font-medium">{profileData?.referrals}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">APR Boost</span>
                {isLoading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <span className="font-medium text-green-500">
                    +{((profileData?.referrals || 0) * 0.01).toFixed(2)}%
                  </span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Referral Code</span>
                {isLoading ? (
                  <Skeleton className="h-6 w-32" />
                ) : (
                  <span className="font-medium text-purple-400">{profileData?.referralCode}</span>
                )}
              </div>

              <Button variant="outline" className="w-full mt-2" asChild>
                <Link href="/referrals">
                  View Referrals <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-amber-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeleton
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-48 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))
            ) : profileData?.recentActivity && profileData.recentActivity.length > 0 ? (
              // Actual activity data
              profileData.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getActivityBgColor(activity.type)}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.details}</p>
                      <p className="text-xs text-gray-400">{formatDate(activity.date)}</p>
                    </div>
                  </div>
                  <div className="font-medium">
                    {activity.type === ActivityType.STAKE || activity.type === ActivityType.UNSTAKE ? "-" : "+"} $
                    {activity.amount}
                  </div>
                </div>
              ))
            ) : (
              // No activity
              <div className="text-center py-8 text-gray-400">
                <p>No recent activity found.</p>
                <p className="mt-2">Your transactions will appear here.</p>
              </div>
            )}

            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/profile?tab=activity">
                View All Activity <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OverviewTab
