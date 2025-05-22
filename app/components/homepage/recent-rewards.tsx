"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"

// Generate random user data
const generateRandomUsers = (count: number) => {
  const users = []

  for (let i = 1; i <= count; i++) {
    const initialBalance = Math.floor(Math.random() * 9000) + 1000
    const reward = Math.floor(Math.random() * 100) + 10

    users.push({
      id: i,
      address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      balance: initialBalance,
      reward,
    })
  }

  return users
}

export function RecentRewards() {
  const [users, setUsers] = useState(generateRandomUsers(100))
  const [visibleUsers, setVisibleUsers] = useState<typeof users>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Rotate through users
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % users.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [users.length])

  // Update visible users when currentIndex changes
  useEffect(() => {
    const start = currentIndex
    const end = (currentIndex + 5) % users.length

    if (start < end) {
      setVisibleUsers(users.slice(start, end))
    } else {
      setVisibleUsers([...users.slice(start), ...users.slice(0, end)])
    }
  }, [currentIndex, users])

  return (
    <section className="py-20 relative" id="rewards">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="gradient-text">Recent Rewards</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            See how our users are earning rewards in real-time.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-0 glass-effect overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center">Live Rewards Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {visibleUsers.length > 0 && visibleUsers.map((user, index) => (
                  <motion.div
                    key={`${user.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                        {user.id}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.address}</p>
                        <p className="text-xs text-gray-400">Stakings: ${user.balance.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-500">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span className="font-medium">+${user.reward}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
