<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Orders</h1>
      <p class="text-gray-600 dark:text-gray-400">View and manage your order history</p>
    </div>
    
    <!-- Summary Stats -->
    <div v-if="!loading && allOrders.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="glass-card p-6 rounded-2xl">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Orders</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ allOrders.length }}</p>
      </div>
      <div class="glass-card p-6 rounded-2xl">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Filled</p>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ orderStats.filled }}</p>
      </div>
      <div class="glass-card p-6 rounded-2xl">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Volume</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">${{ orderStats.totalVolume.toFixed(2) }}</p>
      </div>
      <div class="glass-card p-6 rounded-2xl">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Fees</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">${{ orderStats.totalFees.toFixed(2) }}</p>
      </div>
    </div>
    
    <!-- Enhanced Filters -->
    <div class="glass-card mb-6 p-6 rounded-2xl">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <!-- Search -->
        <div class="lg:col-span-2">
          <label class="label">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by order ID, token pair..."
              class="input pl-10"
              @keydown.escape="searchQuery = ''"
            />
          </div>
        </div>
        
        <!-- Status Filter -->
        <div>
          <label class="label">Status</label>
          <select v-model="statusFilter" class="input">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="filled">Filled</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="resting">Resting</option>
          </select>
        </div>
        
        <!-- Strategy Filter -->
        <div>
          <label class="label">Strategy</label>
          <select v-model="strategyFilter" class="input">
            <option value="">All Strategies</option>
            <option v-for="strategy in strategies" :key="strategy.id" :value="strategy.id">
              {{ strategy.name }} ({{ strategy.base_currency }}/{{ strategy.quote_currency }})
            </option>
          </select>
        </div>
      </div>
      
      <!-- Active Filters Chips -->
      <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span class="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
        <button
          v-if="statusFilter"
          @click="statusFilter = ''"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          Status: {{ statusFilter }}
          <svg class="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          v-if="strategyFilter"
          @click="strategyFilter = ''"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          Strategy: {{ getStrategyName(strategyFilter) }}
          <svg class="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          Search: "{{ searchQuery }}"
          <svg class="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          @click="clearAllFilters"
          class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
        >
          Clear all
        </button>
      </div>
    </div>
    
    <LoadingSpinner v-if="loading" />
    
    <div v-else>
      <div v-if="filteredOrders.length === 0" class="card text-center py-12">
        <svg class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No orders found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          <span v-if="hasActiveFilters">Try adjusting your filters or search query.</span>
          <span v-else>You don't have any orders yet.</span>
        </p>
        <button v-if="hasActiveFilters" @click="clearAllFilters" class="btn-secondary">
          Clear Filters
        </button>
      </div>
      
      <div v-else class="glass-card p-0 overflow-hidden rounded-2xl">
        <!-- Table Controls -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredOrders.length) }} of {{ filteredOrders.length }} orders
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600 dark:text-gray-400">Show:</label>
            <select 
              v-model="pageSize" 
              @change="currentPage = 1"
              class="input text-sm py-1.5 px-3 min-w-[80px]"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
              <option :value="0">All</option>
            </select>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
            <thead class="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="toggleSort('id')"
                >
                  <div class="flex items-center space-x-1">
                    <span>ID</span>
                    <svg v-if="sortField === 'id'" :class="['w-4 h-4', sortDirection === 'asc' ? '' : 'transform rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Token Pair</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Strategy</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Side</th>
                <th 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="toggleSort('size_base')"
                >
                  <div class="flex items-center space-x-1">
                    <span>Size</span>
                    <svg v-if="sortField === 'size_base'" :class="['w-4 h-4', sortDirection === 'asc' ? '' : 'transform rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </th>
                <th 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="toggleSort('price_quote')"
                >
                  <div class="flex items-center space-x-1">
                    <span>Price</span>
                    <svg v-if="sortField === 'price_quote'" :class="['w-4 h-4', sortDirection === 'asc' ? '' : 'transform rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </th>
                <th 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="toggleSort('cost_quote')"
                >
                  <div class="flex items-center space-x-1">
                    <span>Cost</span>
                    <svg v-if="sortField === 'cost_quote'" :class="['w-4 h-4', sortDirection === 'asc' ? '' : 'transform rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fees</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="toggleSort('placed_at')"
                >
                  <div class="flex items-center space-x-1">
                    <span>Placed At</span>
                    <svg v-if="sortField === 'placed_at'" :class="['w-4 h-4', sortDirection === 'asc' ? '' : 'transform rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-transparent divide-y divide-gray-200/50 dark:divide-gray-700/50">
              <tr 
                v-for="(order, index) in paginatedOrders" 
                :key="order.id" 
                @click="$router.push(`/orders/${order.id}`)" 
                :class="[
                  'hover:bg-gray-50/50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors',
                  index % 2 === 0 ? 'bg-transparent' : 'bg-gray-50/30 dark:bg-gray-800/30'
                ]"
              >
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{ order.id }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ getTokenPair(order.strategy_id) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <span class="text-gray-600 dark:text-gray-400">{{ order.strategy_id || '-' }}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span :class="getOrderReasonBadgeClasses(order.reason)">
                    {{ formatOrderReason(order.reason) }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span :class="[
                    'font-semibold',
                    order.side?.toLowerCase() === 'buy' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  ]">
                    {{ order.side }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">{{ (order.size_base ?? 0).toFixed(6) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">${{ (order.price_quote ?? 0).toFixed(4) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">${{ (order.cost_quote ?? 0).toFixed(2) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${{ (order.fees_quote ?? 0).toFixed(2) || '0.00' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm"><StatusBadge :status="order.status" /></td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ order.placed_at ? formatTableDate(order.placed_at) : '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="pageSize > 0 && totalPages > 1" class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              First
            </button>
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <!-- Page Numbers -->
            <div class="flex items-center space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                  currentPage === page
                    ? 'bg-primary-600 text-white dark:bg-primary-500'
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ordersApi } from '@/api/orders'
import { strategiesApi } from '@/api/strategies'
import type { Order, Strategy } from '@/api/types'
import { formatTableDate } from '@/utils/dateFormatter'
import { formatOrderReason, getOrderReasonBadgeClasses } from '@/utils/orderHelpers'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import StatusBadge from '@/components/Common/StatusBadge.vue'

const route = useRoute()
const allOrders = ref<Order[]>([])
const strategies = ref<Strategy[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')
const strategyFilter = ref<number | string>('')
const pageSize = ref(25)
const currentPage = ref(1)
const sortField = ref<string>('placed_at')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Create a map for quick strategy lookup
const strategyMap = ref<Map<number, Strategy>>(new Map())

// Check for strategy_id in query params
onMounted(async () => {
  await loadStrategies()
  await loadOrders()
  
  // Check for strategy_id in query params
  if (route.query.strategy_id) {
    const strategyId = Number(route.query.strategy_id)
    if (!isNaN(strategyId)) {
      strategyFilter.value = strategyId
    }
  }
})

const loadStrategies = async () => {
  try {
    strategies.value = await strategiesApi.getAll()
    strategyMap.value = new Map(strategies.value.map(s => [s.id, s]))
  } catch (error) {
    console.error('Failed to load strategies:', error)
  }
}

const getTokenPair = (strategyId: number | null): string => {
  if (!strategyId) return '-'
  const strategy = strategyMap.value.get(strategyId)
  if (!strategy) return '-'
  return `${strategy.base_currency}/${strategy.quote_currency}`
}

const getStrategyName = (strategyId: number | string): string => {
  if (!strategyId) return ''
  const id = typeof strategyId === 'string' ? Number(strategyId) : strategyId
  const strategy = strategyMap.value.get(id)
  if (!strategy) return `Strategy ${id}`
  return strategy.name
}

const loadOrders = async () => {
  loading.value = true
  try {
    // Load all orders (we'll filter and paginate client-side for better UX)
    allOrders.value = await ordersApi.getAll({ limit: 1000 })
  } catch (error) {
    console.error('Failed to load orders:', error)
  } finally {
    loading.value = false
  }
}

// Computed: Order Statistics
const orderStats = computed(() => {
  const filled = allOrders.value.filter(o => o.status === 'filled').length
  const totalVolume = allOrders.value.reduce((sum, o) => sum + (o.cost_quote ?? 0), 0)
  const totalFees = allOrders.value.reduce((sum, o) => sum + (o.fees_quote ?? 0), 0)
  return { filled, totalVolume, totalFees }
})

// Computed: Check if filters are active
const hasActiveFilters = computed(() => {
  return !!(statusFilter.value || strategyFilter.value || searchQuery.value)
})

// Computed: Filtered orders
const filteredOrders = computed(() => {
  let filtered = [...allOrders.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => {
      const orderId = order.id.toString()
      const tokenPair = getTokenPair(order.strategy_id).toLowerCase()
      return orderId.includes(query) || tokenPair.includes(query)
    })
  }
  
  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }
  
  // Strategy filter
  if (strategyFilter.value) {
    const strategyId = typeof strategyFilter.value === 'string' ? Number(strategyFilter.value) : strategyFilter.value
    filtered = filtered.filter(order => order.strategy_id === strategyId)
  }
  
  // Sort
  filtered.sort((a, b) => {
    let aVal: any
    let bVal: any
    
    switch (sortField.value) {
      case 'id':
        aVal = a.id
        bVal = b.id
        break
      case 'size_base':
        aVal = a.size_base ?? 0
        bVal = b.size_base ?? 0
        break
      case 'price_quote':
        aVal = a.price_quote ?? 0
        bVal = b.price_quote ?? 0
        break
      case 'cost_quote':
        aVal = a.cost_quote ?? 0
        bVal = b.cost_quote ?? 0
        break
      case 'placed_at':
      default:
        aVal = a.placed_at ? new Date(a.placed_at).getTime() : 0
        bVal = b.placed_at ? new Date(b.placed_at).getTime() : 0
        break
    }
    
    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
  
  return filtered
})

// Computed: Pagination
const totalPages = computed(() => {
  if (pageSize.value === 0) return 1
  return Math.ceil(filteredOrders.value.length / pageSize.value)
})

const paginatedOrders = computed(() => {
  if (pageSize.value === 0) return filteredOrders.value
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Functions
const toggleSort = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  currentPage.value = 1 // Reset to first page when sorting
}

const clearAllFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  strategyFilter.value = ''
  currentPage.value = 1
}

// Watch for filter changes and reset to page 1
watch([statusFilter, strategyFilter, searchQuery], () => {
  currentPage.value = 1
})
</script>


