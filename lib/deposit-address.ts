import { API } from "@/app/api/apiClient";
import { ApiResponse } from "@/app/model";
import { DepositAddress } from "@/app/model/IDepositAddress";

// API functions for deposit address-related data
export const depositAddressApi = {
    // Get all deposit address
      getAllDepositAddresses: async (): Promise<DepositAddress[]> => {
          try {
            const response = await API.get<ApiResponse<DepositAddress[]>>(
              "/deposit-addresses"
            );
            return response.data.data;
          } catch (error) {
            console.error("Failed to fetch deposit addresses:", error);
            throw error;
          }
        }
}