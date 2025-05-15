"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, ArrowUpRight } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { cn } from "@/lib/utils"

interface ZeroBalanceWithdrawModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ZeroBalanceWithdrawModal({ isOpen, onClose }: ZeroBalanceWithdrawModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
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
          className={cn(
            "w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden",
            isClosing && "opacity-0 scale-95 transition-all duration-200",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-medium">Withdraw Funds</h3>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-8 w-8 text-amber-400" />
                </div>
                <h4 className="text-xl font-medium mb-2">No Funds to Withdraw</h4>
                <p className="text-sm text-gray-400">You currently don't have any balance available for withdrawal.</p>
              </div>

              <Card className="border border-white/10 bg-black/30">
                <div className="p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Available Balance</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </div>
              </Card>

              <div className="flex items-center p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <ArrowUpRight className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Need funds?</h4>
                  <p className="text-xs text-gray-400">
                    You can earn rewards by staking your assets. Once you stake, keep claiming daily and you'll be able to withdraw your earnings after 30 days.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 border-gray-700" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}