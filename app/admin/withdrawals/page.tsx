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
import { WithdrawalStatus } from "@prisma/client";
import { toast } from "sonner";
import { Withdrawal } from "@/app/model/IWithdrawal";

export default function AdminWithdrawalsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const { user, isLoading: authLoading } = useAuthContext();
  const [isApprovingWithdrawal, setIsApprovingWithdrawal] = useState(false);

  const handleFetchWithdrawals = async () => {
    if (authLoading || !user) return;

    try {
      setIsLoading(true);
      const data = await adminApi.getAllWithdrawals();
      console.log("🚀 ~ handleFetchWithdrawals ~ data:", data);
      setWithdrawals(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err);
      setError("Failed to fetch withdrawals");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveWithdrawal = async (withdrawalId: string) => {
    if (isApprovingWithdrawal) return;

    setIsApprovingWithdrawal(true);
    try {
      const response = await adminApi.approveWithdrawal(withdrawalId);
      console.log("🚀 ~ handleApproveWithdrawal ~ response:", response);
      setWithdrawals((prev) =>
        prev.map((withdrawal) =>
          withdrawal.id === withdrawalId
            ? { ...withdrawal, status: WithdrawalStatus.APPROVED }
            : withdrawal
        )
      );
      toast.success("Withdrawal approved successfully", {
        description: "The withdrawal has been approved.",
      });
      setIsApprovalOpen(false);
    } catch (err) {
      console.error("Failed to approve withdrawal:", err);
      setError("Failed to approve withdrawal");
    } finally {
      setIsApprovingWithdrawal(false);
    }
  };

  useEffect(() => {
    handleFetchWithdrawals();
  }, [authLoading, user]);

  const filteredWithdrawals = withdrawals.filter(
    (withdrawal) =>
      (activeTab === "all" ||
        (activeTab === "pending" &&
          withdrawal.status === WithdrawalStatus.PENDING) ||
        (activeTab === "approved" &&
          withdrawal.status === WithdrawalStatus.APPROVED) ||
        (activeTab === "rejected" &&
          withdrawal.status === WithdrawalStatus.REJECTED)) &&
      (withdrawal.user?.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        withdrawal.wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        withdrawal.network.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewDetails = (deposit: any) => {
    setSelectedWithdrawal(deposit);
    setIsDetailsOpen(true);
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

  const getStatusBadge = (status: WithdrawalStatus) => {
    switch (status) {
      case WithdrawalStatus.PENDING:
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20">
            Pending
          </Badge>
        );
      case WithdrawalStatus.APPROVED:
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
            Approved
          </Badge>
        );
      case WithdrawalStatus.REJECTED:
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
        <h1 className="text-3xl font-bold">Withdrawals</h1>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20">
            {
              withdrawals.filter((w) => w.status === WithdrawalStatus.PENDING)
                .length
            }{" "}
            Pending
          </Badge>
        </div>
      </div>

      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle>Withdrawals Management</CardTitle>
          <CardDescription>View and manage user withdrawals</CardDescription>
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
                <TabsTrigger value="all">All Withdrawals</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search withdrawals..."
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
              <WithdrawalTable
                withdrawals={filteredWithdrawals}
                isLoading={isLoading}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                handleViewDetails={handleViewDetails}
                handleApproveDeposit={handleApproveWithdrawal}
              />
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
              <WithdrawalTable
                withdrawals={filteredWithdrawals}
                isLoading={isLoading}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                handleViewDetails={handleViewDetails}
                handleApproveDeposit={handleApproveWithdrawal}
              />
            </TabsContent>
            <TabsContent value="approved" className="mt-6">
              <WithdrawalTable
                withdrawals={filteredWithdrawals}
                isLoading={isLoading}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                handleViewDetails={handleViewDetails}
                handleApproveDeposit={handleApproveWithdrawal}
              />
            </TabsContent>
            <TabsContent value="rejected" className="mt-6">
              <WithdrawalTable
                withdrawals={filteredWithdrawals}
                isLoading={isLoading}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                handleViewDetails={handleViewDetails}
                handleApproveDeposit={handleApproveWithdrawal}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* {selectedWithdrawal && (
        <>
          <AdminDepositDetailsModal
            deposit={selectedWithdrawal}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            onApprove={() => {
              setIsDetailsOpen(false);
              setIsApprovalOpen(true);
            }}
          />
          <AdminDepositApprovalModal
            deposit={selectedWithdrawal}
            isOpen={isApprovalOpen}
            onClose={() => setIsApprovalOpen(false)}
            onConfirm={handleConfirmApproval}
            isApprovingDeposit={isApprovingWithdrawal}
            handleApprove={() => handleApproveWithdrawal(selectedWithdrawal.id)}
          />
        </>
      )} */}
    </div>
  );
}

function WithdrawalTable({
  withdrawals,
  isLoading,
  formatDate,
  getStatusBadge,
  handleViewDetails,
  handleApproveDeposit,
}: {
  withdrawals: Withdrawal[];
  isLoading: boolean;
  formatDate: (date: string) => string;
  getStatusBadge: (status: WithdrawalStatus) => JSX.Element;
  handleViewDetails: (deposit: any) => void;
  handleApproveDeposit: (deposit: any) => void;
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
              Wallet
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
            : withdrawals.map((withdrawal) => (
                <tr
                  key={withdrawal.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3 font-medium">
                    {withdrawal.id.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {withdrawal.user?.username}
                  </td>
                  <td className="px-4 py-3">
                    ${withdrawal.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{withdrawal.network}</td>
                  <td className="px-4 py-3 max-w-52 break-all whitespace-normal">{withdrawal.wallet}</td>
                  {/* <td className="px-4 py-3 text-gray-300">
                    <span className="font-mono text-xs">
                      {deposit.txHash.substring(0, 6)}...
                      {deposit.txHash.substring(deposit.txHash.length - 4)}
                    </span>
                  </td> */}
                  <td className="px-4 py-3 text-gray-300">
                    {formatDate(withdrawal.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(withdrawal.status)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {withdrawal.status === WithdrawalStatus.PENDING && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                            onClick={() => handleApproveDeposit(withdrawal.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => handleApproveDeposit(deposit)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button> */}
                        </>
                      )}
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewDetails(withdrawal)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {!isLoading && withdrawals.length === 0 && (
        <div className="py-8 text-center text-gray-400">
          <p>No withdrawals found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}
