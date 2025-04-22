"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Wallet, Clock, Mail, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

interface AdminUserDetailsModalProps {
  user: any
  isOpen: boolean
  onClose: () => void
}

export function AdminUserDetailsModal({ user, isOpen, onClose }: AdminUserDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for user stakes and activity
  const userStakes = [
    {
      id: "stake-1",
      planName: "Silver",
      amount: 2500,
      network: "BEP20",
      startDate: "2023-02-10T00:00:00Z",
      apr: 3.5,
      rewards: 87.5,
      status: "active",
    },
    {
      id: "stake-2",
      planName: "Bronze",
      amount: 1000,
      network: "SOL",
      startDate: "2023-03-05T00:00:00Z",
      apr: 3,
      rewards: 30,
      status: "active",
    },
  ]

  const userActivity = [
    {
      id: "act-1",
      type: "STAKE",
      amount: 2500,
      date: "2023-02-10T00:00:00Z",
      details: "Staked 2500 USDR in Silver Plan",
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
      amount: 75,
      date: "2023-04-01T00:00:00Z",
      details: "Claimed 75 USDR rewards",
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/20">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/20">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/20">Suspended</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/20">{status}</Badge>
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-full max-w-3xl bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-medium">User Details</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl font-bold">
                  {user.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{user.email}</span>
                  </div>
                </div>
              </div>
              <div className="md:ml-auto flex items-center gap-3">
                {getStatusBadge(user.status)}
                <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-950/20">
                  <Shield className="mr-2 h-4 w-4" /> Suspend User
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="stakes">Staking Positions</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/30 rounded-lg p-4 space-y-4">
                    <h4 className="font-medium">Account Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">User ID</span>
                        <span>{user.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span>{getStatusBadge(user.status)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Joined</span>
                        <span>{formatDate(user.joinedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Login</span>
                        <span>{formatDate(user.lastLogin)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4 space-y-4">
                    <h4 className="font-medium">Staking Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Staked</span>
                        <span>${user.totalStaked.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Positions</span>
                        <span>{user.activePositions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Rewards</span>
                        <span className="text-green-400">${user.totalRewards.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-800/30 rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Recent Activity</h4>
                  <div className="space-y-3">
                    {userActivity.slice(0, 3).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              activity.type === "STAKE"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {activity.type === "STAKE" ? <Wallet className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
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
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stakes">
                <div className="space-y-4">
                  {userStakes.map((stake) => (
                    <div key={stake.id} className="p-4 rounded-lg bg-gray-800/30 border border-white/5 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{stake.planName} Plan</h4>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/20">Active</Badge>
                          </div>
                          <div className="text-sm text-gray-400">
                            Started on {formatDate(stake.startDate)} • Network: {stake.network}
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end">
                          <div className="text-lg font-bold">${stake.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-400">APR: {stake.apr}%</div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-white/5">
                        <div>
                          <div className="text-sm text-gray-400">Rewards earned</div>
                          <div className="text-lg font-medium text-green-500">${stake.rewards.toLocaleString()}</div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-950/20"
                        >
                          Terminate Position
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <div className="space-y-4">
                  {userActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                            activity.type === "STAKE"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {activity.type === "STAKE" ? <Wallet className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{activity.details}</p>
                          <p className="text-sm text-gray-400">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${activity.type === "STAKE" ? "" : "text-green-500"}`}>
                          {activity.type === "STAKE" ? "-" : "+"} ${activity.amount}
                        </div>
                        <div className="text-sm text-gray-400">{activity.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="security">
                <div className="space-y-6">
                  <div className="bg-gray-800/30 rounded-lg p-4 space-y-4">
                    <h4 className="font-medium">Login History</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-black/30 border border-white/5">
                        <div>
                          <p className="font-medium">Successful login</p>
                          <p className="text-xs text-gray-400">IP: 192.168.1.1 • Chrome on Windows</p>
                        </div>
                        <p className="text-sm text-gray-400">2 hours ago</p>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-black/30 border border-white/5">
                        <div>
                          <p className="font-medium">Successful login</p>
                          <p className="text-xs text-gray-400">IP: 192.168.1.1 • Chrome on Windows</p>
                        </div>
                        <p className="text-sm text-gray-400">2 days ago</p>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-black/30 border border-white/5">
                        <div>
                          <p className="font-medium text-amber-400">Failed login attempt</p>
                          <p className="text-xs text-gray-400">IP: 203.0.113.1 • Firefox on Mac</p>
                        </div>
                        <p className="text-sm text-gray-400">5 days ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Security Settings</h4>
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20">2FA Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-400">User has not enabled 2FA</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Force Enable
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-4 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
