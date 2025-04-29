import { API } from "@/app/api/apiClient"
import { ApiResponse, StakingPlan, StakingPosition } from "@/app/model"

// API functions for staking-related data
export const stakingApi = {
    fetchStakingPlans: async (): Promise<StakingPlan[]> => {
        try {
          const response = await API.get<ApiResponse<StakingPlan[]>>("/staking/plans")
          return response.data.data
        } catch (error) {
          console.error("Failed to fetch staking plans:", error)
          throw error
        }
      },
    createStakingPosition: async (data: Partial<StakingPosition>): Promise<StakingPosition> => {
        try {
          const response = await API.post<ApiResponse<StakingPosition>>("/staking", data)
          return response.data.data
        } catch (error) {
          console.error("Failed to create staking position:", error)
          throw error
        }
      },
}