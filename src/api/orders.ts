import apiClient from './client'
import type { Order } from './types'

export interface OrdersQueryParams {
  strategy_id?: number
  status?: 'pending' | 'filled' | 'failed' | 'cancelled'
  skip?: number
  limit?: number
}

export const ordersApi = {
  // Get all orders
  getAll: async (params: OrdersQueryParams = {}): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders', { params })
    return response.data
  },

  // Get order by ID
  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`)
    return response.data
  },
}

