<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Strategies</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your DCA trading strategies</p>
      </div>
      <router-link to="/strategies/new" class="btn-primary whitespace-nowrap">
        <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Strategy
      </router-link>
    </div>
    
    <LoadingSpinner v-if="strategiesStore.isLoading" />
    
    <div v-else>
      <!-- Enhanced Filters with Chips -->
      <div class="glass-card mb-6 p-6 rounded-2xl">
        <div class="mb-4">
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
              placeholder="Search by name, pair, or status..."
              class="input pl-10 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500 backdrop-blur-sm"
              @keydown.escape="searchQuery = ''"
            />
          </div>
        </div>
        
        <!-- Filter Chips -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="statusFilter = ''"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              statusFilter === '' 
                ? 'bg-primary-600 text-white dark:bg-primary-500 shadow-lg shadow-primary-500/20' 
                : 'bg-gray-100/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 backdrop-blur-sm'
            ]"
          >
            All
          </button>
          <button
            @click="statusFilter = 'enabled'"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              statusFilter === 'enabled' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700 shadow-lg shadow-green-500/10' 
                : 'bg-gray-100/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 backdrop-blur-sm border border-transparent'
            ]"
          >
            Enabled
          </button>
          <button
            @click="statusFilter = 'disabled'"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              statusFilter === 'disabled' 
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 shadow-lg' 
                : 'bg-gray-100/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 backdrop-blur-sm border border-transparent'
            ]"
          >
            Disabled
          </button>
        </div>
      </div>
      
      <ErrorAlert v-if="strategiesStore.error" :error="strategiesStore.error" @dismiss="strategiesStore.error = null" />
      
      <!-- Success Message -->
      <div v-if="successMessage" class="card mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-green-800 dark:text-green-200 font-medium">{{ successMessage }}</p>
          </div>
          <button @click="successMessage = null" class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Strategies Grid -->
      <div v-if="filteredStrategies.length === 0" class="card text-center py-16">
        <svg class="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">You don't have any DCA strategies yet</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Start by creating your first strategy to automate your trading</p>
        <router-link to="/strategies/new" class="btn-primary inline-flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Your First Strategy
        </router-link>
      </div>
      
      <div v-else ref="parentRef" class="list-container" style="height: 600px; overflow-y: auto;">
        <div :style="{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }">
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            :style="{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRows[0]?.start ?? 0}px)`,
            }"
          >
            <div
              v-for="virtualRow in virtualRows"
              :key="virtualRow.index"
              class="w-full"
            >
              <div
                v-if="filteredStrategies[virtualRow.index]"
                :class="[
                  'glass-card hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group relative p-6 rounded-2xl',
                  'border',
                  filteredStrategies[virtualRow.index].enabled
                    ? 'border-green-200/50 dark:border-green-800/30 bg-gradient-to-br from-green-50/30 dark:from-green-900/10 to-transparent'
                    : 'border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-gray-50/30 dark:from-gray-800/30 to-transparent'
                ]"
              >
                <!-- Top Section: Name, Status Toggle, Performance Metrics -->
                <div class="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex justify-between items-start mb-3">
                    <router-link 
                      :to="`/strategies/${filteredStrategies[virtualRow.index].id}`"
                      class="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex-1 cursor-pointer"
                    >
                      {{ filteredStrategies[virtualRow.index].name }}
                    </router-link>
                    <!-- Quick Status Toggle -->
                    <div class="flex items-center space-x-2 ml-3">
                      <button
                        @click.stop="toggleStrategyStatus(filteredStrategies[virtualRow.index].id, filteredStrategies[virtualRow.index].enabled)"
                        :class="[
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                          filteredStrategies[virtualRow.index].enabled ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                        ]"
                      >
                        <span
                          :class="[
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            filteredStrategies[virtualRow.index].enabled ? 'translate-x-6' : 'translate-x-1'
                          ]"
                        />
                      </button>
                      <span class="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[50px]">
                        {{ filteredStrategies[virtualRow.index].enabled ? 'Enabled' : 'Disabled' }}
                      </span>
                    </div>
                  </div>

                  <!-- Performance Metrics -->
                  <div v-if="strategyStatsMap.get(filteredStrategies[virtualRow.index].id)" class="grid grid-cols-3 gap-2 text-xs">
                    <div class="text-center p-2 rounded bg-gray-50 dark:bg-gray-800/50">
                      <p class="text-gray-500 dark:text-gray-400 mb-1">ROI</p>
                      <p :class="[
                        'font-bold text-sm',
                        (strategyStatsMap.get(filteredStrategies[virtualRow.index].id)?.roi ?? 0) >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      ]">
                        {{ ((strategyStatsMap.get(filteredStrategies[virtualRow.index].id)?.roi ?? 0) * 100).toFixed(2) }}%
                      </p>
                    </div>
                    <div class="text-center p-2 rounded bg-gray-50 dark:bg-gray-800/50">
                      <p class="text-gray-500 dark:text-gray-400 mb-1">P&L</p>
                      <p :class="[
                        'font-bold text-sm',
                        ((strategyStatsMap.get(filteredStrategies[virtualRow.index].id)?.realized_pnl_quote ?? 0) + (strategyStatsMap.get(filteredStrategies[virtualRow.index].id)?.unrealized_pnl_quote ?? 0)) >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      ]">
                        ${{ ((strategyStatsMap.get(filteredStrategies[virtualRow.index].id)?.realized_pnl_quote ?? 0) + (strategyStatsMap.get(filteredStrategies[virtualRow.index].id)?.unrealized_pnl_quote ?? 0)).toFixed(2) }}
                      </p>
                    </div>
                    <div class="text-center p-2 rounded bg-gray-50 dark:bg-gray-800/50">
                      <p class="text-gray-500 dark:text-gray-400 mb-1">Orders</p>
                      <p class="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {{ strategyStatsMap.get(filteredStrategies[virtualRow.index].id)?.order_counts?.filled ?? 0 }}
                      </p>
                    </div>
                  </div>
                  <div v-else class="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                    <svg class="w-4 h-4 animate-spin inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Loading stats...
                  </div>
                </div>

                <!-- Bottom Section: Strategy Details -->
                <div class="flex items-center gap-6 text-sm mb-4">
                  <!-- Pair Badge -->
                  <div class="flex items-center px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 font-semibold border border-gray-200 dark:border-gray-600">
                    <svg class="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {{ filteredStrategies[virtualRow.index].base_currency }}/{{ filteredStrategies[virtualRow.index].quote_currency }}
                  </div>
                  
                  <!-- Amount -->
                  <div class="flex items-center text-gray-600 dark:text-gray-400" title="Investment Amount">
                    <svg class="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium">${{ filteredStrategies[virtualRow.index].amount_quote }}</span>
                  </div>

                  <!-- Interval -->
                  <div class="flex items-center text-gray-600 dark:text-gray-400" title="Execution Interval">
                    <svg class="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium">{{ filteredStrategies[virtualRow.index].interval }}</span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="grid grid-cols-4 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <!-- Run Now -->
                  <button
                    @click="runStrategyNow(filteredStrategies[virtualRow.index].id)"
                    :disabled="runningStrategyId === filteredStrategies[virtualRow.index].id"
                    class="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-sm font-medium transition-colors bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="runningStrategyId === filteredStrategies[virtualRow.index].id" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Run</span>
                  </button>

                  <!-- Edit -->
                  <router-link
                    :to="`/strategies/${filteredStrategies[virtualRow.index].id}/edit`"
                    class="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </router-link>

                  <!-- Pause/Resume -->
                  <button
                    v-if="filteredStrategies[virtualRow.index].enabled"
                    @click.stop="pauseStrategy(filteredStrategies[virtualRow.index].id)"
                    class="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-sm font-medium transition-colors bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Pause</span>
                  </button>
                  <button
                    v-else
                    @click.stop="resumeStrategy(filteredStrategies[virtualRow.index].id)"
                    class="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-sm font-medium transition-colors bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Resume</span>
                  </button>

                  <!-- Delete -->
                  <button
                    @click.stop="confirmDelete(filteredStrategies[virtualRow.index].id)"
                    class="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-sm font-medium transition-colors bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <ConfirmDialog
      v-if="showDeleteConfirm"
      :show="showDeleteConfirm"
      title="Delete Strategy"
      message="Are you sure you want to delete this strategy? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="deleteStrategy"
      @cancel="showDeleteConfirm = false; strategyToDelete = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStrategiesStore } from '@/stores/strategies'
