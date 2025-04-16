"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Wallet, Users, Clock, ChevronRight, CreditCard } from "lucide-react"
import Link from "next/link"

// Mock user data - replace with actual data from your API
const userData = {
  totalStaked: 2500,
  activePositions: 2,
  totalRewards: 125,
  referrals: 5,
  referralCode: "CRYPTO123",
  recentActivity: [
    {
      id: "act-1",
      type: "STAKE",
      amount: 1500,
      date: "2023-02-10T00:00:00Z",
      details: "Staked 1500 USDR in Silver Plan",
    },
    {
      id: "act-2",
      type: "STAKE",
      amount: 1000,
      date: "2023-03-05T00:00:00Z",
      details: "Staked 1000 USDR in Bronze Plan",
    },
    {
      id: "act-3",
      type: "REWARD",
      amount: 45,
      date: "2023-04-10T00:00:00Z",
      details: "Claimed 45 USDR rewards",
    },
  ],
}

const OverviewTab = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
                <span className="font-medium">${userData.totalStaked.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Positions</span>
                <span className="font-medium">{userData.activePositions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Rewards</span>
                <span className="font-medium text-green-500">${userData.totalRewards.toLocaleString()}</span>
              </div>

              <Button variant="outline" className="w-full mt-2" asChild>
                <Link href="/stake">
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
                <span className="font-medium">{userData.referrals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">APR Boost</span>
                <span className="font-medium text-green-500">+{(userData.referrals * 0.01).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Referral Code</span>
                <span className="font-medium text-purple-400">{userData.referralCode}</span>
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
            {userData.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      activity.type === "STAKE" ? "bg-purple-500/20 text-purple-400" : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {activity.type === "STAKE" ? <Wallet className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.details}</p>
                    <p className="text-xs text-gray-400">{formatDate(activity.date)}</p>
                  </div>
                </div>
                <div className="font-medium">
                  {activity.type === "STAKE" ? "-" : "+"} ${activity.amount}
                </div>
              </div>
            ))}

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
