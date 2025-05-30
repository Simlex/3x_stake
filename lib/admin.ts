import { API } from "@/app/api/apiClient";
import { ApiResponse } from "@/app/model";
import { AdminDashboardStats, UserStakingPosition } from "@/app/model/IAdmin";
import { Withdrawal } from "@/app/model/IWithdrawal";

// API functions for admin-related data
export const adminApi = {
    // Get admin dashboard stats
    getDashboardStats: async (): Promise<AdminDashboardStats> => {
        try {
            const response = await API.get<ApiResponse<AdminDashboardStats>>(
                "/admin/dashboard"
            );
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch admin dashboard stats:", error);
            throw error;
        }
    },

    // Get recent activities
    getRecentActivities: async () => {
        try {
            const response = await API.get<ApiResponse<any[]>>(
                "/admin/recent-activities"
            );
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch recent activities:", error);
            throw error;
        }
    },

    // Get all users
    getAllUsers: async () => {
        try {
            const response = await API.get<ApiResponse<any[]>>("/admin/users");
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch all users:", error);
            throw error;
        }
    },

    // Get user by ID
    getUserById: async (userId: string) => {
        try {
            const response = await API.get<ApiResponse<any>>(
                `/admin/users/${userId}`
            );
            return response.data.data;

        } catch (error) {
            console.error("Failed to fetch user by ID:", error);
            throw error;
        }
    },

    // Get all staking positions
    getAllStakingPositions: async () => {
        try {
            const response = await API.get<ApiResponse<any[]>>(
                "/admin/staking-positions"
            );
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch all staking positions:", error);
            throw error;
        }
    },

    // Get all deposits
    getAllDeposits: async () => {
        try {
            const response = await API.get<ApiResponse<UserStakingPosition[]>>("/admin/deposits");
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch all deposits:", error);
            throw error;
        }
    },
    approveDeposit: async (depositId: string) => {
        try {
            const response = await API.post<ApiResponse<any>>(
                `/admin/deposits/approve/${depositId}`
            );
            return response.data.data;
        } catch (error) {
            console.error("Failed to approve deposit:", error);
            throw error;
        }
    },
    disapproveDeposit: async (depositId: string) => {
        try {
            const response = await API.post<ApiResponse<any>>(
                `/admin/deposits/disapprove/${depositId}`
            );
            return response.data.data;
        } catch (error) {
            console.error("Failed to disapprove deposit:", error);
            throw error;
        }
    },
    getAllWithdrawals: async () => {
        try {
            const response = await API.get<ApiResponse<Withdrawal[]>>(
                "/admin/withdrawals"
            );
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch all withdrawals:", error);
            throw error;
        }
    },
    approveWithdrawal: async (withdrawalId: string) => {
        try {
            const response = await API.post<ApiResponse<any>>(
                `/admin/withdrawals/approve/${withdrawalId}`
            );  
            return response.data.data;
        } catch (error) {
            console.error("Failed to approve withdrawal:", error);
            throw error;
        }
    },
    disapproveWithdrawal: async (withdrawalId: string) => {
        try {
            const response = await API.post<ApiResponse<any>>(
                `/admin/withdrawals/disapprove/${withdrawalId}`
            );
            return response.data.data;
        } catch (error) {
            console.error("Failed to disapprove withdrawal:", error);
            throw error;
        }
    },
}