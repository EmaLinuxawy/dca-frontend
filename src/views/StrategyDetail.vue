<template>
  <div>
    <LoadingSpinner v-if="loading" />
    
    <ErrorAlert v-if="error && !loading" :error="error" />
    
    <div v-else-if="strategy">
      <!-- Pause Banner -->
      <div v-if="!strategy.enabled" class="card mb-6 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-amber-800 dark:text-amber-300 font-medium">
            This strategy is currently paused. No new orders will execute until re-enabled.
          </p>
        </div>
      </div>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{{ strategy.name }}</h1>
          <div class="flex items-center space-x-3">
            <StatusBadge :status="strategy.enabled ? 'enabled' : 'disabled'" />
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ strategy.base_currency }}/{{ strategy.quote_currency }}
            </span>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <!-- Primary Action: Run Now -->
          <button 
            @click="runNow" 
            :disabled="runningNow"
            class="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center gap-2"
          >
            <svg v-if="runningNow" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ runningNow ? 'Running...' : 'Run Now' }}</span>
          </button>
          
          <!-- Secondary Actions -->
          <button
            v-if="strategy.enabled"
            @click="pauseStrategy"
            class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Pause
          </button>
          <button
            v-else
            @click="resumeStrategy"
            class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Resume
          </button>
          
          <!-- Ghost Button: Edit -->
          <router-link 
            :to="`/strategies/${strategy.id}/edit`" 
            class="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Edit
          </router-link>
        </div>
      </div>
      
      <!-- Statistics - Grouped by Meaning (Most Important - Top) -->
      <div v-if="stats" class="card mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Statistics</h2>
        
        <!-- Performance Metrics Group -->
        <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Performance
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-4 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10 dark:to-transparent rounded-lg border border-green-200/50 dark:border-green-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">ROI</p>
              <div class="flex items-baseline space-x-2">
                <p :class="[
                  'text-2xl font-bold',
                  (stats.roi ?? 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                ]">
                  {{ ((stats.roi ?? 0) * 100).toFixed(2) }}%
                </p>
                <svg 
                  v-if="(stats.roi ?? 0) >= 0"
                  class="w-5 h-5 text-green-600 dark:text-green-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <svg 
                  v-else
                  class="w-5 h-5 text-red-600 dark:text-red-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            <div class="p-4 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent rounded-lg border border-blue-200/50 dark:border-blue-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Total P&L</p>
              <p :class="[
                'text-2xl font-bold',
                ((stats.realized_pnl_quote ?? 0) + (stats.unrealized_pnl_quote ?? 0)) >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              ]">
                ${{ ((stats.realized_pnl_quote ?? 0) + (stats.unrealized_pnl_quote ?? 0)).toFixed(2) }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Realized + Unrealized</p>
            </div>
            <div class="p-4 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/10 dark:to-transparent rounded-lg border border-purple-200/50 dark:border-purple-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Realized P&L</p>
              <p :class="[
                'text-xl font-bold',
                (stats.realized_pnl_quote ?? 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              ]">
                ${{ (stats.realized_pnl_quote ?? 0).toFixed(2) }}
              </p>
            </div>
            <div class="p-4 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent rounded-lg border border-indigo-200/50 dark:border-indigo-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Unrealized P&L</p>
              <p :class="[
                'text-xl font-bold',
                (stats.unrealized_pnl_quote ?? 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              ]">
                ${{ (stats.unrealized_pnl_quote ?? 0).toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Trading Activity Group -->
        <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Trading Activity
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Filled Orders</p>
              <p class="text-xl font-bold text-green-600 dark:text-green-400">{{ stats.order_counts?.filled ?? 0 }}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Failed Orders</p>
              <p class="text-xl font-bold text-red-600 dark:text-red-400">{{ stats.order_counts?.failed ?? 0 }}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Resting Orders</p>
              <p class="text-xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats.order_counts?.resting ?? 0 }}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Fees</p>
              <p class="text-xl font-semibold text-gray-900 dark:text-gray-100">${{ (stats.fees?.total_quote ?? 0).toFixed(2) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">All-time fees</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Invested</p>
              <p class="text-xl font-semibold text-gray-900 dark:text-gray-100">${{ (stats.invested_quote ?? 0).toFixed(2) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Capital deployed</p>
            </div>
          </div>
        </div>

        <!-- Position Group -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Position
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Position (Base)</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ (stats.position_base ?? 0).toFixed(6) }}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Position Value</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">${{ (stats.position_value_quote ?? 0).toFixed(2) }}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Average Buy Price</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">${{ (stats.avg_buy_price ?? 0).toFixed(4) }}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">${{ (stats.current_price ?? 0).toFixed(4) }}</p>
              <p class="text-xs mt-1" :class="[
                (stats.current_price ?? 0) >= (stats.avg_buy_price ?? 0) 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              ]">
                {{ ((stats.current_price ?? 0) >= (stats.avg_buy_price ?? 0) ? '+' : '') }}{{ (((stats.current_price ?? 0) - (stats.avg_buy_price ?? 0)) / (stats.avg_buy_price || 1) * 100).toFixed(2) }}% vs avg
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Strategy Information - Grouped -->
      <div class="card mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Strategy Information</h2>
        
        <!-- Core Configuration -->
        <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">Core Configuration</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Trading Pair</p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ strategy.base_currency }}/{{ strategy.quote_currency }}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Amount</p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">${{ strategy.amount_quote }}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Interval</p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ strategy.interval }}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Order Side</p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ strategy.order_side }}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Slippage</p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ strategy.slippage_bps }} BPS</p>
            </div>
          </div>
        </div>

        <!-- Limits & Constraints -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">Limits & Constraints</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Min Order</p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">${{ strategy.min_order_quote }}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Max Order</p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">${{ strategy.max_order_quote }}</p>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Max Daily Orders</p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ strategy.max_daily_orders }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Dip-Buy Settings -->
      <div v-if="strategy.dip_enabled" class="card mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dip-Buy Settings</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Threshold</p>
            <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ strategy.dip_threshold_bps }} BPS</p>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Amount Mode</p>
            <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ strategy.dip_amount_mode }}</p>
          </div>
          <div v-if="strategy.dip_amount_mode === 'multiplier'" class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Multiplier</p>
            <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ strategy.dip_amount_multiplier }}x</p>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Max Per Day</p>
            <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ strategy.dip_max_per_day }}</p>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 opacity-75">Cooldown</p>
            <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ strategy.dip_cooldown_seconds }}s</p>
          </div>
        </div>
      </div>
      
      <!-- Recent Orders -->
      <div class="card">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Orders</h2>
          <div class="flex items-center space-x-3">
            <!-- Page Size Selector -->
            <div class="flex items-center space-x-2">
              <label class="text-sm text-gray-600 dark:text-gray-400">Show:</label>
              <select 
                v-model="pageSize" 
                @change="currentPage = 1"
                class="input text-sm py-1.5 px-3 min-w-[80px]"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="0">All</option>
              </select>
            </div>
            <router-link 
              :to="`/orders?strategy_id=${strategy.id}`"
              class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              View All →
            </router-link>
          </div>
        </div>
        
        <div v-if="totalOrders === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>No orders yet</p>
        </div>
        
        <div v-else>
          <!-- Summary Row -->
          <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex flex-wrap items-center gap-4 text-sm">
            <span class="font-medium text-gray-700 dark:text-gray-300">
              {{ totalOrders }} {{ totalOrders === 1 ? 'Order' : 'Orders' }} total
            </span>
            <span class="text-gray-500 dark:text-gray-400">•</span>
            <span class="text-gray-600 dark:text-gray-400">
              {{ allOrders.filter(o => o.status === 'filled').length }} Filled
            </span>
            <span v-if="stats" class="text-gray-500 dark:text-gray-400">•</span>
            <span v-if="stats" class="text-gray-600 dark:text-gray-400">
              Avg Buy: ${{ (stats.avg_buy_price ?? 0).toFixed(4) }}
            </span>
            <span v-if="stats" class="text-gray-500 dark:text-gray-400">•</span>
            <span v-if="stats" class="text-gray-600 dark:text-gray-400">
              Fees: ${{ (stats.fees?.total_quote ?? 0).toFixed(2) }}
            </span>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Side</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr 
                  v-for="(order, index) in paginatedOrders" 
                  :key="order.id" 
                  @click="$router.push(`/orders/${order.id}`)" 
                  :class="[
                    'hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors',
                    index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'
                  ]"
                >
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{ order.id }}</td>
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
                  <td class="px-4 py-3 whitespace-nowrap text-sm">
                    <span :class="getOrderReasonBadgeClasses(order.reason)">
                      {{ formatOrderReason(order.reason) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm"><StatusBadge :status="order.status" /></td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ order.placed_at ? formatTableDate(order.placed_at) : '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination Controls -->
          <div v-if="pageSize > 0 && totalPages > 1" class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalOrders) }} of {{ totalOrders }} orders
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
    
    <div v-else-if="!error" class="card text-center py-12">
      <svg class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Strategy not found</p>
      <router-link to="/strategies" class="btn-primary">Back to Strategies</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStrategiesStore } from '@/stores/strategies'