import { statsApi } from '@/api/stats'
import type { StrategyStats } from '@/api/types'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import ErrorAlert from '@/components/Common/ErrorAlert.vue'
import ConfirmDialog from '@/components/Common/ConfirmDialog.vue'
import { useVirtualizer } from '@tanstack/vue-virtual'

const strategiesStore = useStrategiesStore()
const searchQuery = ref('')
const statusFilter = ref('')
const showDeleteConfirm = ref(false)
const strategyToDelete = ref<number | null>(null)
const runningStrategyId = ref<number | null>(null)
const successMessage = ref<string | null>(null)
const activeDropdown = ref<number | null>(null)
const strategyStatsMap = ref<Map<number, StrategyStats>>(new Map())

const parentRef = ref<HTMLElement | null>(null)

const filteredStrategies = computed(() => {
  let filtered = strategiesStore.strategies
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(query) ||
      `${s.base_currency}/${s.quote_currency}`.toLowerCase().includes(query) ||
      (s.enabled ? 'enabled' : 'disabled').includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(s => 
      statusFilter.value === 'enabled' ? s.enabled : !s.enabled
    )
  }
  
  return filtered
})

const rowVirtualizer = useVirtualizer(
  computed(() => ({
    count: filteredStrategies.value.length,
    getScrollElement: () => parentRef.value,
    estimateSize: () => 300, // Estimate of your item size
    overscan: 5,
  }))
)

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())

