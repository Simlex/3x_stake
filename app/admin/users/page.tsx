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
  MoreHorizontal,
  Search,
  UserPlus,
  Filter,
  ArrowUpDown,
  Eye,
  Ban,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Skeleton } from "@/app/components/ui/skeleton";
import { AdminUserDetailsModal } from "@/app/components/admin/admin-user-details-modal";
import { AppUser } from "@/app/model/IAdmin";
import { adminApi } from "@/lib/admin";
import { useAuthContext } from "@/app/context/AuthContext";

// Mock data - replace with actual API calls
const mockUsers = [
  {
    id: "user-1",
    username: "alice_crypto",
    email: "alice@example.com",
    totalStaked: 5000,
    activePositions: 2,
    totalRewards: 150,
    status: "active",
    joinedAt: "2023-01-15T00:00:00Z",
    lastLogin: "2023-04-10T14:30:00Z",
  },
  {
    id: "user-2",
    username: "bob_investor",
    email: "bob@example.com",
    totalStaked: 12000,
    activePositions: 3,
    totalRewards: 360,
    status: "active",
    joinedAt: "2023-02-20T00:00:00Z",
    lastLogin: "2023-04-09T10:15:00Z",
  },
  {
    id: "user-3",
    username: "charlie_hodl",
    email: "charlie@example.com",
    totalStaked: 8500,
    activePositions: 1,
    totalRewards: 255,
    status: "inactive",
    joinedAt: "2023-01-05T00:00:00Z",
    lastLogin: "2023-03-15T09:45:00Z",
  },
  {
    id: "user-4",
    username: "dave_trader",
    email: "dave@example.com",
    totalStaked: 3000,
    activePositions: 1,
    totalRewards: 90,
    status: "active",
    joinedAt: "2023-03-10T00:00:00Z",
    lastLogin: "2023-04-10T16:20:00Z",
  },
  {
    id: "user-5",
    username: "eve_blockchain",
    email: "eve@example.com",
    totalStaked: 20000,
    activePositions: 4,
    totalRewards: 600,
    status: "active",
    joinedAt: "2022-12-01T00:00:00Z",
    lastLogin: "2023-04-08T11:30:00Z",
  },
  {
    id: "user-6",
    username: "frank_defi",
    email: "frank@example.com",
    totalStaked: 15000,
    activePositions: 2,
    totalRewards: 450,
    status: "suspended",
    joinedAt: "2023-01-25T00:00:00Z",
    lastLogin: "2023-03-01T08:15:00Z",
  },
  {
    id: "user-7",
    username: "grace_nft",
    email: "grace@example.com",
    totalStaked: 7500,
    activePositions: 2,
    totalRewards: 225,
    status: "active",
    joinedAt: "2023-02-15T00:00:00Z",
    lastLogin: "2023-04-09T13:45:00Z",
  },
];

export default function AdminUsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<AppUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const { user, isLoading: authLoading } = useAuthContext();

  const handleFetchUsers = async () => {
    if (authLoading || !user) return;

    try {
      setIsLoading(true);
      const data = await adminApi.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchUsers();
  }, []);

  const filteredUsers = users?.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/20">
            Inactive
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/20">
            Suspended
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
        <h1 className="text-3xl font-bold">Users</h1>
        <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <Card className="border-0 glass-effect">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search users..."
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                    Email
                  </th>
                  {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                    Status
                  </th> */}
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                    Total Staked
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                    Positions
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                    Joined
                  </th>
                  {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                    Last Login
                  </th> */}
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
                            <Skeleton className="h-5 w-32" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-40" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-20" />
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
                            <Skeleton className="h-5 w-24" />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Skeleton className="ml-auto h-8 w-8" />
                          </td>
                        </tr>
                      ))
                  : filteredUsers?.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <td className="px-4 py-3 font-medium">
                          {user.username}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {user.email}
                        </td>
                        {/* <td className="px-4 py-3">
                          {getStatusBadge(user.status)}
                        </td> */}
                        <td className="px-4 py-3">
                          ${user.totalStaked.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">{user.activePositions}</td>
                        <td className="px-4 py-3 text-gray-300">
                          {formatDate(user.joinedAt)}
                        </td>
                        {/* <td className="px-4 py-3 text-gray-300">
                          {formatDate(user.lastLogin)}
                        </td> */}
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 bg-gray-900 border border-white/10"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleViewUser(user)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" /> Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-400 focus:text-red-400">
                                <Ban className="mr-2 h-4 w-4" /> Suspend User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!isLoading && filteredUsers && filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <p>No users found matching your search criteria.</p>
            </div>
          ): null}
        </CardContent>
      </Card>

      {selectedUser && (
        <AdminUserDetailsModal
          user={selectedUser}
          isOpen={isUserDetailsOpen}
          onClose={() => setIsUserDetailsOpen(false)}
        />
      )}
    </div>
  );
}
