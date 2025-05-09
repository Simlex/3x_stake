import { API } from "@/app/api/apiClient";
import { ApiResponse } from "@/app/model";
import { AdminDashboardStats } from "@/app/model/IAdmin";

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
}