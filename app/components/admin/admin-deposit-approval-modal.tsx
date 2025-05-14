"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"

interface AdminDepositApprovalModalProps {
  deposit: any
  isOpen: boolean
  onClose: () => void
  onConfirm: (depositId: string, approved: boolean) => void
  isApprovingDeposit: boolean
  handleApprove: () => Promise<void>
}

export function AdminDepositApprovalModal({ deposit, isOpen, onClose, onConfirm, isApprovingDeposit: isApproving, handleApprove }: AdminDepositApprovalModalProps) {
  const [isRejecting, setIsRejecting] = useState(false)
  const [notes, setNotes] = useState("")

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-medium">Confirm Deposit Action</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">
                {deposit.username}'s Deposit of ${deposit.amount.toLocaleString()}
              </h2>
              <p className="text-gray-400">Please confirm if you want to approve or reject this deposit.</p>
            </div>

            {/* <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Admin Notes (Optional)</label>
              <Textarea
                placeholder="Add notes about this decision..."
                className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div> */}

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleApprove}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                disabled={isApproving || isRejecting}
              >
                {isApproving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve Deposit
                  </>
                )}
              </Button>
              {/* <Button
                onClick={handleReject}
                className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                disabled={isApproving || isRejecting}
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" /> Reject Deposit
                  </>
                )}
              </Button> */}
              <Button variant="outline" onClick={onClose} disabled={isApproving || isRejecting}>
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
