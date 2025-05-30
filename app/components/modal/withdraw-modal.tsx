"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Check, Loader2, ArrowDown, Copy } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Network } from "@/app/model";
import { profileApi } from "@/lib/profile";
import { toast } from "sonner";
import { RequestWithdrawal } from "@/app/model/IWithdrawal";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
  postFn?: () => Promise<void> 
}

const NETWORKS = [
  { id: "SOL", name: "Solana", icon: "🟣" },
  { id: "TRX", name: "Tron", icon: "🔴" },
  { id: "BEP20", name: "BNB Smart Chain", icon: "🟡" },
  { id: "TON", name: "TON", icon: "💎" },
];

export function WithdrawModal({
  isOpen,
  onClose,
  userBalance,
  postFn,
}: WithdrawModalProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [withdrawalAddress, setWithdrawalAddress] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [network, setNetwork] = useState<string>("BEP20"); // change to Network enum
  const [isCopied, setIsCopied] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Reset state when modal opens or position changes
  useEffect(() => {
    if (isOpen && userBalance) {
      setStep(1);
      setIsProcessing(false);
      setIsSuccess(false);
      setError(null);
      setAmountError(null);
      setAddressError(null);
      setWithdrawalAddress("");
      setNetwork("BEP20"); // Default to BEP20 network

      // Set default withdrawal amount to the full position amount
      setWithdrawalAmount(userBalance.toString());
    }
  }, [isOpen, userBalance]);

  const handleNetworkChange = (value: string) => {
    setNetwork(value as Network);
  };

  const handleCopyTxId = () => {
    const txId =
      "0x" +
      Math.random().toString(16).slice(2, 10) +
      Math.random().toString(16).slice(2, 10);
    navigator.clipboard.writeText(txId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const validateInputs = () => {
    let isValid = true;
    setAmountError(null);
    setAddressError(null);

    // Validate amount
    if (
      !withdrawalAmount ||
      isNaN(Number(withdrawalAmount)) ||
      Number(withdrawalAmount) <= 0
    ) {
      setAmountError("Please enter a valid amount");
      isValid = false;
    } else if (userBalance && Number(withdrawalAmount) > userBalance) {
      setAmountError("Amount exceeds available balance");
      isValid = false;
    }

    // Validate address
    if (!withdrawalAddress.trim()) {
      setAddressError("Please enter a wallet address");
      isValid = false;
    } else {
      // Basic address validation based on network
      let addressRegex: RegExp;

      switch (network) {
        case "SOL":
          // Solana addresses are base58 encoded and typically 32-44 characters
          addressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
          break;
        case "TRX":
          // TRON addresses start with T and are 34 characters
          addressRegex = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
          break;
        case "BEP20":
          // BEP20 (Ethereum-style) addresses are 42 characters starting with 0x
          addressRegex = /^0x[a-fA-F0-9]{40}$/;
          break;
        case "TON":
          // TON addresses can be complex, this is a simplified check
          addressRegex = /^[a-zA-Z0-9_-]{48,}$/;
          break;
        default:
          // Default to Ethereum-style address
          addressRegex = /^0x[a-fA-F0-9]{40}$/;
      }

      if (!addressRegex.test(withdrawalAddress)) {
        setAddressError(`Invalid ${network} wallet address format`);
        isValid = false;
      }
    }

    return isValid;
  };

  const handleProceedToConfirm = () => {
    if (validateInputs()) {
      setStep(2);
    }
  };

  const handleConfirmWithdraw = async () => {
    if (!userBalance) return;

    setIsProcessing(true);
    setError(null);

    const data: RequestWithdrawal = {
      amount: Number(withdrawalAmount),
      address: withdrawalAddress,
      network: network as Network
    };

    try {
      const response = await profileApi.initiateWithdrawal(data);
      console.log("🚀 ~ handleConfirmWithdraw ~ response:", response);

    //   if (!response) {
    //     toast.error("Withdrawal failed", {
    //         description: "Failed to initiate withdrawal. Please try again.",
    //     })
    //   }

      postFn && (await postFn());

      // Move to success state
      setIsSuccess(true);

      // Show success toast
      toast.success("Withdrawal initiated successfully!", {
        description: `${withdrawalAmount} USDT is being sent to your wallet.`,
      });

      // Close modal after success
      setTimeout(() => {
        onClose();
        // Reset state
        setStep(1);
        setIsProcessing(false);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isOpen || !userBalance) return null;

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
            <h3 className="text-lg font-medium">
              {isSuccess
                ? "Withdrawal Initiated"
                : step === 1
                ? "Withdraw Funds"
                : "Confirm Withdrawal"}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Withdrawal Initiated!
                </h2>
                <p className="text-gray-400 mb-2">
                  {withdrawalAmount} USDT is being sent to your wallet.
                </p>
                <p className="text-gray-400 mb-6 text-sm">
                  Transaction ID:{" "}
                  <span className="font-mono">0x7a3b...9f21</span>
                  <button
                    onClick={handleCopyTxId}
                    className="ml-2 text-purple-400 hover:text-purple-300 inline-flex items-center"
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="ml-1">{isCopied ? "Copied" : "Copy"}</span>
                  </button>
                </p>
                <div className="w-full bg-gray-800/50 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                  />
                </div>
              </motion.div>
            ) : (
              <>
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-4">
                      {/* <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ArrowDown className="h-6 w-6 text-purple-400" />
                      </div> */}
                      {/* <h4 className="text-lg font-medium mb-2">Withdraw Your Funds</h4> */}
                      <p className="text-sm text-gray-400">
                        Enter the amount you want to withdraw and your wallet
                        address.
                      </p>
                    </div>

                    <Card className="border border-white/10 bg-black/30">
                      <div className="p-4 space-y-4">
                        {/* <div className="flex justify-between">
                          <span className="text-gray-400">Plan</span>
                          <span className="font-medium">{amount}</span>
                        </div> */}
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Available Balance
                          </span>
                          <span className="font-medium">
                            {formatCurrency(userBalance)}
                          </span>
                        </div>
                      </div>
                    </Card>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="withdrawalAmount">
                          Withdrawal Amount (USDT)
                        </Label>
                        <div className="relative">
                          <Input
                            id="withdrawalAmount"
                            type="number"
                            value={withdrawalAmount}
                            onChange={(e) =>
                              setWithdrawalAmount(e.target.value)
                            }
                            placeholder="Enter amount to withdraw"
                            className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-xs text-purple-400 hover:text-purple-300"
                            onClick={() =>
                              setWithdrawalAmount(userBalance.toString())
                            }
                          >
                            MAX
                          </Button>
                        </div>
                        {amountError && (
                          <p className="text-red-400 text-xs mt-1">
                            {amountError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="network">Select Network</Label>
                        <Tabs
                          defaultValue={network}
                          onValueChange={handleNetworkChange}
                        >
                          <TabsList className="grid grid-cols-4 mb-2">
                            {NETWORKS.map((net) => (
                              <TabsTrigger key={net.id} value={net.id}>
                                <span className="mr-1">{net.icon}</span>{" "}
                                {net.id}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                          <div className="text-xs text-gray-400 mt-1">
                            Selected:{" "}
                            {NETWORKS.find((n) => n.id === network)?.name}
                          </div>
                        </Tabs>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="walletAddress">
                          Your {network} Wallet Address
                        </Label>
                        <Input
                          id="walletAddress"
                          value={withdrawalAddress}
                          onChange={(e) => setWithdrawalAddress(e.target.value)}
                          placeholder={`Enter your ${network} wallet address`}
                          className="bg-gray-800/50 border-gray-700 focus:border-purple-500 font-mono text-sm"
                        />
                        {addressError && (
                          <p className="text-red-400 text-xs mt-1">
                            {addressError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-amber-900/20 border border-amber-500/20 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                      <p className="text-xs text-amber-200">
                        Make sure you enter the correct wallet address for the{" "}
                        {network} network. Funds sent to the wrong address
                        cannot be recovered.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 border-gray-700"
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        onClick={handleProceedToConfirm}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-medium mb-2">
                        Confirm Withdrawal
                      </h4>
                      <p className="text-sm text-gray-400">
                        Please review your withdrawal details before confirming.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="mb-2">
                        <span className="text-sm text-gray-400">
                          Withdrawal Address:
                        </span>
                      </div>
                      <div className="p-3 bg-gray-900/80 rounded-md text-xs font-mono break-all select-all">
                        {withdrawalAddress}
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Amount to withdraw:
                        </span>
                        <span className="font-medium">
                          {Number(withdrawalAmount).toLocaleString()} USDT
                        </span>
                      </div>
                      <Separator className="bg-gray-700" />
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network:</span>
                        <span className="font-medium">
                          {NETWORKS.find((n) => n.id === network)?.name}
                        </span>
                      </div>
                      <Separator className="bg-gray-700" />
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network fee:</span>
                        <span className="font-medium">$0.00 USDT</span>
                      </div>
                      <Separator className="bg-gray-700" />
                      <div className="flex justify-between">
                        <span className="font-medium">Total to receive:</span>
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                          {Number(withdrawalAmount).toLocaleString()} USDT
                        </span>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-900/30 border border-red-500/20 rounded-lg text-sm text-red-200">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 border-gray-700"
                        onClick={() => setStep(1)}
                        disabled={isProcessing}
                      >
                        Back
                      </Button>
                      <Button
                        className={cn(
                          "flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
                          isProcessing && "opacity-80 pointer-events-none"
                        )}
                        onClick={handleConfirmWithdraw}
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
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
