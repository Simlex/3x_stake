"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";
import {
  Loader2,
  Users,
  Coins,
  Copy,
  Share2,
  ChevronDown,
  Check,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import { referralApi } from "@/lib/referral";
import { ReferralData } from "../model/IReferral";

export default function ReferralsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});

  const { user, isLoading: authLoading } = useAuthContext();
  const router = useRouter();

  //   const { referralData, isLoading, error, refreshReferrals } = useReferrals();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  console.log("🚀 ~ ReferralsPage ~ referralData:", referralData)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  const handleCopyReferralLink = () => {
    if (!user) return;

    const referralLink = `${window.location.origin}/?ref=${
      referralData?.referralCode || ""
    }`;
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFetchReferrals = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await referralApi.getReferralData();
      console.log("🚀 ~ handleFetchReferrals ~ data:", data)
      setReferralData(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch referral data:", err);
      setError("Failed to load referral data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!user) return;

    const referralLink = `${window.location.origin}/?ref=${
      referralData?.referralCode || ""
    }`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join USDR Yield Staking",
          text: "Stake USDR and earn rewards with flexible staking plans. Use my referral link:",
          url: referralLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopyReferralLink();
    }
  };

  const toggleExpand = (id: string) => {
    setIsExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    handleFetchReferrals();
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="container mx-auto px-4 pt-32 pb-20 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
            <p className="mt-4 text-lg text-gray-400">
              Loading referral data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-md mx-auto p-6 bg-red-900/20 border border-red-500/20 rounded-lg text-center">
            <p className="text-red-200 mb-4">
              Failed to load referral data. Please try again later.
            </p>
            <Button onClick={handleFetchReferrals}>Retry</Button>
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
            Referral Program
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Referrals</p>
                      <h3 className="text-2xl md:text-3xl font-bold">
                        {referralData?.totalReferrals || 0}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                      <Coins className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">
                        Total Bonus Earned
                      </p>
                      <h3 className="text-2xl md:text-3xl font-bold">
                        ${referralData?.totalBonus.toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600">
                      <ChevronUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">APR Boost</p>
                      <h3 className="text-2xl md:text-3xl font-bold">
                        +{(referralData?.totalReferrals || 0) * 0.01}%
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-0 glass-effect">
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
                <CardDescription>
                  Share this link to invite friends and earn bonuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Input
                      value={`${window.location.origin}/?ref=${
                        referralData?.referralCode || ""
                      }`}
                      readOnly
                      className="pr-10 bg-gray-800/50 border-gray-700"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={handleCopyReferralLink}
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={handleShare}
                    className="bg-gradient-to-r from-pink-500 to-purple-600"
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                  <h4 className="font-medium mb-2">How it works:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="bg-purple-500/20 text-purple-400 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <span>Share your unique referral link with friends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-purple-500/20 text-purple-400 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        When they stake USDR, you earn 10% of their staking
                        rewards
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-purple-500/20 text-purple-400 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        You also earn 8% of the staking rewards from their
                        referrals (your second level)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-purple-500/20 text-purple-400 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        4
                      </span>
                      <span>
                        Each referral increases your APR by 0.01%, up to a
                        maximum of 10%
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="overview">Direct Referrals</TabsTrigger>
                <TabsTrigger value="downline">Downline Referrals</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="border-0 glass-effect">
                  <CardHeader>
                    <CardTitle>Your Direct Referrals</CardTitle>
                    <CardDescription>
                      People who joined using your referral link
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {referralData?.directReferrals.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>You don't have any direct referrals yet.</p>
                        <p className="mt-2">
                          Share your referral link to start earning bonuses!
                        </p>
                        <Button
                          onClick={handleShare}
                          className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600"
                        >
                          <Share2 className="mr-2 h-4 w-4" /> Share Your Link
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {referralData?.directReferrals.map((referral) => (
                          <div
                            key={referral.id}
                            className="p-4 rounded-lg bg-black/30 border border-white/5"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">
                                    {referral.username}
                                  </h4>
                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                                    {referral.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-400">
                                  Joined on{" "}
                                  {new Date(
                                    referral.joinedAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>

                              <div className="flex flex-col md:items-end">
                                <div className="text-lg font-bold">
                                  ${referral.totalStaked.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-400">
                                  Total Staked
                                </div>
                              </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <div className="text-sm text-gray-400">
                                  Your bonus (10% their profits)
                                </div>
                                <div className="text-lg font-medium text-green-500">
                                  ${referral.bonusEarned.toFixed(2)}
                                </div>
                              </div>

                              <div>
                                <div className="text-sm text-gray-400">
                                  Their referrals
                                </div>
                                <div className="text-lg font-medium">
                                  {referral.referralCount}
                                </div>
                              </div>

                              {referral.referralCount > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setActiveTab("downline");
                                  }}
                                >
                                  View Downline
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="downline">
                <Card className="border-0 glass-effect">
                  <CardHeader>
                    <CardTitle>Your Downline Referrals</CardTitle>
                    <CardDescription>
                      Second-level referrals from your direct referrals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {referralData?.downlineReferrals.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>You don't have any downline referrals yet.</p>
                        <p className="mt-2">
                          Your direct referrals need to invite more people!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {referralData?.directReferrals
                          .filter((referral) => referral.referralCount > 0)
                          .map((directReferral) => (
                            <div key={directReferral.id} className="space-y-2">
                              <div
                                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer"
                                onClick={() => toggleExpand(directReferral.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <ChevronDown
                                    className={`h-5 w-5 transition-transform ${
                                      isExpanded[directReferral.id]
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                  <span className="font-medium">
                                    {directReferral.username}'s Referrals (
                                    {directReferral.referralCount})
                                  </span>
                                </div>
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/20">
                                  $
                                  {(directReferral.downlineBonus || 0).toFixed(
                                    2
                                  )}{" "}
                                  earned
                                </Badge>
                              </div>

                              {isExpanded[directReferral.id] && (
                                <div className="pl-6 space-y-3">
                                  {referralData?.downlineReferrals
                                    .filter(
                                      (downline) =>
                                        downline.referredBy ===
                                        directReferral.id
                                    )
                                    .map((downline) => (
                                      <div
                                        key={downline.id}
                                        className="p-3 rounded-lg bg-black/30 border border-white/5"
                                      >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <h5 className="font-medium">
                                                {downline.username}
                                              </h5>
                                              <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                                                {downline.isActive
                                                  ? "Active"
                                                  : "Inactive"}
                                              </Badge>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                              Joined on{" "}
                                              {new Date(
                                                downline.joinedAt
                                              ).toLocaleDateString()}
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-4">
                                            <div>
                                              <div className="text-xs text-gray-400">
                                                Total Staked
                                              </div>
                                              <div className="font-medium">
                                                $
                                                {downline.totalStaked.toFixed(
                                                  2
                                                )}
                                              </div>
                                            </div>
                                            <div>
                                              <div className="text-xs text-gray-400">
                                                Your Bonus (8%)
                                              </div>
                                              <div className="font-medium text-green-500">
                                                $
                                                {downline.bonusEarned.toFixed(
                                                  2
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
