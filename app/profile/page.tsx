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
import SettingsTab from "@/app/components/profile/SettingsTab";
import SecurityTab from "@/app/components/profile/SecurityTab";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tabParam || "overview");

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
                <TabsTrigger
                  value="settings"
                  onClick={() =>
                    router.push("/profile?tab=settings", { scroll: false })
                  }
                >
                  Settings
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  onClick={() =>
                    router.push("/profile?tab=security", { scroll: false })
                  }
                >
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <OverviewTab />
              </TabsContent>

              <TabsContent value="staking">
                <StakingTab />
              </TabsContent>

              <TabsContent value="activity">
                <ActivityTab />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsTab />
              </TabsContent>

              <TabsContent value="security">
                <SecurityTab />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
