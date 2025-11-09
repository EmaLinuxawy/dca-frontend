import apiClient from './client'
import type { StrategyStats, StrategiesStatsResponse } from './types'

export const statsApi = {
  // Get statistics for all strategies in a single request
  getStrategiesStats: async (): Promise<StrategyStats[]> => {
    const response = await apiClient.get<StrategiesStatsResponse>('/stats/strategies')
    return response.data.stats ?? []
  },
}

