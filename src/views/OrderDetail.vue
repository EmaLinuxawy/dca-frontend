<template>
  <div>
    <LoadingSpinner v-if="loading" />
    
    <ErrorAlert v-if="error && !loading" :error="error" />
    
    <div v-else-if="order">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Order #{{ order.id }}</h1>
          <StatusBadge :status="order.status" />
        </div>
        <router-link to="/orders" class="btn-secondary">Back to Orders</router-link>
      </div>
      
      <div class="card mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Order Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Order ID</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ order.id }}</p>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Client Order ID</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ order.client_order_id }}</p>
          </div>
          <div v-if="order.exchange_order_id" class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Exchange Order ID</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ order.exchange_order_id }}</p>
          </div>
          <div v-if="order.strategy_id" class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Strategy</p>
            <router-link :to="`/strategies/${order.strategy_id}`" class="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              View Strategy #{{ order.strategy_id }}
            </router-link>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Side</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ order.side.toUpperCase() }}</p>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Size (Base)</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ order.size_base.toFixed(6) }}</p>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Price (Quote)</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">${{ order.price_quote.toFixed(4) }}</p>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Cost (Quote)</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">${{ order.cost_quote.toFixed(2) }}</p>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Slippage</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ order.slippage_bps }} BPS</p>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Fees</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">${{ order.fees_quote?.toFixed(2) || '0.00' }}</p>
          </div>
          <div v-if="order.liquidity" class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Liquidity</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ order.liquidity }}</p>
          </div>
          <div v-if="order.reason" class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Reason</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ order.reason }}</p>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Placed At</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ new Date(order.placed_at).toLocaleString() }}</p>
          </div>
          <div v-if="order.filled_at" class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Filled At</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ new Date(order.filled_at).toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="!error" class="card text-center py-12">
      <svg class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Order not found</p>
      <router-link to="/orders" class="btn-primary">Back to Orders</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ordersApi } from '@/api/orders'
import type { Order } from '@/api/types'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import StatusBadge from '@/components/Common/StatusBadge.vue'
import ErrorAlert from '@/components/Common/ErrorAlert.vue'

const route = useRoute()
const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const orderIdParam = route.params.id
    if (!orderIdParam || Array.isArray(orderIdParam)) {
      error.value = 'Invalid order ID'
      loading.value = false
      return
    }
    
    const orderId = Number(orderIdParam)
    if (isNaN(orderId)) {
      error.value = 'Order ID must be a number'
      loading.value = false
      return
    }
    
    order.value = await ordersApi.getById(orderId)
    error.value = null
  } catch (err: any) {
    console.error('Failed to load order:', err)
    error.value = err.response?.data?.detail || err.message || 'Failed to load order'
    order.value = null
  } finally {
    loading.value = false
  }
})
</script>


