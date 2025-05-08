import { API } from "@/app/api/apiClient";
import { ApiResponse } from "@/app/model";
import { ReferralData, ReferralStats } from "@/app/model/IReferral";

// API functions for referral-related data
export const referralApi = {
  // Get referral data
  getReferralData: async (): Promise<ReferralData> => {
    try {
      const response = await API.get<ApiResponse<ReferralData>>("/referrals");
      console.log("🚀 ~ getReferralData: ~ response:", response)
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch referral data:", error);
      throw error;
    }
  },

  // Get referral stats (lightweight version)
  getReferralStats: async (): Promise<ReferralStats> => {
    try {
      const response = await API.get<ApiResponse<ReferralStats>>(
        "/referrals/stats"
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch referral stats:", error);
      throw error;
    }
  },

  // Claim referral bonus
  claimReferralBonus: async (bonusId: string): Promise<void> => {
    try {
      const response = await API.post<ApiResponse<void>>(
        "/api/referrals/claim-bonus",
        { bonusId }
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to claim referral bonus:", error);
      throw error;
    }
  },
};
