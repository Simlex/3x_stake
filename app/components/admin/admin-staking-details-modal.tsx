"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, User, AlertTriangle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { UserStakingPosition } from "@/app/model/IAdmin"

interface AdminStakingDetailsModalProps {
  position: UserStakingPosition
  isOpen: boolean
  onClose: () => void
}

export function AdminStakingDetailsModal({ position, isOpen, onClose }: AdminStakingDetailsModalProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Active"
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
      case "completed":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20">Completed</Badge>
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20">Pending</Badge>
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
          className="w-full max-w-2xl bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-medium">Staking Position Details</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{position.planName} Plan</h2>
                {getStatusBadge(position.isActive ? "active" : "inactive")}
              </div>
              <div className="text-2xl font-bold">${position.amount.toLocaleString()}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                <h4 className="font-medium">Position Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID</span>
                    <span className="font-mono text-sm">{position.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network</span>
                    <span>{position.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">APR</span>
                    <span className="text-purple-400">{position.apr}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Start Date</span>
                    <span>{formatDate(position.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">End Date</span>
                    <span>{formatDate(position.endDate)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                <h4 className="font-medium">Rewards</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Rewards</span>
                    <span className="text-green-400">${position.rewards.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Reward</span>
                    <span className="text-green-400">${((position.amount * position.apr) / 100 / 365).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Annual Projection</span>
                    <span className="text-green-400">${((position.amount * position.apr) / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4 space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">User Information</h4>
                {/* <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" /> View User
                </Button> */}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Username</span>
                  <span>{position.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">User ID</span>
                  <span className="font-mono text-sm">{position.userId}</span>
                </div>
              </div>
            </div>

            {position.isActive && (
              <div className="flex items-center p-4 bg-amber-900/20 border border-amber-500/20 rounded-lg mb-6">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-200">Terminating this position</p>
                  <p className="text-sm text-amber-200/80">
                    If you terminate this position, the user will receive their staked amount back, but will lose any
                    unclaimed rewards.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {position.isActive ? (
                <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-950/20">
                  Terminate Position
                </Button>
              ) : <></>}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
