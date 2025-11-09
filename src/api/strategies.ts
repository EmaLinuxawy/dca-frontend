import apiClient from './client'
import type { Strategy, StrategyCreate, StrategyUpdate } from './types'

export const strategiesApi = {
  // Get all strategies
  getAll: async (skip: number = 0, limit: number = 100): Promise<Strategy[]> => {
    const response = await apiClient.get<Strategy[]>('/strategies', {
      params: { skip, limit },
    })
    return response.data
  },

  // Get strategy by ID
  getById: async (id: number): Promise<Strategy> => {
    const response = await apiClient.get<Strategy>(`/strategies/${id}`)
    return response.data
  },

  // Create strategy
  create: async (data: StrategyCreate): Promise<Strategy> => {
    const response = await apiClient.post<Strategy>('/strategies', data)
    return response.data
  },

  // Update strategy
  update: async (id: number, data: StrategyUpdate): Promise<Strategy> => {
    const response = await apiClient.patch<Strategy>(`/strategies/${id}`, data)
    return response.data
  },

  // Delete strategy
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/strategies/${id}`)
  },

  // Pause strategy
  pause: async (id: number): Promise<Strategy> => {
    const response = await apiClient.post<Strategy>(`/strategies/${id}/pause`)
    return response.data
  },

  // Resume strategy
  resume: async (id: number): Promise<Strategy> => {
    const response = await apiClient.post<Strategy>(`/strategies/${id}/resume`)
    return response.data
  },

  // Run strategy now
  runNow: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(`/strategies/${id}/run-now`)
    return response.data
  },
}

