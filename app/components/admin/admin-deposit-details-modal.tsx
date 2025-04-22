"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, User, ExternalLink, Copy, Check } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { useState } from "react"

interface AdminDepositDetailsModalProps {
  deposit: any
  isOpen: boolean
  onClose: () => void
  onApprove: () => void
}

export function AdminDepositDetailsModal({ deposit, isOpen, onClose, onApprove }: AdminDepositDetailsModalProps) {
  const [isCopied, setIsCopied] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/20">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/20">Rejected</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/20">{status}</Badge>
    }
  }

  const handleCopyTxHash = () => {
    navigator.clipboard.writeText(deposit.txHash)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
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
            <h3 className="text-lg font-medium">Deposit Details</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Deposit #{deposit.id.substring(0, 8)}</h2>
                {getStatusBadge(deposit.status)}
              </div>
              <div className="text-2xl font-bold">${deposit.amount.toLocaleString()}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                <h4 className="font-medium">Deposit Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID</span>
                    <span className="font-mono text-sm">{deposit.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network</span>
                    <span>{deposit.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plan</span>
                    <span>{deposit.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date</span>
                    <span>{formatDate(deposit.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span>{getStatusBadge(deposit.status)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                <h4 className="font-medium">User Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Username</span>
                    <span>{deposit.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">User ID</span>
                    <span className="font-mono text-sm">{deposit.userId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">View User</span>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <User className="h-4 w-4 mr-1" /> Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4 space-y-3 mb-6">
              <h4 className="font-medium">Transaction Details</h4>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-gray-400">Transaction Hash</label>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-900/80 p-3 rounded-md text-xs font-mono break-all">
                      {deposit.txHash}
                    </div>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={handleCopyTxHash}>
                      {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">View on Explorer</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() =>
                      window.open(
                        `https://explorer.${deposit.network.toLowerCase()}.com/tx/${deposit.txHash}`,
                        "_blank",
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> Explorer
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {deposit.status === "pending" && (
                <div className="space-x-2">
                  <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-950/20">
                    Reject
                  </Button>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600" onClick={onApprove}>
                    Approve Deposit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
