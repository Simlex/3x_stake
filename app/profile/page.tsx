"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Loader2 } from "lucide-react";
import OverviewTab from "@/app/components/profile/OverviewTab";
import StakingTab from "@/app/components/profile/StakingTab";
import ActivityTab from "@/app/components/profile/ActivityTab";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { profileApi } from "@/lib/profile";
import { WithdrawModal } from "../components/modal/withdraw-modal";
import { ZeroBalanceWithdrawModal } from "../components/modal/no-balance-withdraw-modal";
import EarlyWithdrawModal from "../components/modal/early-withdraw-modal";
import { StakingPosition } from "../model";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");

  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isZeroWithdrawModalOpen, setIsZeroWithdrawModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabParam || "overview");
  const [
    isFetchingUserWithdrawableBalance,
    setIsFetchingUserWithdrawableBalance,
  ] = useState(true);
  const [userWithdrawableBalance, setUserWithdrawableBalance] =
    useState<number>();
  const [userPendingWithdrawals, setuserPendingWithdrawals] =
    useState<number>();
  const [selectedPosition, setSelectedPosition] =
    useState<StakingPosition | null>(null);
  const [isEarlyWithdrawalModalOpen, setIsEarlyWithdrawalModalOpen] =
    useState(false);

  const handleFetchUserWithdrawableBalance = async () => {
    try {
      setIsFetchingUserWithdrawableBalance(true);
      const data = await profileApi.getWithdrawableBalance();
      setUserWithdrawableBalance(data.withdrawableBalance);
      setuserPendingWithdrawals(data.pendingWithdrawals);
    } catch (err) {
      console.error("Failed to fetch staking positions:", err);
    } finally {
      setIsFetchingUserWithdrawableBalance(false);
    }
  };

  // Update the isLoading effect to consider auth state:
  useEffect(() => {
    if (!authLoading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.push("/");
        return;
      }

      // Otherwise, simulate loading user profile data
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [authLoading, user, router]);

  // Set active tab based on URL parameter
  useEffect(() => {
    if (
      tabParam &&
      ["overview", "staking", "activity", "settings", "security"].includes(
        tabParam
      )
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    handleFetchUserWithdrawableBalance();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="container mx-auto px-4 pt-32 pb-20 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
            <p className="mt-4 text-lg text-gray-400">
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8"
          >
            Your Profile
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue={activeTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger
                  value="overview"
                  onClick={() =>
                    router.push("/profile?tab=overview", { scroll: false })
                  }
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="staking"
                  onClick={() =>
                    router.push("/profile?tab=staking", { scroll: false })
                  }
                >
                  Staking
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  onClick={() =>
                    router.push("/profile?tab=activity", { scroll: false })
                  }
                >
                  Activity
                </TabsTrigger>
                {/* <TabsTrigger
                  value="settings"
                  onClick={() =>
                    router.push("/profile?tab=settings", { scroll: false })
                  }
                >
                  Settings
                </TabsTrigger> */}
                {/* <TabsTrigger
                  value="security"
                  onClick={() =>
                    router.push("/profile?tab=security", { scroll: false })
                  }
                >
                  Security
                </TabsTrigger> */}
              </TabsList>

              <Card className="border-0 glass-effect mb-10">
                <CardContent className="!p-0">
                  <div className="w-full flex flex-row justify-between items-center p-5 rounded-lg">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-2xl font-medium">Total Assets</h4>
                      <h2 className="text-4xl font-bold">
                        ${(user?.balance || 0).toLocaleString()}
                      </h2>
                      {userWithdrawableBalance ||
                      userWithdrawableBalance == 0 ? (
                        <p className="text-white/60">
                          Withdrawable: $
                          {userWithdrawableBalance.toLocaleString()}
                        </p>
                      ) : (
                        <></>
                      )}
                      {userPendingWithdrawals || userPendingWithdrawals == 0 ? (
                        <p className="text-white/60">
                          Pending Withdrawals: $
                          {userPendingWithdrawals.toLocaleString()}
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="h-fit">
                      <Button
                        onClick={() =>
                          userWithdrawableBalance &&
                          userPendingWithdrawals &&
                          userWithdrawableBalance > 0 &&
                          Number(userWithdrawableBalance.toFixed(2)) -
                            Number(userPendingWithdrawals.toFixed(2)) >
                            0
                            ? setIsWithdrawModalOpen(true)
                            : setIsZeroWithdrawModalOpen(true)
                        }
                        disabled={isFetchingUserWithdrawableBalance}
                        variant="default"
                        className="bg-gradient-to-r from-pink-500 to-purple-600"
                      >
                        Witdraw
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <TabsContent value="overview" key={"overview"}>
                <OverviewTab />
              </TabsContent>

              <TabsContent value="staking" key={"staking"}>
                <StakingTab
                  isEarlyWithdrawalModalOpen={isEarlyWithdrawalModalOpen}
                  setIsEarlyWithdrawalModalOpen={setIsEarlyWithdrawalModalOpen}
                  setSelectedPosition={setSelectedPosition}
                />
              </TabsContent>

              <TabsContent value="activity" key={"activity"}>
                <ActivityTab />
              </TabsContent>

              {/* <TabsContent value="settings" key={"settings"}>
                <SettingsTab />
              </TabsContent> */}

              {/* <TabsContent value="security" key={"security"}>
                <SecurityTab />
              </TabsContent> */}
            </Tabs>
          </motion.div>
        </div>
      </div>

      {userWithdrawableBalance ? (
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          userBalance={Number(userWithdrawableBalance.toFixed(2))}
          postFn={handleFetchUserWithdrawableBalance}
        />
      ) : null}

      {isEarlyWithdrawalModalOpen ? (
        <EarlyWithdrawModal
          isOpen={isEarlyWithdrawalModalOpen}
          onClose={() => setIsEarlyWithdrawalModalOpen(false)}
          position={selectedPosition}
          postFn={handleFetchUserWithdrawableBalance}
        />
      ) : null}

      {/* {isZeroWithdrawModalOpen ? (
      ) : null} */}
      <ZeroBalanceWithdrawModal
        isOpen={isZeroWithdrawModalOpen}
        onClose={() => setIsZeroWithdrawModalOpen(false)}
      />
    </div>
  );
}
