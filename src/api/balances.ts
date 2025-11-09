import apiClient from './client'
import type { Balance } from './types'

export const balancesApi = {
  // Get USDC balance
  getUsdcBalance: async (): Promise<Balance> => {
    const response = await apiClient.get<Balance>('/balances/usdc')
    return response.data
  },
}