import { statsApi } from '@/api/stats'
import { ordersApi } from '@/api/orders'
import type { StrategyStats, Order } from '@/api/types'
import { formatTableDate } from '@/utils/dateFormatter'
import { formatOrderReason, getOrderReasonBadgeClasses } from '@/utils/orderHelpers'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import StatusBadge from '@/components/Common/StatusBadge.vue'
import ErrorAlert from '@/components/Common/ErrorAlert.vue'

const route = useRoute()

const strategiesStore = useStrategiesStore()

const loading = ref(true)
const error = ref<string | null>(null)
const stats = ref<StrategyStats | null>(null)
const allOrders = ref<Order[]>([]) // Store all orders for pagination
const strategyId = ref<number | null>(null)
const runningNow = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)

// Use computed to make strategy reactive
const strategy = computed(() => strategiesStore.currentStrategy)

// Computed properties for pagination
const totalOrders = computed(() => allOrders.value.length)
const totalPages = computed(() => {
  if (pageSize.value === 0) return 1
  return Math.ceil(totalOrders.value / pageSize.value)
})

const paginatedOrders = computed(() => {
  if (pageSize.value === 0) return allOrders.value
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allOrders.value.slice(start, end)
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

onMounted(async () => {
  try {
    // Parse strategy ID from route
    const strategyIdParam = route.params.id
    if (!strategyIdParam || Array.isArray(strategyIdParam)) {
      error.value = 'Invalid strategy ID'
      loading.value = false
      return
    }
    
    const id = Number(strategyIdParam)
    if (isNaN(id)) {
      error.value = 'Strategy ID must be a number'
      loading.value = false
      return
    }
    
    strategyId.value = id
    
    // Clear any previous strategy and error
    strategiesStore.currentStrategy = null
    error.value = null
    
    await strategiesStore.fetchById(id)
    
    // Check if strategy was actually loaded
    if (!strategiesStore.currentStrategy) {
      error.value = 'Strategy not found'
      return
    }
    
    await loadStats()
    await loadOrders()
  } catch (err: any) {
    console.error('Failed to load strategy:', err)
    error.value = err.response?.data?.detail || err.message || 'Failed to load strategy'
    strategiesStore.currentStrategy = null
  } finally {
    loading.value = false
  }
})

const loadStats = async () => {
  if (!strategyId.value) return
  try {
    const allStats = await statsApi.getStrategiesStats()
    const strategyStats = allStats.find(stat => stat.strategy_id === strategyId.value)
    if (!strategyStats) {
      console.warn(`No stats returned for strategy ${strategyId.value}`)
      stats.value = null
      return
    }
    stats.value = strategyStats
  } catch (error) {
    console.error('Failed to load stats:', error)
    stats.value = null
  }
}

const loadOrders = async () => {
  if (!strategyId.value) return
  try {
    // Load all orders for this strategy (we'll paginate client-side)
    allOrders.value = await ordersApi.getAll({ strategy_id: strategyId.value })
    // Sort by placed_at descending (most recent first)
    allOrders.value.sort((a, b) => {
      if (!a.placed_at || !b.placed_at) return 0
      return new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime()
    })
    
    // Reset to page 1 if we're beyond available pages
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = 1
    }
  } catch (error) {
    console.error('Failed to load orders:', error)
  }
}

const pauseStrategy = async () => {
  if (!strategyId.value) return
  try {
    await strategiesStore.pause(strategyId.value)
    await strategiesStore.fetchById(strategyId.value) // Refresh strategy after pause
  } catch (error) {
    // Error handled by store
  }
}

const resumeStrategy = async () => {
  if (!strategyId.value) return
  try {
    await strategiesStore.resume(strategyId.value)
    await strategiesStore.fetchById(strategyId.value) // Refresh strategy after resume
  } catch (error) {
    // Error handled by store
  }
}

const runNow = async () => {
  if (!strategyId.value) return
  runningNow.value = true
  try {
    await strategiesStore.runNow(strategyId.value)
    await Promise.all([
      loadStats(),
      loadOrders()
    ])
  } catch (error) {
    // Error handled by store
  } finally {
    runningNow.value = false
  }
}
</script>


