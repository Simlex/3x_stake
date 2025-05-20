"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { profileApi } from "@/lib/profile";
import type { Reward, StakingPosition } from "@/app/model";
import { Skeleton } from "@/app/components/ui/skeleton";
import { toast } from "sonner";
import { rewardApi } from "@/lib/reward";
import { useAuthContext } from "@/app/context/AuthContext";
import moment from "moment";
import { StakingPositionDepositStatus, WithdrawalStatus } from "@prisma/client";
import EarlyWithdrawModal from "../modal/early-withdraw-modal";

type StakingTabProps = {
  setIsEarlyWithdrawalModalOpen: (isOpen: boolean) => void;
  isEarlyWithdrawalModalOpen: boolean;
  setSelectedPosition: Dispatch<SetStateAction<StakingPosition | null>>;
};

const StakingTab = ({
  setIsEarlyWithdrawalModalOpen,
  isEarlyWithdrawalModalOpen,
  setSelectedPosition,
}: StakingTabProps) => {
  const { user, refreshUser } = useAuthContext();
  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>(
    []
  );
  console.log("🚀 ~ stakingPositions:", stakingPositions);
  const [isFetchingStakedPositions, setIsFetchingStakedPositions] =
    useState(true);
  const [isFetchingUserRewards, setIsFetchingUserRewards] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPositions, setProcessingPositions] = useState<
    Record<string, boolean>
  >({});
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [selectedPositionId, setSelectedPositionId] =
    useState<StakingPosition>();
  const [userRewards, setUserRewards] = useState<Reward[]>();

  const handleFetchStakingPositions = async () => {
    try {
      setIsFetchingStakedPositions(true);
      const data = await profileApi.getStakingPositions();
      setStakingPositions(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch staking positions:", err);
      setError("Failed to load staking positions. Please try again.");
    } finally {
      setIsFetchingStakedPositions(false);
    }
  };

  useEffect(() => {
    handleFetchStakingPositions();
    user && handleFetchUserRewards(user.id);
  }, []);

  const formatDate = (dateString: string, includeTime?: boolean) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: includeTime ? "2-digit" : undefined,
      minute: includeTime ? "2-digit" : undefined,
    });
  };

  const hasClaimsBegun = (dateString: string) => {
    console.log("🚀 ~ hasClaimsBegun ~ dateString:", dateString);
    const now = new Date();
    // Difference in milliseconds
    const diffMs = now.getTime() - new Date(dateString).getTime();
    console.log(
      "🚀 ~ hasClaimsBegun ~ new Date(dateString).getTime():",
      new Date(dateString).getTime()
    );
    console.log("🚀 ~ hasClaimsBegun ~ now.getTime():", now.getTime());
    console.log("🚀 ~ hasClaimsBegun ~ diffMs:", diffMs);
    // Convert ms to full days
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    console.log("🚀 ~ hasClaimsBegun ~ diffDays:", diffDays);

    const isMoreThanOneDay = diffDays > 1;

    return isMoreThanOneDay;
  };

  const handleClaimRewards = async (positionId: string) => {
    setIsClaimingReward(true);

    try {
      const fetchedStakingPlans = await rewardApi.claimReward(positionId);

      setIsClaimingReward(false);

      console.log(
        "🚀 ~ handleFetchStakingPlans ~ fetchedStakingPlans:",
        fetchedStakingPlans
      );

      handleFetchStakingPositions();
      handleFetchUserRewards(user?.id as string);
      refreshUser();

      toast.success("Rewards claimed successfully!", {
        description: "Your rewards have been successfully claimed.",
      });
    } catch (err) {
      console.error("Failed to claim reward:", err);
      toast.error("Failed to claim reward", {
        description: "An error occurred while claiming rewards.",
      });
      setError("Failed to claim reward. Please try again.");
    } finally {
      setIsClaimingReward(false);
    }
  };

  const handleFetchUserRewards = async (userId: string) => {
    setIsFetchingUserRewards(true);

    try {
      const fetchedUserRewards = await rewardApi.getUserRewards(userId);

      setIsFetchingUserRewards(false);

      console.log(
        "🚀 ~ handleFetchUserRewards ~ fetchedUserRewards:",
        fetchedUserRewards
      );

      setUserRewards(fetchedUserRewards);
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
      toast.error("Failed to fetch rewards", {
        description: "An error occurred while fetching rewards.",
      });
    } finally {
      setIsFetchingUserRewards(false);
    }
  };

  const handleUnstake = async (positionId: string) => {
    try {
      setProcessingPositions((prev) => ({ ...prev, [positionId]: true }));

      await profileApi.unstakePosition(positionId);

      // Update the local state to reflect the change
      setStakingPositions((prev) =>
        prev.map((pos) =>
          pos.id === positionId ? { ...pos, isActive: false } : pos
        )
      );
      //   handleFetchStakingPositions();
      refreshUser();
      toast.success("Position unstaked successfully!", {
        description: "Your staking position has been successfully unstaked.",
      });
    } catch (err) {
      console.error("Failed to unstake position:", err);
      toast.error("Failed to unstake position", {
        description:
          "An error occurred while unstaking your position. Please try again.",
      });
    } finally {
      setProcessingPositions((prev) => ({ ...prev, [positionId]: false }));
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-500/20 rounded-lg text-center">
        <p className="text-red-200">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle>Your Staking Positions</CardTitle>
          <CardDescription>
            Manage your active staking positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isFetchingStakedPositions ? (
              // Loading skeleton
              Array(2)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-black/30 border border-white/5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <div className="flex flex-col md:items-end">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-4 w-16 mt-1" />
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-28" />
                        <Skeleton className="h-9 w-20" />
                      </div>
                    </div>
                  </div>
                ))
            ) : stakingPositions.length > 0 ? (
              // Actual staking positions
              stakingPositions.map((position) => (
                <div
                  key={position.id}
                  className={`p-4 rounded-lg ${
                    position.isActive ? "bg-black/30" : "bg-gray-900/20"
                  } border ${
                    position.isActive ? "border-white/5" : "border-gray-800/50"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">
                          {position.planName} Plan
                        </h4>
                        <Badge
                          className={
                            position.isActive
                              ? "bg-green-500/20 text-green-400 border-green-500/20"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/20"
                          }
                        >
                          {position.isActive ? "Active" : "Unstaked"}
                        </Badge>
                      </div>

                      {position.depositStatus ===
                      StakingPositionDepositStatus.PENDING ? (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
                          Pending
                        </Badge>
                      ) : position.depositStatus ===
                        StakingPositionDepositStatus.APPROVED ? (
                        <div className="text-sm text-gray-400">
                          Started on {formatDate(position.startDate)} • Network:{" "}
                          {position.network}
                          {position.endDate &&
                            ` • Ends on ${formatDate(position.endDate)}`}
                        </div>
                      ) : null}
                      {position.lastClaimedAt ? (
                        <div className="text-sm text-gray-400">
                          Last claimed:{" "}
                          {formatDate(position.lastClaimedAt, true)}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col md:items-end">
                      <div className="text-lg font-bold">
                        ${position.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        APR: {position.apr}%
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-400">
                        Rewards earned
                      </div>
                      <div className="text-lg font-medium text-green-500">
                        ${position.rewards.toLocaleString()}
                      </div>
                    </div>

                    {position.isActive ? (
                      <div className="flex gap-2">
                        <div className="flex flex-row items-center space-x-2">
                          {/* <p className="text-xs">
                            {
                              getTimeRemainingToClaim(
                                new Date(position.nextClaimDeadline as string)
                              ).hours
                            }
                          </p> */}
                          {position.depositStatus ===
                          StakingPositionDepositStatus.PENDING ? (
                            <p className="text-sm text-white/70">
                              {`Pending approval`}
                            </p>
                          ) : !hasClaimsBegun(position.startDate) ? (
                            <p className="text-sm text-white/70">
                              {`Claiming starts on ${moment(position.startDate)
                                .add(1, "day")
                                .format("MMM D, YYYY | hh:mm a")}`}
                            </p>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPositionId(position);
                                handleClaimRewards(position.id);
                              }}
                              //   disabled={position.rewards <= 0} "Cannot claim yet."
                            >
                              {isClaimingReward &&
                              selectedPositionId!.id == position.id
                                ? "Claiming Rewards"
                                : "Claim Rewards"}
                            </Button>
                          )}
                        </div>
                        {position.depositStatus ===
                          StakingPositionDepositStatus.APPROVED && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/50 text-red-400 hover:bg-red-950/20"
                            onClick={() => handleUnstake(position.id)}
                            disabled={processingPositions[position.id]}
                          >
                            {processingPositions[position.id] ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                Unstaking...
                              </>
                            ) : (
                              "Unstake"
                            )}
                          </Button>
                        )}
                      </div>
                    ) : position.requestedWithdrawal &&
                      position.withdrawalStatus == WithdrawalStatus.PENDING ? (
                      <span className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-950/20">
                        Pending Withdrawal
                      </span>
                    ) : position.requestedWithdrawal &&
                      position.withdrawalStatus == WithdrawalStatus.APPROVED ? (
                      <span className="border-green-500/50 text-green-400 hover:bg-green-950/20">
                        Approved for Withdrawal
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-950/20"
                        onClick={() => {
                          setSelectedPosition(position);
                          setIsEarlyWithdrawalModalOpen(true);
                        }}
                      >
                        {/* {false ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Unstaking...
                          </>
                        ) : (
                          "Withdraw"
                        )} */}
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // No staking positions
              <div className="text-center py-8 text-gray-400">
                <p>You don't have any staking positions yet.</p>
                <p className="mt-2">Start staking to earn rewards!</p>
              </div>
            )}

            <div className="flex justify-center mt-4">
              <Button
                className="bg-gradient-to-r from-pink-500 to-purple-600"
                asChild
              >
                <Link href="/" scroll>
                  Stake More USDR
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle>Rewards History</CardTitle>
          <CardDescription>Track your staking rewards</CardDescription>
        </CardHeader>
        <CardContent>
          {isFetchingUserRewards ? (
            <div className="space-y-4">
              {Array(2)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-48 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
            </div>
          ) : userRewards && userRewards.length > 0 ? (
            <div className="space-y-4">
              {userRewards.map((reward: any) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5"
                >
                  <div>
                    <p className="font-medium text-white">
                      ${reward.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      From {reward.stakingPosition.network} staking |{" "}
                      {reward.stakingPosition.amount} staked @{" "}
                      {reward.stakingPosition.apy}% APY
                    </p>
                  </div>
                  <div className="text-sm text-right text-gray-300">
                    <p>{new Date(reward.claimedAt).toLocaleDateString()}</p>
                    <p className="text-xs">
                      {new Date(reward.claimedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No rewards have been claimed yet.</p>
              <p className="mt-2">Rewards are claimable daily.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StakingTab;
