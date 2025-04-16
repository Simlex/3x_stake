"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import Link from "next/link"

// Mock data - replace with actual data from your API
const stakingPositions = [
  {
    id: "stake-1",
    planName: "Silver",
    amount: 1500,
    network: "BEP20",
    startDate: "2023-02-10T00:00:00Z",
    apr: 3.5,
    rewards: 52.5,
    isActive: true,
  },
  {
    id: "stake-2",
    planName: "Bronze",
    amount: 1000,
    network: "SOL",
    startDate: "2023-03-05T00:00:00Z",
    apr: 3,
    rewards: 30,
    isActive: true,
  },
]

const StakingTab = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle>Your Staking Positions</CardTitle>
          <CardDescription>Manage your active staking positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stakingPositions.map((position) => (
              <div key={position.id} className="p-4 rounded-lg bg-black/30 border border-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{position.planName} Plan</h4>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/20">Active</Badge>
                    </div>
                    <div className="text-sm text-gray-400">
                      Started on {formatDate(position.startDate)} • Network: {position.network}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end">
                    <div className="text-lg font-bold">${position.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">APR: {position.apr}%</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Rewards earned</div>
                    <div className="text-lg font-medium text-green-500">${position.rewards.toLocaleString()}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Claim Rewards
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-950/20">
                      Unstake
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-4">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600" asChild>
                <Link href="/stake">Stake More USDR</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle>Rewards History</CardTitle>
          <CardDescription>Track your staking rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <p>No rewards have been claimed yet.</p>
            <p className="mt-2">Rewards are automatically calculated daily.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StakingTab
