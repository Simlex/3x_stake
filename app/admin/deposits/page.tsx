"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { AdminDepositDetailsModal } from "@/app/components/admin/admin-deposit-details-modal";
import { AdminDepositApprovalModal } from "@/app/components/admin/admin-deposit-approval-modal";
import type { JSX } from "react/jsx-runtime";
import { useAuthContext } from "@/app/context/AuthContext";
import { adminApi } from "@/lib/admin";
import { UserStakingPosition } from "@/app/model/IAdmin";
import { StakingPositionDepositStatus } from "@prisma/client";
import { toast } from "sonner";

export default function AdminDepositsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [deposits, setDeposits] = useState<UserStakingPosition[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const { user, isLoading: authLoading } = useAuthContext();
  const [isApprovingDeposit, setIsApprovingDeposit] = useState(false);
  const [isDisapprovingDeposit, setIsDisapprovingDeposit] = useState(false);

  const handleFetchDeposits = async () => {
    if (authLoading || !user) return;

    try {
      setIsLoading(true);
      const data = await adminApi.getAllDeposits();
      console.log("🚀 ~ handleFetchDeposits ~ data:", data);
      setDeposits(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch deposits:", err);
      setError("Failed to fetch deposits");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveDeposit = async (depositId: string) => {
    if (isApprovingDeposit) return;

    setIsApprovingDeposit(true);
    try {
      const response = await adminApi.approveDeposit(depositId);
      console.log("🚀 ~ handleApproveDeposit ~ response:", response);
      setDeposits((prev) =>
        prev.map((deposit) =>
          deposit.id === depositId
            ? { ...deposit, depositStatus: StakingPositionDepositStatus.APPROVED }
            : deposit
        )
      );
      toast.success("Deposit approved successfully", {
        description: "The deposit has been approved.",
      });
      setIsApprovalOpen(false);
    } catch (err) {
      console.error("Failed to approve deposit:", err);
      setError("Failed to approve deposit");
    } finally {
      setIsApprovingDeposit(false);
    }
  };
  
  const handleDisapproveDeposit = async (depositId: string) => {
    if (isDisapprovingDeposit) return;

    setIsDisapprovingDeposit(true);
    try {
      const response = await adminApi.disapproveDeposit(depositId);
      console.log("🚀 ~ handleDisapproveDeposit ~ response:", response);
      setDeposits((prev) =>
        prev.map((deposit) =>
          deposit.id === depositId
            ? { ...deposit, depositStatus: StakingPositionDepositStatus.REJECTED }
            : deposit
        )
      );
      toast.success("Deposit disapproved successfully", {
        description: "The deposit has been disapproved.",
      });
      setIsApprovalOpen(false);
    } catch (err) {
      console.error("Failed to disapproved deposit:", err);
      setError("Failed to disapproved deposit");
    } finally {
      setIsDisapprovingDeposit(false);
    }
  };

  useEffect(() => {
    handleFetchDeposits();
  }, [authLoading, user]);

  const filteredDeposits = deposits.filter(
    (deposit) =>
      (activeTab === "all" ||
        (activeTab === "pending" &&
          deposit.depositStatus === StakingPositionDepositStatus.PENDING) ||
        (activeTab === "approved" &&
          deposit.depositStatus === StakingPositionDepositStatus.APPROVED) ||
        (activeTab === "rejected" &&
          deposit.depositStatus === StakingPositionDepositStatus.REJECTED)) &&
      (deposit.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // deposit.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deposit.network.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewDetails = (deposit: any) => {
    setSelectedDeposit(deposit);
    setIsDetailsOpen(true);
  };

  const handleConfirmApproval = (depositId: string, approved: boolean) => {
    // In a real app, you would call an API to update the deposit status
    setDeposits((prev) =>
      prev.map((deposit) =>
        deposit.id === depositId
          ? { ...deposit, status: approved ? "approved" : "rejected" }
          : deposit
      )
    );
    setIsApprovalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: StakingPositionDepositStatus) => {
    switch (status) {
      case StakingPositionDepositStatus.PENDING:
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20">
            Pending
          </Badge>
        );
      case StakingPositionDepositStatus.APPROVED:
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
            Approved
          </Badge>
        );
      case StakingPositionDepositStatus.REJECTED:
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/20">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/20">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Deposits</h1>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20">
            {
              deposits.filter(
                (d) => d.depositStatus === StakingPositionDepositStatus.PENDING
              ).length
            }{" "}
            Pending
          </Badge>
        </div>
      </div>

      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle>Deposit Management</CardTitle>
          <CardDescription>View and manage user deposits</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Deposits</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search deposits..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {/* <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
                </Button> */}
              </div>
            </div>

            <TabsContent value="all" className="mt-6">
              <DepositTable
                deposits={filteredDeposits}
                isLoading={isLoading}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                handleViewDetails={handleViewDetails}
                handleApproveDeposit={handleApproveDeposit}
                handleDisapproveDeposit={handleDisapproveDeposit}
                isApprovingDeposit={isApprovingDeposit}
                isDisapprovingDeposit={isDisapprovingDeposit}
              />
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
              <DepositTable
                deposits={filteredDeposits}
                isLoading={isLoading}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                handleViewDetails={handleViewDetails}
                handleApproveDeposit={handleApproveDeposit}
                handleDisapproveDeposit={handleDisapproveDeposit}
                isApprovingDeposit={isApprovingDeposit}
                isDisapprovingDeposit={isDisapprovingDeposit}
              />
            </TabsContent>
            <TabsContent value="approved" className="mt-6">
              <DepositTable
                deposits={filteredDeposits}
                isLoading={isLoading}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                handleViewDetails={handleViewDetails}
                handleApproveDeposit={handleApproveDeposit}
                handleDisapproveDeposit={handleDisapproveDeposit}
                isApprovingDeposit={isApprovingDeposit}
                isDisapprovingDeposit={isDisapprovingDeposit}
              />
            </TabsContent>
            <TabsContent value="rejected" className="mt-6">
              <DepositTable
                deposits={filteredDeposits}
                isLoading={isLoading}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                handleViewDetails={handleViewDetails}
                handleApproveDeposit={handleApproveDeposit}
                handleDisapproveDeposit={handleDisapproveDeposit}
                isApprovingDeposit={isApprovingDeposit}
                isDisapprovingDeposit={isDisapprovingDeposit}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedDeposit && (
        <>
          <AdminDepositDetailsModal
            deposit={selectedDeposit}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            onApprove={() => {
              setIsDetailsOpen(false);
              setIsApprovalOpen(true);
            }}
          />
          <AdminDepositApprovalModal
            deposit={selectedDeposit}
            isOpen={isApprovalOpen}
            onClose={() => setIsApprovalOpen(false)}
            onConfirm={handleConfirmApproval}
            isApprovingDeposit={isApprovingDeposit}
            handleApprove={() => handleApproveDeposit(selectedDeposit.id)}
          />
        </>
      )}
    </div>
  );
}

function DepositTable({
  deposits,
  isLoading,
  formatDate,
  getStatusBadge,
  handleViewDetails,
  handleApproveDeposit,
  handleDisapproveDeposit,
  isApprovingDeposit,
  isDisapprovingDeposit
}: {
  deposits: UserStakingPosition[];
  isLoading: boolean;
  formatDate: (date: string) => string;
  getStatusBadge: (status: StakingPositionDepositStatus) => JSX.Element;
  handleViewDetails: (deposit: any) => void;
  handleApproveDeposit: (deposit: any) => void;
  handleDisapproveDeposit: (deposit: any) => void;
  isApprovingDeposit: boolean
  isDisapprovingDeposit: boolean
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              User
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              Network
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              Plan
            </th>
            {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              Transaction
            </th> */}
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
              Status
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array(5)
                .fill(0)
                .map((_, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-40" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-20" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Skeleton className="ml-auto h-8 w-8" />
                    </td>
                  </tr>
                ))
            : deposits.map((deposit) => (
                <tr
                  key={deposit.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3 font-medium">
                    {deposit.id.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {deposit.username}
                  </td>
                  <td className="px-4 py-3">
                    ${deposit.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{deposit.network}</td>
                  <td className="px-4 py-3">{deposit.planName}</td>
                  {/* <td className="px-4 py-3 text-gray-300">
                    <span className="font-mono text-xs">
                      {deposit.txHash.substring(0, 6)}...
                      {deposit.txHash.substring(deposit.txHash.length - 4)}
                    </span>
                  </td> */}
                  <td className="px-4 py-3 text-gray-300">
                    {formatDate(deposit.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(deposit.depositStatus)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {deposit.depositStatus ===
                        StakingPositionDepositStatus.PENDING && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                            onClick={() => handleApproveDeposit(deposit.id)}
                            disabled={isApprovingDeposit || isDisapprovingDeposit}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => handleDisapproveDeposit(deposit.id)}
                            disabled={isApprovingDeposit || isDisapprovingDeposit}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewDetails(deposit)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {!isLoading && deposits.length === 0 && (
        <div className="py-8 text-center text-gray-400">
          <p>No deposits found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}
