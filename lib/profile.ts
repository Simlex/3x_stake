import { API } from "@/app/api/apiClient";
import type {
  ApiResponse,
  UserProfileSummary,
  StakingPosition,
  Activity,
  UserPreference,
  User,
} from "@/app/model";
import { RequestWithdrawal } from "@/app/model/IWithdrawal";

type TWithdrawableBalance = {
  withdrawableBalance: number;
  pendingWithdrawals: number;
};

// API functions for profile-related data
export const profileApi = {
  // Get user profile summary (for overview tab)
  getProfileSummary: async (): Promise<UserProfileSummary> => {
    try {
      const response = await API.get<ApiResponse<UserProfileSummary>>(
        "/profile/summary"
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch profile summary:", error);
      throw error;
    }
  },

  // Get user profile details
  getUserProfile: async (): Promise<User> => {
    try {
      const response = await API.get<ApiResponse<User>>("/profile");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await API.put<ApiResponse<User>>("/profile", data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  },

  // Get staking positions
  getStakingPositions: async (): Promise<StakingPosition[]> => {
    try {
      const response = await API.get<ApiResponse<StakingPosition[]>>(
        "/profile/staking"
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch staking positions:", error);
      throw error;
    }
  },

  // Get withdrawable balance
  getWithdrawableBalance: async (): Promise<TWithdrawableBalance> => {
    try {
      const response = await API.get<ApiResponse<TWithdrawableBalance>>(
        "/profile/balance"
      );
      console.log("🚀 ~ getWithdrawableBalance: ~ response:", response);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch user withdrawable balance:", error);
      throw error;
    }
  },

  // Initiate withdrawal
  initiateWithdrawal: async (
    data: RequestWithdrawal
  ): Promise<{ success: boolean }> => {
    try {
      const response = await API.post<ApiResponse<{ success: boolean }>>(
        "/profile/withdraw",
        data
      );
      console.log("🚀 ~ response:", response)
      return response.data.data;
    } catch (error) {
      console.error("Failed to initiate withdrawal:", error);
      throw error;
    }
  },

  // Get activity history
  getActivityHistory: async (): Promise<Activity[]> => {
    try {
      const response = await API.get<ApiResponse<Activity[]>>(
        "/profile/activity"
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch activity history:", error);
      throw error;
    }
  },

  // Get user preferences
  getUserPreferences: async (): Promise<UserPreference> => {
    try {
      const response = await API.get<ApiResponse<UserPreference>>(
        "/profile/preferences"
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch user preferences:", error);
      throw error;
    }
  },

  // Update user preferences
  updateUserPreferences: async (
    data: Partial<UserPreference>
  ): Promise<UserPreference> => {
    try {
      const response = await API.put<ApiResponse<UserPreference>>(
        "/profile/preferences",
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to update user preferences:", error);
      throw error;
    }
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean }> => {
    try {
      const response = await API.post<ApiResponse<{ success: boolean }>>(
        "/profile/change-password",
        {
          currentPassword,
          newPassword,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to change password:", error);
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await API.post<
        ApiResponse<{ success: boolean; message: string }>
      >("/profile/forgot-password", { email });
      return response.data.data;
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ success: boolean }> => {
    try {
      const response = await API.post<ApiResponse<{ success: boolean }>>(
        "/profile/reset-password",
        { token, newPassword }
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to reset password:", error);
      throw error;
    }
  },

  // Claim reward
  claimReward: async (rewardId: string): Promise<{ success: boolean }> => {
    try {
      const response = await API.post<ApiResponse<{ success: boolean }>>(
        `/rewards/${rewardId}/claim`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to claim reward:", error);
      throw error;
    }
  },

  // Unstake position
  unstakePosition: async (
    positionId: string
  ): Promise<{ success: boolean }> => {
    try {
      const response = await API.post<ApiResponse<{ success: boolean }>>(
        `/staking/${positionId}/unstake`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to unstake position:", error);
      throw error;
    }
  },

  // Restake position
  restakePosition: async (
    positionId: string
  ): Promise<{ success: boolean }> => {
    try {
      const response = await API.post<ApiResponse<{ success: boolean }>>(
        `/staking/${positionId}/restake`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to restake position:", error);
      throw error;
    }
  },
};
