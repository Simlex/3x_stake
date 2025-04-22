"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Search, Filter, ArrowUpDown, Eye, CheckCircle, XCircle } from "lucide-react"
import { Skeleton } from "@/app/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { AdminDepositDetailsModal } from "@/app/components/admin/admin-deposit-details-modal"
import { AdminDepositApprovalModal } from "@/app/components/admin/admin-deposit-approval-modal"
import type { JSX } from "react/jsx-runtime"

// Mock data - replace with actual API calls
const mockDeposits = [
  {
    id: "deposit-1",
    userId: "user-1",
    username: "alice_crypto",
    amount: 2500,
    network: "BEP20",
    txHash: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    planName: "Silver",
    date: "2023-04-09T14:30:00Z",
    status: "pending",
  },
  {
    id: "deposit-2",
    userId: "user-2",
    username: "bob_investor",
    amount: 5000,
    network: "SOL",
    txHash: "8xDrJzBdBLJ3xgHs7jmRKg9xHLTxPNLxJQEUDQjxLvbW",
    planName: "Gold",
    date: "2023-04-08T10:15:00Z",
    status: "approved",
  },
  {
    id: "deposit-3",
    userId: "user-3",
    username: "charlie_hodl",
    amount: 8500,
    network: "TON",
    txHash: "UQBEqSQwCS3XgYHT8r1zFHfbCXHSNKXHcUm4uWzDX-zGwuIB",
    planName: "Platinum",
    date: "2023-04-10T09:45:00Z",
    status: "pending",
  },
  {
    id: "deposit-4",
    userId: "user-4",
    username: "dave_trader",
    amount: 1500,
    network: "SOL",
    txHash: "5xCrKzAdALJ2xgGs6jmRKg8xHLTxPNLxJQEUDQjxLvbW",
    planName: "Bronze",
    date: "2023-04-07T16:20:00Z",
    status: "rejected",
  },
  {
    id: "deposit-5",
    userId: "user-5",
    username: "eve_blockchain",
    amount: 6000,
    network: "BEP20",
    txHash: "0x842d35Cc6634C0532925a3b844Bc454e4438f44f",
    planName: "Gold",
    date: "2023-04-10T11:30:00Z",
    status: "pending",
  },
  {
    id: "deposit-6",
    userId: "user-6",
    username: "frank_defi",
    amount: 3000,
    network: "TRX",
    txHash: "TJYeasTPa6gpEEfYYJFnQW1KbUYmNzqf7W",
    planName: "Silver",
    date: "2023-04-05T08:15:00Z",
    status: "approved",
  },
  {
    id: "deposit-7",
    userId: "user-7",
    username: "grace_nft",
    amount: 4500,
    network: "BEP20",
    txHash: "0x942d35Cc6634C0532925a3b844Bc454e4438f44g",
    planName: "Silver",
    date: "2023-04-09T13:45:00Z",
    status: "approved",
  },
]

export default function AdminDepositsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [deposits, setDeposits] = useState(mockDeposits)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isApprovalOpen, setIsApprovalOpen] = useState(false)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredDeposits = deposits.filter(
    (deposit) =>
      (activeTab === "all" ||
        (activeTab === "pending" && deposit.status === "pending") ||
        (activeTab === "approved" && deposit.status === "approved") ||
        (activeTab === "rejected" && deposit.status === "rejected")) &&
      (deposit.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deposit.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deposit.network.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleViewDetails = (deposit: any) => {
    setSelectedDeposit(deposit)
    setIsDetailsOpen(true)
  }

  const handleApproveDeposit = (deposit: any) => {
    setSelectedDeposit(deposit)
    setIsApprovalOpen(true)
  }

  const handleConfirmApproval = (depositId: string, approved: boolean) => {
    // In a real app, you would call an API to update the deposit status
    setDeposits((prev) =>
      prev.map((deposit) =>
        deposit.id === depositId ? { ...deposit, status: approved ? "approved" : "rejected" } : deposit,
      ),
    )
    setIsApprovalOpen(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/20">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/20">Rejected</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/20">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Deposits</h1>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20">
            {deposits.filter((d) => d.status === "pending").length} Pending
          </Badge>
        </div>
      </div>

      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle>Deposit Management</CardTitle>
          <CardDescription>View and manage user deposits</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
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
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
                </Button>
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
              setIsDetailsOpen(false)
              setIsApprovalOpen(true)
            }}
          />
          <AdminDepositApprovalModal
            deposit={selectedDeposit}
            isOpen={isApprovalOpen}
            onClose={() => setIsApprovalOpen(false)}
            onConfirm={handleConfirmApproval}
          />
        </>
      )}
    </div>
  )
}

function DepositTable({
  deposits,
  isLoading,
  formatDate,
  getStatusBadge,
  handleViewDetails,
  handleApproveDeposit,
}: {
  deposits: any[]
  isLoading: boolean
  formatDate: (date: string) => string
  getStatusBadge: (status: string) => JSX.Element
  handleViewDetails: (deposit: any) => void
  handleApproveDeposit: (deposit: any) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">User</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Network</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Plan</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Transaction</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Actions</th>
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
                <tr key={deposit.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-medium">{deposit.id.substring(0, 8)}</td>
                  <td className="px-4 py-3 text-gray-300">{deposit.username}</td>
                  <td className="px-4 py-3">${deposit.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{deposit.network}</td>
                  <td className="px-4 py-3">{deposit.planName}</td>
                  <td className="px-4 py-3 text-gray-300">
                    <span className="font-mono text-xs">
                      {deposit.txHash.substring(0, 6)}...{deposit.txHash.substring(deposit.txHash.length - 4)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{formatDate(deposit.date)}</td>
                  <td className="px-4 py-3">{getStatusBadge(deposit.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {deposit.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                            onClick={() => handleApproveDeposit(deposit)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => handleApproveDeposit(deposit)}
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
  )
}
