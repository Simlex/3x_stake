import { API } from "@/app/api/apiClient";
import { ApiResponse, Reward, StakingPlan } from "@/app/model";

// API functions for reward-related data
export const rewardApi = {
  claimReward: async (positionId: string): Promise<StakingPlan[]> => {
    try {
      const response = await API.post<ApiResponse<StakingPlan[]>>(
        `/rewards/${positionId}/claim`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to claim:", error);
      throw error;
    }
  },
  getUserRewards: async (userId: string): Promise<Reward[]> => {
    try {
      const response = await API.get<ApiResponse<Reward[]>>(
        `/user-rewards/${userId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch rewards:", error);
      throw error;
    }
  },
};
