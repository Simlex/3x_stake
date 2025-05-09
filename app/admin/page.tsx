"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Users, Coins, CreditCard, TrendingUp } from "lucide-react";
import { AdminStatsCard } from "@/app/components/admin/admin-stats-card";
import { AdminRecentActivity } from "@/app/components/admin/admin-recent-activity";
import { AdminChart } from "@/app/components/admin/admin-chart";
import { AdminDashboardStats, RecentAppActivity } from "../model/IAdmin";
import { useAuthContext } from "../context/AuthContext";
import { adminApi } from "@/lib/admin";

// Mock data - replace with actual API calls
const mockStats = {
  totalUsers: 1245,
  activeStakes: 876,
  pendingDeposits: 23,
  totalStaked: 2500000,
  dailyGrowth: 5.2,
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuthContext();
  const [recentActivities, setRecentActivities] = useState<RecentAppActivity[]>(
    []
  );
  const [isFetchingRecentActivities, setIsFetchingRecentActivities] =
    useState(true);

  // Fetch dashboard stats from API
  const handleFetchDashboardStats = async () => {
    if (authLoading || !user) return;

    try {
      setIsLoading(true);
      const data = await adminApi.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to fetch dashboard stats");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchRecentActivities = async () => {
    if (authLoading || !user) return;

    try {
      setIsFetchingRecentActivities(true);
      const data = await adminApi.getRecentActivities();
      console.log("🚀 ~ handleFetchRecentActivities ~ data:", data)
      setRecentActivities(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch recent activities:", err);
      setError("Failed to fetch recent activities");
    } finally {
      setIsFetchingRecentActivities(false);
    }
  };

  const formatTotalStaked = (totalStaked: number) => {
    if (totalStaked >= 1000000) {
      return `$${(totalStaked / 1000000).toFixed(2)}M`;
    }
    if (totalStaked >= 1000) {
      return `$${(totalStaked / 1000).toFixed(2)}K`;
    }
    return `$${totalStaked.toFixed(2)}`;
  };

  useEffect(() => {
    handleFetchDashboardStats();
    handleFetchRecentActivities();

    return () => {
      setIsLoading(false);
      setIsFetchingRecentActivities(false);
    };
  }, [authLoading, user]);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatsCard
          title="Total Users"
          value={(stats?.totalUsers || 0).toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          trend={+8.2}
          isLoading={isLoading}
          description="Total registered users"
          color="from-blue-500 to-blue-700"
        />
        <AdminStatsCard
          title="Active Stakes"
          value={(stats?.activeStakes || 0).toLocaleString()}
          icon={<Coins className="h-5 w-5" />}
          trend={+12.5}
          isLoading={isLoading}
          description="Current staking positions"
          color="from-purple-500 to-purple-700"
        />
        <AdminStatsCard
          title="Pending Deposits"
          value={(stats?.pendingDeposits || 0).toLocaleString()}
          icon={<CreditCard className="h-5 w-5" />}
          trend={-3.4}
          isLoading={isLoading}
          description="Awaiting approval"
          color="from-amber-500 to-amber-700"
        />
        <AdminStatsCard
          title="Total Staked"
          value={formatTotalStaked(stats?.totalStaked || 0)}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={+5.2}
          isLoading={isLoading}
          description="Total value locked"
          color="from-green-500 to-green-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* <Card className="col-span-2 border-0 glass-effect">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>Staking activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="week">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="day">24h</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="day" className="h-[300px]">
                <AdminChart period="day" isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="week" className="h-[300px]">
                <AdminChart period="week" isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="month" className="h-[300px]">
                <AdminChart period="month" isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="year" className="h-[300px]">
                <AdminChart period="year" isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card> */}

        <Card className="border-0 glass-effect col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminRecentActivity
              isLoading={isFetchingRecentActivities}
              recentActivities={recentActivities}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
