"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Slider } from "@/app/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useModalContext } from "@/app/context/ModalContext";
import { useAuthContext } from "@/app/context/AuthContext";
import QRCode from "react-qr-code"

type Network = "SOL" | "TRX" | "BEP20" | "TON";

type StakePlan = {
  name: string;
  tier: string;
  minAmount: number;
  maxAmount: number;
  apr: number;
  features: string[];
  popular: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
};

const NETWORKS: { id: Network; name: string; icon: string }[] = [
  { id: "SOL", name: "Solana", icon: "🟣" },
  { id: "TRX", name: "Tron", icon: "🔴" },
  { id: "BEP20", name: "BNB Smart Chain", icon: "🟡" },
  { id: "TON", name: "TON", icon: "💎" },
];

// Mock function to generate wallet addresses based on network
const generateWalletAddress = (network: Network): string => {
  switch (network) {
    case "SOL":
      return "8xDrJzBdBLJ3xgHs7jmRKg9xHLTxPNLxJQEUDQjxLvbW";
    case "TRX":
      return "TJYeasTPa6gpEEfYYJFnQW1KbUYmNzqf7W";
    case "BEP20":
      return "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
    case "TON":
      return "UQBEqSQwCS3XgYHT8r1zFHfbCXHSNKXHcUm4uWzDX-zGwuIB";
    default:
      return "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  }
};

export function StakeModal({
  plan,
  isOpen,
  onClose,
}: {
  plan: StakePlan;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { setLoginModalVisibility } = useModalContext();
  const [amount, setAmount] = useState(plan.minAmount);
  const [network, setNetwork] = useState<Network>("BEP20");
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [depositVerified, setDepositVerified] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds

  // Check if user is authenticated
  const router = useRouter();
  const { user } = useAuthContext();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Replace with actual auth check

  // In a real app, check authentication status
  useEffect(() => {
    // Mock authentication check - replace with actual auth check
    const checkAuth = async () => {
      try {
        // const authStatus = await someAuthCheckFunction()
        // setIsAuthenticated(authStatus)

        // Using mock data for now
        setIsAuthenticated(true); // Set to false to test the redirect
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  // Redirect to login if not authenticated
  const handleUnauthenticatedAction = () => {
    onClose();
    // Show login modal
    setLoginModalVisibility(true);
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(plan.minAmount);
      setStep(1);
      setIsProcessing(false);
      setIsSuccess(false);
      setWalletAddress("");
      setIsCopied(false);
      setIsVerifying(false);
      setDepositVerified(false);
      setTimeRemaining(900);
    }
  }, [isOpen, plan]);

  // Generate wallet address when network changes or when moving to step 3
  useEffect(() => {
    if (step === 3) {
      setWalletAddress(generateWalletAddress(network));
    }
  }, [network, step]);

  // Countdown timer for deposit window
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 3 && timeRemaining > 0 && !depositVerified) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, timeRemaining, depositVerified]);

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const handleNetworkChange = (value: string) => {
    setNetwork(value as Network);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = () => {
    // Check if user is authenticated
    if (!user) {
      handleUnauthenticatedAction();
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // Move to deposit step instead of showing success
      setStep(3);
    }, 2000);
  };

  const handleVerifyDeposit = () => {
    setIsVerifying(true);

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      setDepositVerified(true);

      // Show success message
      setTimeout(() => {
        setIsSuccess(true);

        // Close modal after success
        setTimeout(() => {
          onClose();
        }, 2000);
      }, 1000);
    }, 3000);
  };

  const calculateReward = () => {
    return ((amount * plan.apr) / 100).toFixed(2);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (!isOpen) return null;

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
              {step === 3 ? "Deposit USDT" : "Stake with "}
              {step !== 3 && (
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${plan.color}`}
                >
                  {plan.name} Plan
                </span>
              )}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Select Amount (USDT)
                  </label>
                  <div className="mb-6">
                    <Slider
                      defaultValue={[amount]}
                      min={plan.minAmount}
                      max={plan.maxAmount}
                      step={10}
                      onValueChange={handleAmountChange}
                      className="my-6"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Min: ${plan.minAmount}
                      </span>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min={plan.minAmount}
                        max={plan.maxAmount}
                        className="w-24 text-right"
                      />
                      <span className="text-sm text-gray-400">
                        Max: ${plan.maxAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Select Network
                  </label>
                  <Tabs
                    defaultValue="BEP20"
                    onValueChange={handleNetworkChange}
                  >
                    <TabsList className="grid grid-cols-4 mb-2">
                      {NETWORKS.map((net) => (
                        <TabsTrigger
                          key={net.id}
                          value={net.id}
                          className={network == net.name ? "!bg-gray-600" : ""}
                        >
                          <span className="mr-1">{net.icon}</span> {net.id}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <div className="text-xs text-gray-400 mt-1">
                      Selected: {NETWORKS.find((n) => n.id === network)?.name}
                    </div>
                  </Tabs>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount to stake:</span>
                    <span className="font-medium">
                      {formatCurrency(amount)} USDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">APR:</span>
                    <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                      {plan.apr}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Annual reward:</span>
                    <span className="font-medium">
                      ${calculateReward()} USDT
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    isAuthenticated ? setStep(2) : handleUnauthenticatedAction()
                  }
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-medium mb-2">
                    Confirm Your Stake
                  </h4>
                  <p className="text-sm text-gray-400">
                    You are about to stake {formatCurrency(amount)} USDT on the{" "}
                    {NETWORKS.find((n) => n.id === network)?.name} network.
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plan:</span>
                    <span className="font-medium">{plan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="font-medium">
                      {formatCurrency(amount)} USDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="font-medium">
                      {NETWORKS.find((n) => n.id === network)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">APR:</span>
                    <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                      {plan.apr}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-amber-900/20 border border-amber-500/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                  <p className="text-xs text-amber-200">
                    Make sure you're sending USDT on the{" "}
                    {NETWORKS.find((n) => n.id === network)?.name} network.
                    Sending other assets will result in permanent loss.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-700"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    className={cn(
                      "flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
                      isProcessing && "opacity-80 pointer-events-none"
                    )}
                    onClick={handleSubmit}
                    disabled={isProcessing || isSuccess}
                  >
                    {isProcessing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : isSuccess ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Success!
                      </>
                    ) : (
                      "Generate Deposit Address"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {!depositVerified ? (
                  <>
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-medium mb-2">
                        Deposit {formatCurrency(amount)} USDT
                      </h4>
                      <p className="text-sm text-gray-400">
                        Send exactly {formatCurrency(amount)} USDT to the
                        address below on the{" "}
                        {NETWORKS.find((n) => n.id === network)?.name} network.
                      </p>
                      <div className="mt-2 p-2 bg-amber-900/20 text-amber-200 text-xs rounded-md">
                        Time remaining: {formatTime(timeRemaining)}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="p-3 bg-white rounded-lg">
                        <QRCode value={walletAddress} size={180} />
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">
                          Deposit Address:
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyAddress}
                          className="h-8"
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 mr-1 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 mr-1" />
                          )}
                          {isCopied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <div className="p-3 bg-gray-900/80 rounded-md text-xs font-mono break-all select-all">
                        {walletAddress}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                        <p className="text-xs text-blue-200">
                          Only send USDT on the{" "}
                          {NETWORKS.find((n) => n.id === network)?.name} network
                          to this address. Other tokens or networks will result
                          in permanent loss.
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700"
                          onClick={() =>
                            window.open(
                              `https://explorer.${network.toLowerCase()}.com`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Explorer
                        </Button>

                        <Button
                          onClick={handleVerifyDeposit}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          disabled={isVerifying}
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                              Verifying...
                            </>
                          ) : (
                            "I've Made the Deposit"
                          )}
                        </Button>
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
                      Deposit Confirmed!
                    </h2>
                    <p className="text-gray-400 mb-6">
                      Your stake of {formatCurrency(amount)} USDR has been
                      successfully processed.
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
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
