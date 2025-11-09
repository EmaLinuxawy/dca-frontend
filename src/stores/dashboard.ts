import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStrategiesStore } from './strategies'
import { balancesApi } from '@/api/balances'
import { statsApi } from '@/api/stats'
import { ordersApi } from '@/api/orders'
import type { Balance, StrategyStats, Order } from '@/api/types'

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const useDashboardStore = defineStore('dashboard', () => {
  const balance = ref<Balance | null>(null)
  const allStrategyStats = ref<StrategyStats[]>([])
  const recentOrders = ref<Order[]>([])
  const isEssentialLoading = ref(false)
  const isStatsLoading = ref(false)
  const lastFetchTimestamp = ref<number | null>(null)

  const strategiesStore = useStrategiesStore()

  const isLoading = computed(() => isEssentialLoading.value || isStatsLoading.value)

  const portfolioMetrics = computed(() => {
    const stats = allStrategyStats.value
    
    if (stats.length === 0) {
      return {
        totalPortfolioValue: 0,
        totalPnL: 0,
        totalInvested: 0,
        totalFees: 0,
        aggregateROI: 0,
        avgStrategyROI: 0,
        totalOrders: recentOrders.value.length
      }
    }
  
    const totalPortfolioValue = stats.reduce((sum, s) => sum + (s.position_value_quote || 0), 0)
    const totalInvested = stats.reduce((sum, s) => sum + (s.invested_quote || 0), 0)
    const totalFees = stats.reduce((sum, s) => sum + (s.fees?.total_quote || 0), 0)
    const totalRealizedPnL = stats.reduce((sum, s) => sum + (s.realized_pnl_quote || 0), 0)
    const totalUnrealizedPnL = stats.reduce((sum, s) => sum + (s.unrealized_pnl_quote || 0), 0)
    const totalPnL = totalRealizedPnL + totalUnrealizedPnL
  
    // Aggregate ROI (weighted by invested amount)
    const aggregateROI = totalInvested > 0 ? totalPnL / totalInvested : 0
  
    // Average strategy ROI (simple average)
    const rois = stats.map(s => s.roi || 0).filter(r => r !== 0)
    const avgStrategyROI = rois.length > 0 ? rois.reduce((sum, r) => sum + r, 0) / rois.length : 0
  
    return {
      totalPortfolioValue,
      totalPnL,
      totalInvested,
      totalFees,
      aggregateROI,
      avgStrategyROI,
      totalOrders: recentOrders.value.length
    }
  })

  const loadDashboardData = async (force = false) => {
    const now = Date.now()
    if (!force && lastFetchTimestamp.value && (now - lastFetchTimestamp.value) < CACHE_DURATION) {
      // Even if cached, we might want to refresh stats in the background
      loadStrategyStats()
      return
    }

    isEssentialLoading.value = true
    try {
      await Promise.all([
        strategiesStore.fetchAll(),
        loadBalance(),
        loadRecentOrders(),
      ])
      lastFetchTimestamp.value = now
    } finally {
      isEssentialLoading.value = false
    }
    // Load stats in the background after essential data is loaded
    loadStrategyStats()
  }

  const loadBalance = async () => {
    try {
      balance.value = await balancesApi.getUsdcBalance()
    } catch (error) {
      console.error('Failed to load balance:', error)
    }
  }

  const loadStrategyStats = async () => {
    const strategies = strategiesStore.strategies
    if (strategies.length === 0) {
      allStrategyStats.value = []
      return
    }

    isStatsLoading.value = true
    try {
      const bulkStats = await statsApi.getStrategiesStats()
      const strategyIds = new Set(strategies.map(strategy => strategy.id))
      allStrategyStats.value = bulkStats.filter(stat => strategyIds.has(stat.strategy_id))
    } catch (error) {
      console.error('Failed to load strategy stats:', error)
      allStrategyStats.value = []
    } finally {
      isStatsLoading.value = false
    }
  }

  const loadRecentOrders = async () => {
    try {
      const orders = await ordersApi.getAll({ limit: 50 })
      recentOrders.value = orders.sort((a, b) => 
        new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime()
      )
    } catch (error) {
      console.error('Failed to load recent orders:', error)
    }
  }

  return {
    balance,
    allStrategyStats,
    recentOrders,
    isLoading,
    isEssentialLoading,
    isStatsLoading,
    portfolioMetrics,
    loadDashboardData,
  }
})
