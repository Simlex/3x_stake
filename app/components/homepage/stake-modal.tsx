"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Check } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Slider } from "@/app/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

export function StakeModal({
  plan,
  isOpen,
  onClose,
}: {
  plan: StakePlan;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(plan.minAmount);
  const [network, setNetwork] = useState<Network>("BEP20");
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if user is authenticated
  const router = useRouter();
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
    // Show login modal or redirect to login page
    router.push("/login");
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(plan.minAmount);
      setStep(1);
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [isOpen, plan]);

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const handleNetworkChange = (value: string) => {
    setNetwork(value as Network);
  };

  const handleSubmit = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      handleUnauthenticatedAction();
      return;
    }
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 2000);
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
              Stake with{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${plan.color}`}
              >
                {plan.name} Plan
              </span>
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
                        <TabsTrigger key={net.id} value={net.id}>
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
                      "Confirm Stake"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
