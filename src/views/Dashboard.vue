<template>
  <div>
    <!-- Personalized Header -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            Welcome back, <span class="text-gradient">{{ authStore.currentUser?.username || 'Trader' }}</span> 👋
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Here's your trading overview
            <span v-if="dashboardStore.portfolioMetrics.aggregateROI > 0 && dashboardStore.allStrategyStats.length > 0" class="text-green-600 dark:text-green-400 font-medium">
              — Your portfolio is up {{ (dashboardStore.portfolioMetrics.aggregateROI * 100).toFixed(2) }}%
            </span>
          </p>
        </div>
        <div v-if="dashboardStore.isStatsLoading" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg class="w-4 h-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Loading portfolio stats...
        </div>
      </div>
    </div>
    
    <LoadingSpinner v-if="dashboardStore.isEssentialLoading" message="Loading dashboard..." />
    
    <div v-else>
      <!-- Performance Summary (Top Priority - Core KPIs) -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6 uppercase tracking-wide">Performance Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Portfolio Value - Standard -->
          <DashboardCard>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Portfolio Value</h3>
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">${{ dashboardStore.portfolioMetrics.totalPortfolioValue.toFixed(2) }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Total position value</p>
          </DashboardCard>
          
          <!-- Total P&L - EMPHASIZED (Larger, more prominent) -->
          <DashboardCard class="md:col-span-2 lg:col-span-1">
            <div :class="['absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity', dashboardStore.portfolioMetrics.totalPnL >= 0 ? 'bg-gradient-to-br from-green-500/10 to-transparent' : 'bg-gradient-to-br from-red-500/10 to-transparent']"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total P&L</h3>
                <div :class="['w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform', dashboardStore.portfolioMetrics.totalPnL >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30']">
                  <svg :class="['w-6 h-6', dashboardStore.portfolioMetrics.totalPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p :class="['text-4xl font-bold', dashboardStore.portfolioMetrics.totalPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400']">
                ${{ dashboardStore.portfolioMetrics.totalPnL.toFixed(2) }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Realized + Unrealized</p>
            </div>
          </DashboardCard>
          
          <!-- Aggregate ROI - EMPHASIZED (Larger, more prominent) -->
          <DashboardCard class="md:col-span-2 lg:col-span-1">
            <div :class="['absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity', dashboardStore.portfolioMetrics.aggregateROI >= 0 ? 'bg-gradient-to-br from-green-500/10 to-transparent' : 'bg-gradient-to-br from-red-500/10 to-transparent']"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Aggregate ROI</h3>
                <div :class="['w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform', dashboardStore.portfolioMetrics.aggregateROI >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30']">
                  <svg :class="['w-6 h-6', dashboardStore.portfolioMetrics.aggregateROI >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p :class="['text-4xl font-bold', dashboardStore.portfolioMetrics.aggregateROI >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400']">
                {{ (dashboardStore.portfolioMetrics.aggregateROI * 100).toFixed(2) }}%
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Weighted average</p>
            </div>
          </DashboardCard>
          
          <!-- Total Invested - Standard -->
          <DashboardCard class="opacity-90">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Invested</h3>
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">${{ dashboardStore.portfolioMetrics.totalInvested.toFixed(2) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Across all strategies</p>
            </div>
          </DashboardCard>
        </div>
      </div>

      <!-- Operations / Actions (Middle Section) -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6 uppercase tracking-wide">Operations</h2>
        
        <!-- Operations Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Quick Stats - Secondary Metrics -->
          <div class="lg:col-span-1">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Quick Stats</h3>
            <div class="space-y-4">
              <DashboardCard class="opacity-75">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Strategies</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ strategiesStore.strategies.length }}</p>
                    <p class="text-xs text-green-600 dark:text-green-400 mt-1">{{ strategiesStore.enabledStrategies.length }} enabled</p>
                  </div>
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard class="opacity-75">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">USDC Balance</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">${{ dashboardStore.balance?.usdc_available.toFixed(2) || '0.00' }}</p>
                  </div>
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard class="opacity-75">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Fees</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">${{ dashboardStore.portfolioMetrics.totalFees.toFixed(2) }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1" :title="`Across ${dashboardStore.portfolioMetrics.totalOrders} orders`">
                      {{ dashboardStore.portfolioMetrics.totalOrders }} orders
                    </p>
                  </div>
                  <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
          
          <!-- Recent Strategies - Primary Interaction Area -->
          <div class="lg:col-span-2">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Strategies</h3>
              <router-link to="/strategies" class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors">
                View All →
              </router-link>
            </div>
            <div v-if="recentStrategies.length === 0" class="card text-center py-12">
              <svg class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p class="text-gray-700 dark:text-gray-300 font-medium mb-2">No strategies yet</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Create your first DCA strategy to get started</p>
              <router-link to="/strategies/new" class="btn-primary inline-flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Strategy
              </router-link>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DashboardCard 
                v-for="strategy in recentStrategies" 
                :key="strategy.id" 
                class="cursor-pointer border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-700"
                @click="$router.push(`/strategies/${strategy.id}`)"
              >
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{{ strategy.name }}</h3>
                  <StatusBadge :status="strategy.enabled ? 'enabled' : 'disabled'" />
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    {{ strategy.base_currency }}/{{ strategy.quote_currency }}
                  </div>
                  <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${{ strategy.amount_quote }}
                  </div>
                  <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ strategy.interval }}
                  </div>
                </div>
                <router-link :to="`/strategies/${strategy.id}`" class="block w-full text-center btn-primary text-sm" @click.stop>View Details</router-link>
              </DashboardCard>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Floating Action Button -->
      <router-link 
        to="/strategies/new"
        class="fixed bottom-8 right-8 w-14 h-14 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 z-30 group"
        title="Create New Strategy"
      >
        <svg class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useStrategiesStore } from '@/stores/strategies'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import StatusBadge from '@/components/Common/StatusBadge.vue'
import DashboardCard from '@/components/Common/DashboardCard.vue'

const strategiesStore = useStrategiesStore()
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

const recentStrategies = computed(() => {
  return strategiesStore.strategies.slice(0, 5)
})

onMounted(async () => {
  await dashboardStore.loadDashboardData()
})
</script>

<style scoped>
/* No scoped styles needed after Tailwind migration */
</style>

