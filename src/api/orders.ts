import apiClient from './client'
import type { Order } from './types'

export interface OrdersQueryParams {
  strategy_id?: number
  status?: 'pending' | 'filled' | 'failed' | 'cancelled'
  skip?: number
  limit?: number
}

const ORDERS_ENDPOINT = '/orders/'

export const ordersApi = {
  // Get all orders
  getAll: async (params: OrdersQueryParams = {}): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>(ORDERS_ENDPOINT, { params })
    return response.data
  },

  // Get order by ID
  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`${ORDERS_ENDPOINT}${id}`)
    return response.data
  },
}

