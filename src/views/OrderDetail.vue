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
      
      <div class="glass-card p-6 md:p-8 rounded-2xl">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Order Details</h2>
        
        <!-- Grid Layout with Sections -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Column 1: Identification -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Identification</h3>
            
            <div class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Order ID</p>
              <p class="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100 break-all">{{ order.id }}</p>
            </div>
            
            <div class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Client Order ID</p>
              <p class="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100 break-all">{{ order.client_order_id }}</p>
            </div>
            
            <div v-if="order.exchange_order_id" class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Exchange Order ID</p>
              <p class="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100 break-all">{{ order.exchange_order_id }}</p>
            </div>
            
            <div v-if="order.strategy_id" class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Strategy</p>
              <router-link :to="`/strategies/${order.strategy_id}`" class="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center">
                View Strategy #{{ order.strategy_id }}
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </router-link>
            </div>
          </div>

          <!-- Column 2: Execution Details -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Execution</h3>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Side</p>
                <p :class="[
                  'font-bold text-lg',
                  order.side.toLowerCase() === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                ]">{{ order.side.toUpperCase() }}</p>
              </div>
              
              <div class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Size (Base)</p>
                <p class="font-bold text-lg text-gray-900 dark:text-gray-100">{{ order.size_base.toFixed(6) }}</p>
              </div>
            </div>

            <div class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Price (Quote)</p>
              <p class="font-bold text-xl text-gray-900 dark:text-gray-100">${{ order.price_quote.toFixed(4) }}</p>
            </div>

            <div class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Cost (Quote)</p>
              <p class="font-bold text-xl text-gray-900 dark:text-gray-100">${{ order.cost_quote.toFixed(2) }}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Fees</p>
                <p class="font-semibold text-gray-900 dark:text-gray-100">${{ order.fees_quote?.toFixed(2) || '0.00' }}</p>
              </div>
              
              <div class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Slippage</p>
                <p class="font-semibold text-gray-900 dark:text-gray-100">{{ order.slippage_bps }} BPS</p>
              </div>
            </div>
          </div>

          <!-- Column 3: Context & Timing -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Context</h3>
            
            <div v-if="order.reason" class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Reason</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ order.reason }}</p>
            </div>
            
            <div v-if="order.liquidity" class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Liquidity</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ order.liquidity }}</p>
            </div>
            
            <div class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Placed At</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ new Date(order.placed_at).toLocaleString() }}</p>
            </div>
            
            <div v-if="order.filled_at" class="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Filled At</p>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ new Date(order.filled_at).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="!error" class="glass-card text-center py-12 rounded-2xl">
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


