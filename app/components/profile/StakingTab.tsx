"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { profileApi } from "@/lib/profile"
import type { StakingPosition } from "@/app/model"
import { Skeleton } from "@/app/components/ui/skeleton"
import { toast } from "@/app/hooks/use-toast"

const StakingTab = () => {
  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingPositions, setProcessingPositions] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchStakingPositions = async () => {
      try {
        setIsLoading(true)
        const data = await profileApi.getStakingPositions()
        setStakingPositions(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch staking positions:", err)
        setError("Failed to load staking positions. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStakingPositions()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleClaimRewards = async (positionId: string) => {
    // In a real implementation, you would call an API to claim rewards
    // For now, we'll just show a toast
    toast({
      title: "Rewards Claimed",
      description: "Your rewards have been successfully claimed.",
    })
  }

  const handleUnstake = async (positionId: string) => {
    try {
      setProcessingPositions((prev) => ({ ...prev, [positionId]: true }))

      await profileApi.unstakePosition(positionId)

      // Update the local state to reflect the change
      setStakingPositions((prev) => prev.map((pos) => (pos.id === positionId ? { ...pos, isActive: false } : pos)))

      toast({
        title: "Position Unstaked",
        description: "Your staking position has been successfully unstaked.",
      })
    } catch (err) {
      console.error("Failed to unstake position:", err)
      toast({
        title: "Unstake Failed",
        description: "There was an error unstaking your position. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingPositions((prev) => ({ ...prev, [positionId]: false }))
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
      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle>Your Staking Positions</CardTitle>
          <CardDescription>Manage your active staking positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeleton
              Array(2)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="p-4 rounded-lg bg-black/30 border border-white/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <div className="flex flex-col md:items-end">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-4 w-16 mt-1" />
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-28" />
                        <Skeleton className="h-9 w-20" />
                      </div>
                    </div>
                  </div>
                ))
            ) : stakingPositions.length > 0 ? (
              // Actual staking positions
              stakingPositions.map((position) => (
                <div
                  key={position.id}
                  className={`p-4 rounded-lg ${position.isActive ? "bg-black/30" : "bg-gray-900/20"} border ${position.isActive ? "border-white/5" : "border-gray-800/50"}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{position.planName} Plan</h4>
                        <Badge
                          className={
                            position.isActive
                              ? "bg-green-500/20 text-green-400 border-green-500/20"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/20"
                          }
                        >
                          {position.isActive ? "Active" : "Unstaked"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        Started on {formatDate(position.startDate)} • Network: {position.network}
                        {position.endDate && ` • Ended on ${formatDate(position.endDate)}`}
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

                    {position.isActive && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleClaimRewards(position.id)}
                          disabled={position.rewards <= 0}
                        >
                          Claim Rewards
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-950/20"
                          onClick={() => handleUnstake(position.id)}
                          disabled={processingPositions[position.id]}
                        >
                          {processingPositions[position.id] ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Unstaking...
                            </>
                          ) : (
                            "Unstake"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // No staking positions
              <div className="text-center py-8 text-gray-400">
                <p>You don't have any staking positions yet.</p>
                <p className="mt-2">Start staking to earn rewards!</p>
              </div>
            )}

            <div className="flex justify-center mt-4">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600" asChild>
                <Link href="/#plans">Stake More USDR</Link>
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
          {isLoading ? (
            <div className="space-y-4">
              {Array(2)
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
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No rewards have been claimed yet.</p>
              <p className="mt-2">Rewards are automatically calculated daily.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StakingTab