// Load stats for all strategies
const loadStrategyStats = async () => {
  const strategies = strategiesStore.strategies
  if (strategies.length === 0) {
    strategyStatsMap.value = new Map()
    return
  }

  try {
    const bulkStats = await statsApi.getStrategiesStats()
    const ids = new Set(strategies.map(strategy => strategy.id))
    const nextMap = new Map<number, StrategyStats>()
    bulkStats
      .filter(stat => ids.has(stat.strategy_id))
      .forEach(stat => {
        nextMap.set(stat.strategy_id, stat)
      })
    strategyStatsMap.value = nextMap
  } catch (error) {
    console.error('Failed to load strategy stats:', error)
    strategyStatsMap.value = new Map()
  }
}

const toggleDropdown = (strategyId: number) => {
  activeDropdown.value = activeDropdown.value === strategyId ? null : strategyId
}

const toggleStrategyStatus = async (id: number, currentStatus: boolean) => {
  try {
    if (currentStatus) {
      await pauseStrategy(id)
    } else {
      await resumeStrategy(id)
    }
  } catch (error) {
    // Error handled by store
  }
}

// Close dropdown when clicking outside
onMounted(async () => {
  await strategiesStore.fetchAll()
  await loadStrategyStats()
  
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.dropdown-container')) {
      activeDropdown.value = null
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

const confirmDelete = (id: number) => {
  strategyToDelete.value = id
  showDeleteConfirm.value = true
}

const deleteStrategy = async () => {
  if (strategyToDelete.value) {
    try {
      await strategiesStore.remove(strategyToDelete.value)
      showDeleteConfirm.value = false
      strategyToDelete.value = null
    } catch (error) {
      // Error handled by store
    }
  }
}

const runStrategyNow = async (id: number) => {
  runningStrategyId.value = id
  successMessage.value = null
  activeDropdown.value = null
  try {
    await strategiesStore.runNow(id)
    successMessage.value = 'Strategy triggered successfully!'
    // Refresh the strategies list and stats
    await Promise.all([
      strategiesStore.fetchAll(),
      loadStrategyStats()
    ])
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (error) {
    // Error handled by store
  } finally {
    runningStrategyId.value = null
  }
}

const pauseStrategy = async (id: number) => {
  activeDropdown.value = null
  try {
    await strategiesStore.pause(id)
  } catch (error) {
    // Error handled by store
  }
}

const resumeStrategy = async (id: number) => {
  activeDropdown.value = null
  try {
    await strategiesStore.resume(id)
  } catch (error) {
    // Error handled by store
  }
}
</script>

<style scoped>
/* No scoped styles needed after Tailwind migration */
</style>

