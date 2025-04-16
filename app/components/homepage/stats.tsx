"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Coins, Trophy } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { cn } from "@/lib/utils"

// Initial stats
const INITIAL_STATS = {
  users: 1000,
  staked: 20000,
  rewards: 600,
}

// Daily increase rates
const DAILY_INCREASE = {
  users: 100,
  staked: Math.floor(Math.random() * 5000) + 1000, // Random between $1k-$5k
}

export function Stats() {
  const [stats, setStats] = useState(INITIAL_STATS)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Simulate stats increasing over time
    const interval = setInterval(() => {
      setStats((prev) => ({
        users: prev.users + Math.floor(DAILY_INCREASE.users / 24 / 60), // Increase per minute
        staked: prev.staked + Math.floor(DAILY_INCREASE.staked / 24 / 60), // Increase per minute
        rewards: (prev.staked * 0.03) / 365, // 3% APR calculated daily
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(Math.floor(num))
  }

  // Format currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.floor(num))
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <StatCard
            icon={<Users className="h-8 w-8 text-pink-500" />}
            title="Total Stakers"
            value={isClient ? formatNumber(stats.users) : "1,000+"}
            gradient="from-pink-500 to-pink-700"
          />

          <StatCard
            icon={<Coins className="h-8 w-8 text-purple-500" />}
            title="Total Staked"
            value={isClient ? formatCurrency(stats.staked) : "$20,000+"}
            gradient="from-purple-500 to-purple-700"
          />

          <StatCard
            icon={<Trophy className="h-8 w-8 text-amber-500" />}
            title="Rewards Paid"
            value={isClient ? formatCurrency(stats.rewards) : "$600+"}
            gradient="from-amber-500 to-amber-700"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5"
        >
          <StatCard
            icon={<Users className="h-8 w-8 text-pink-500" />}
            title="APY"
            value={"3%"}
            gradient="from-pink-500 to-pink-700"
          />

          <StatCard
            icon={<Trophy className="h-8 w-8 text-amber-500" />}
            title="Projected annual reward"
            value={"$500"}
            gradient="from-amber-500 to-amber-700"
          />
        </motion.div>
      </div>

      {/* Live users indicator */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 text-sm text-gray-300 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span>{Math.floor(Math.random() * 50) + 30} users online</span>
      </div>
    </section>
  )
}

function StatCard({
  icon,
  title,
  value,
  gradient,
}: {
  icon: React.ReactNode
  title: string
  value: string
  gradient: string
}) {
  return (
    <Card className="overflow-hidden border-0 glass-effect">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn("flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br", gradient)}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <h3 className="text-2xl md:text-3xl font-bold">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
