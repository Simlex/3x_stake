"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { MoreHorizontal, Search, Filter, ArrowUpDown, Eye, AlertTriangle, ArrowUpRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Skeleton } from "@/app/components/ui/skeleton"
import { AdminStakingDetailsModal } from "@/app/components/admin/admin-staking-details-modal"

// Mock data - replace with actual API calls
const mockStakingPositions = [
  {
    id: "stake-1",
    userId: "user-1",
    username: "alice_crypto",
    planName: "Silver",
    amount: 2500,
    network: "BEP20",
    startDate: "2023-02-10T00:00:00Z",
    endDate: null,
    apr: 3.5,
    rewards: 87.5,
    status: "active",
  },
  {
    id: "stake-2",
    userId: "user-1",
    username: "alice_crypto",
    planName: "Bronze",
    amount: 1000,
    network: "SOL",
    startDate: "2023-03-05T00:00:00Z",
    endDate: null,
    apr: 3,
    rewards: 30,
    status: "active",
  },
  {
    id: "stake-3",
    userId: "user-2",
    username: "bob_investor",
    planName: "Gold",
    amount: 5000,
    network: "BEP20",
    startDate: "2023-01-15T00:00:00Z",
    endDate: null,
    apr: 4,
    rewards: 200,
    status: "active",
  },
  {
    id: "stake-4",
    userId: "user-2",
    username: "bob_investor",
    planName: "Silver",
    amount: 3000,
    network: "TRX",
    startDate: "2023-02-20T00:00:00Z",
    endDate: null,
    apr: 3.5,
    rewards: 105,
    status: "active",
  },
  {
    id: "stake-5",
    userId: "user-3",
    username: "charlie_hodl",
    planName: "Platinum",
    amount: 8500,
    network: "TON",
    startDate: "2023-01-05T00:00:00Z",
    endDate: null,
    apr: 5,
    rewards: 425,
    status: "active",
  },
  {
    id: "stake-6",
    userId: "user-4",
    username: "dave_trader",
    planName: "Bronze",
    amount: 1500,
    network: "SOL",
    startDate: "2023-03-10T00:00:00Z",
    endDate: "2023-04-05T00:00:00Z",
    apr: 3,
    rewards: 45,
    status: "completed",
  },
  {
    id: "stake-7",
    userId: "user-5",
    username: "eve_blockchain",
    planName: "Gold",
    amount: 6000,
    network: "BEP20",
    startDate: "2022-12-01T00:00:00Z",
    endDate: null,
    apr: 4,
    rewards: 240,
    status: "active",
  },
]

export default function AdminStakingPositionsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stakingPositions, setStakingPositions] = useState(mockStakingPositions)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPosition, setSelectedPosition] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredPositions = stakingPositions.filter(
    (position) =>
      position.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.network.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewDetails = (position: any) => {
    setSelectedPosition(position)
    setIsDetailsOpen(true)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Active"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/20">Active</Badge>
      case "completed":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20">Completed</Badge>
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20">Pending</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/20">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Staking Positions</h1>
        <Button variant="outline">
          <ArrowUpRight className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>

      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle>All Staking Positions</CardTitle>
          <CardDescription>View and manage all staking positions across users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by username, plan or network..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Plan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Network</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">APR</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Start Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">End Date</th>
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
                            <Skeleton className="h-5 w-24" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-16" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-12" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-24" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-24" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-20" />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Skeleton className="ml-auto h-8 w-8" />
                          </td>
                        </tr>
                      ))
                  : filteredPositions.map((position) => (
                      <tr key={position.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 font-medium">{position.id.substring(0, 8)}</td>
                        <td className="px-4 py-3 text-gray-300">{position.username}</td>
                        <td className="px-4 py-3">{position.planName}</td>
                        <td className="px-4 py-3">${position.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">{position.network}</td>
                        <td className="px-4 py-3">{position.apr}%</td>
                        <td className="px-4 py-3 text-gray-300">{formatDate(position.startDate)}</td>
                        <td className="px-4 py-3 text-gray-300">{formatDate(position.endDate)}</td>
                        <td className="px-4 py-3">{getStatusBadge(position.status)}</td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-gray-900 border border-white/10">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewDetails(position)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ArrowUpRight className="mr-2 h-4 w-4" /> View User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-amber-400 focus:text-amber-400">
                                <AlertTriangle className="mr-2 h-4 w-4" /> Flag for Review
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!isLoading && filteredPositions.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              <p>No staking positions found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPosition && (
        <AdminStakingDetailsModal
          position={selectedPosition}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  )
}
