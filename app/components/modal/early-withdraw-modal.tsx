import { StakingPosition } from "@/app/model";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { AlertCircle, Check, Clock, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RequestWithdrawal } from "@/app/model/IWithdrawal";
import { profileApi } from "@/lib/profile";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  position: StakingPosition | null;
  postFn?: () => Promise<void>;
};

export default function EarlyWithdrawModal({
  isOpen,
  onClose,
  position,
  postFn,
}: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Add a new state for wallet address and validation
  const [walletAddress, setWalletAddress] = useState("");
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Add a new state to track the current step in the withdrawal process
  const [currentStep, setCurrentStep] = useState<
    "details" | "address" | "confirm"
  >("details");

  if (!isOpen || !position) return null;

  // Calculate if withdrawal is early (less than 30 days)
  const startDate = new Date(position.startDate);
  const currentDate = new Date();
  const stakingDuration = Math.floor(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ); // in days
  const isEarlyWithdrawal = stakingDuration < 30;

  // Calculate penalty if early withdrawal
  const penaltyPercentage = isEarlyWithdrawal ? 0.6 : 0; // 60% penalty
  const penaltyAmount = position.amount * penaltyPercentage;
  const withdrawalAmount = position.amount - penaltyAmount;

  // Calculate remaining days until penalty-free withdrawal
  const remainingDays = Math.max(0, 30 - stakingDuration);

  // Replace the handleConfirm function with this updated version
  const handleConfirm = async () => {
    if (currentStep === "details") {
      setCurrentStep("address");
      return;
    }

    if (currentStep === "address") {
      // Validate wallet address
      if (!walletAddress.trim()) {
        setAddressError("Please enter a wallet address");
        return;
      }

      // Basic validation based on network
      let isValid = false;
      const network = position.network;

      if (
        network === "SOL" &&
        walletAddress.length >= 32 &&
        walletAddress.length <= 44
      ) {
        isValid = true;
      } else if (
        network === "BEP20" &&
        walletAddress.startsWith("0x") &&
        walletAddress.length === 42
      ) {
        isValid = true;
      } else if (
        network === "TRX" &&
        walletAddress.startsWith("T") &&
        walletAddress.length === 34
      ) {
        isValid = true;
      } else if (
        network === "TON" &&
        walletAddress.startsWith("UQ") &&
        walletAddress.length >= 48
      ) {
        isValid = true;
      } else {
        setAddressError(`Invalid ${network} wallet address format`);
        return;
      }

      setIsAddressValid(true);
      setAddressError("");
      setCurrentStep("confirm");
      return;
    }

    // Final confirmation
    setIsProcessing(true);

    setError(null);

    const data: RequestWithdrawal = {
      amount: Number(withdrawalAmount),
      address: walletAddress,
      network: position.network,
      stakingPositionId: position.id
    };

    try {
      const response = await profileApi.initiateWithdrawal(data);
      console.log("🚀 ~ handleConfirmWithdraw ~ response:", response);

      //   if (!response) {
      //     toast.error("Withdrawal failed", {
      //       description: "Failed to initiate withdrawal. Please try again.",
      //     });
      //   }

      postFn && (await postFn());

      //   setIsProcessing(false);

      // Move to success state
      setIsSuccess(true);

      // Show success toast
      toast.success("Withdrawal initiated successfully!", {
        description: `${withdrawalAmount} USDT is being sent to your wallet.`,
      });

      // Close modal after success
      setTimeout(() => {
        onClose();
        // Reset state for next time
        setCurrentStep("details");
        setWalletAddress("");
        setIsAddressValid(false);
        setAddressError("");
        setIsSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error("Withdrawal failed:", err);
      setError(
        err.message || "Failed to process withdrawal. Please try again."
      );

      // Show error toast
      toast.error("Withdrawal failed", {
        description:
          err.message || "There was an error processing your withdrawal.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Add a function to handle going back
  const handleBack = () => {
    if (currentStep === "address") {
      setCurrentStep("details");
    } else if (currentStep === "confirm") {
      setCurrentStep("address");
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 500 },
    },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onClose}
          className="absolute inset-0"
        />
        <motion.div
          variants={modalVariants}
          className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-medium">Withdraw Staked USDT</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isSuccess ? (
              <>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Plan</p>
                      <p className="font-medium">{position.planName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Staked Amount</p>
                      <p className="font-medium">
                        ${position.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {isEarlyWithdrawal && currentStep === "details" && (
                    <div className="p-4 bg-amber-900/20 border border-amber-500/20 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-200">
                          Early Withdrawal Penalty
                        </p>
                        <p className="text-sm text-amber-200/80 mt-1">
                          Your funds have been staked for {stakingDuration}{" "}
                          days. Withdrawing before the 30-day minimum staking
                          period will result in a 60% penalty.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-sm text-amber-200/80">
                          <Clock className="h-4 w-4" />
                          <span>
                            {remainingDays} days remaining until penalty-free
                            withdrawal
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === "details" && (
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Staked Amount</span>
                        <span className="font-medium">
                          ${position.amount.toLocaleString()}
                        </span>
                      </div>

                      {isEarlyWithdrawal && (
                        <>
                          <div className="flex justify-between text-amber-300">
                            <span>Early Withdrawal Penalty (60%)</span>
                            <span>-${penaltyAmount.toLocaleString()}</span>
                          </div>
                          <Separator className="my-2 bg-gray-700" />
                        </>
                      )}

                      <div className="flex justify-between text-lg font-medium">
                        <span>You will receive</span>
                        <span>${withdrawalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {currentStep === "address" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium mb-3">
                          Enter your {position.network} wallet address
                        </h4>
                        <p className="text-sm text-gray-400 mb-4">
                          Please enter the wallet address where you want to
                          receive your {position.network} funds.
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="wallet-address">Wallet Address</Label>
                          <Input
                            id="wallet-address"
                            placeholder={`Enter your ${position.network} wallet address`}
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            className="bg-gray-900/50 border-gray-700 focus:border-purple-500"
                          />
                          {addressError && (
                            <p className="text-sm text-red-400 mt-1">
                              {addressError}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Network</span>
                          <span>{position.network}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>Amount to receive</span>
                          <span>${withdrawalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === "confirm" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium mb-3">Confirm Withdrawal</h4>
                        <p className="text-sm text-gray-400 mb-4">
                          Please review the details below before confirming your
                          withdrawal.
                        </p>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Network</span>
                            <span>{position.network}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Amount</span>
                            <span>${withdrawalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              Wallet Address
                            </span>
                            <span className="truncate max-w-[200px]">
                              {walletAddress}
                            </span>
                          </div>

                          {isEarlyWithdrawal && (
                            <div className="mt-3 p-3 bg-amber-900/20 border border-amber-500/20 rounded-lg text-sm text-amber-200">
                              <p>
                                You will lose ${penaltyAmount.toLocaleString()}{" "}
                                (60%) of your staked amount due to early
                                withdrawal.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {currentStep === "details" && (
                      <>
                        <Button
                          onClick={handleConfirm}
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                          {isEarlyWithdrawal
                            ? "Withdraw with Penalty"
                            : "Withdraw Funds"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-gray-700"
                          onClick={onClose}
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    {currentStep === "address" && (
                      <>
                        <Button
                          onClick={handleConfirm}
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                          Continue
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-gray-700"
                          onClick={handleBack}
                        >
                          Back
                        </Button>
                      </>
                    )}

                    {currentStep === "confirm" && (
                      <>
                        <Button
                          onClick={handleConfirm}
                          className={cn(
                            "w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
                            isProcessing && "opacity-80 pointer-events-none"
                          )}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                              Processing...
                            </>
                          ) : (
                            "Confirm Withdrawal"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-gray-700"
                          onClick={handleBack}
                          disabled={isProcessing}
                        >
                          Back
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Withdrawal Successful
                </h2>
                <p className="text-gray-400 mb-6">
                  {isEarlyWithdrawal
                    ? `${withdrawalAmount.toLocaleString()} USDT has been sent to your wallet.`
                    : `${position.amount.toLocaleString()} USDT has been sent to your wallet.`}
                </p>
                <div className="w-full bg-gray-800/50 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
