"use client"

import { useAuthContext } from "@/app/context/AuthContext"
import { useState, useEffect } from "react"

// Types for referral data
export interface DirectReferral {
  id: string
  username: string
  isActive: boolean
  joinedAt: string
  totalStaked: number
  bonusEarned: number
  referralCount: number
  downlineBonus: number
}

export interface DownlineReferral {
  id: string
  username: string
  isActive: boolean
  joinedAt: string
  totalStaked: number
  bonusEarned: number
  referredBy: string
}

export interface ReferralData {
  referralCode: string
  totalReferrals: number
  totalBonus: number
  directReferrals: DirectReferral[]
  downlineReferrals: DownlineReferral[]
}

export function useReferrals() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { user } = useAuthContext()

  const fetchReferralData = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/referrals")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()
      setReferralData(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch referral data"))
      console.error("Error fetching referral data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch referral stats only (lightweight version)
  const fetchReferralStats = async () => {
    if (!user) {
      return null
    }

    try {
      const response = await fetch("/api/referrals/stats")

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return {
        referralCode: data.referralCode,
        totalReferrals: data.totalReferrals,
        totalBonus: data.totalBonus,
      }
    } catch (err) {
      console.error("Error fetching referral stats:", err)
      return null
    }
  }

  // Claim a referral bonus
  const claimBonus = async (bonusId: string) => {
    if (!user) {
      throw new Error("User not authenticated")
    }

    try {
      const response = await fetch("/api/referrals/claim-bonus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bonusId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()

      // Refresh referral data after claiming bonus
      await fetchReferralData()

      return data
    } catch (err) {
      console.error("Error claiming bonus:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchReferralData()
  }, [user])

  return {
    referralData,
    isLoading,
    error,
    refreshReferrals: fetchReferralData,
    fetchReferralStats,
    claimBonus,
  }
}
