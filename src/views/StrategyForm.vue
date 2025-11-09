<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {{ mode === 'create' ? 'Create Strategy' : 'Edit Strategy' }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ mode === 'create' ? 'Set up a new DCA trading strategy' : 'Update your strategy settings' }}
      </p>
    </div>
    
    <LoadingSpinner v-if="loading" />
    
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <ErrorAlert v-if="error" :error="error" @dismiss="error = null" />
      
      <!-- Step Indicators -->
      <div class="flex items-center justify-center mb-8">
        <div class="flex items-center space-x-2">
          <!-- Step 1 -->
          <div class="flex items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors',
              'bg-primary-600 dark:bg-primary-500 text-white'
            ]">
              1
            </div>
            <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Basic Info</span>
          </div>
          
          <div class="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
          
          <!-- Step 2 -->
          <div class="flex items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors',
              'bg-primary-600 dark:bg-primary-500 text-white'
            ]">
              2
            </div>
            <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Order Settings</span>
          </div>
          
          <div class="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
          
          <!-- Step 3 -->
          <div class="flex items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors',
              formData.dip_enabled 
                ? 'bg-primary-600 dark:bg-primary-500 text-white' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
            ]">
              3
            </div>
            <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Dip-Buy (Optional)</span>
          </div>
        </div>
      </div>
      
      <!-- Basic Information -->
      <div class="bg-white dark:bg-[#232436] rounded-xl shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 transition-all duration-200">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Basic Information</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Define your trading pair, side, and investment interval.</p>
        </div>
        
        <div class="space-y-5">
          <div>
            <label class="flex items-center space-x-2 mb-1.5">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Strategy Name</span>
              <span class="text-red-500">*</span>
              <div class="relative group">
                <svg class="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  A unique name to identify this strategy
                </div>
              </div>
            </label>
            <input 
              v-model="formData.name" 
              type="text" 
              class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors" 
              required 
              placeholder="My DCA Strategy"
              :class="{ 'border-red-500 dark:border-red-500': formData.name.trim() === '' && formData.name !== '' }"
            />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="flex items-center space-x-2 mb-1.5">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Base Currency</span>
                <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formData.base_currency" 
                type="text" 
                class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors uppercase" 
                required 
                placeholder="ETH"
                :class="{ 'border-red-500 dark:border-red-500': formData.base_currency.trim() === '' && formData.base_currency !== '' }"
              />
            </div>
            <div>
              <label class="flex items-center space-x-2 mb-1.5">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Quote Currency</span>
                <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formData.quote_currency" 
                type="text" 
                class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors uppercase" 
                required 
                placeholder="USDC"
                :class="{ 'border-red-500 dark:border-red-500': formData.quote_currency.trim() === '' && formData.quote_currency !== '' }"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="flex items-center space-x-2 mb-1.5">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Investment Amount (Quote Currency)</span>
                <span class="text-red-500">*</span>
                <div class="relative group">
                  <svg class="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 p-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    Amount to invest per interval execution
                  </div>
                </div>
              </label>
              <input 
                v-model.number="formData.amount_quote" 
                type="number" 
                step="0.01" 
                min="0.01" 
                class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors" 
                required
                :class="{ 'border-red-500 dark:border-red-500': formData.amount_quote <= 0 }"
              />
            </div>
            <div>
              <label class="flex items-center space-x-2 mb-1.5">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Execution Interval</span>
                <span class="text-red-500">*</span>
                <div class="relative group">
                  <svg class="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    Format: number + unit (h=hours, m=minutes, d=days, w=weeks)<br>
                    Examples: 1h, 4h, 1d, 1w
                  </div>
                </div>
              </label>
              <input 
                v-model="formData.interval" 
                type="text" 
                class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors" 
                required 
                placeholder="1d"
                :class="{ 
                  'border-red-500 dark:border-red-500': !intervalValid && formData.interval !== '',
                  'border-green-500 dark:border-green-500': intervalValid && formData.interval !== ''
                }"
              />
              <p v-if="!intervalValid && formData.interval !== ''" class="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Use format like 1h, 4h, 1d, 1w</span>
              </p>
              <p v-else-if="intervalValid && formData.interval !== ''" class="mt-1.5 text-sm text-green-600 dark:text-green-400 flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Valid interval format</span>
              </p>
            </div>
          </div>
          
          <div>
            <label class="flex items-center space-x-2 mb-1.5">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Order Side</span>
              <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="formData.order_side" 
              class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors" 
              required
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Order Settings -->
      <div class="bg-white dark:bg-[#232436] rounded-xl shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 transition-all duration-200">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Order Settings</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Control limits, slippage, and execution cadence.</p>
        </div>
        
        <div class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="flex items-center space-x-2 mb-1.5">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Max Slippage (BPS)</span>
                <span class="text-red-500">*</span>
                <div class="relative group">
                  <svg class="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 p-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    Allowed price deviation per order (basis points). 1 BPS = 0.01%
                  </div>
                </div>
              </label>
              <input 
                v-model.number="formData.slippage_bps" 
                type="number" 
                min="0" 
                max="1000" 
                class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors" 
                required
                :class="{ 'border-red-500 dark:border-red-500': formData.slippage_bps < 0 || formData.slippage_bps > 1000 }"
              />
            </div>
            <div>
              <label class="flex items-center space-x-2 mb-1.5">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Max Daily Orders</span>
                <span class="text-red-500">*</span>
              </label>
              <input 
                v-model.number="formData.max_daily_orders" 
                type="number" 
                min="1" 
                class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors" 
                required
                :class="{ 'border-red-500 dark:border-red-500': formData.max_daily_orders < 1 }"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="flex items-center space-x-2 mb-1.5">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Min Order Quote</span>
                <span class="text-red-500">*</span>
              </label>
              <input 
                v-model.number="formData.min_order_quote" 
                type="number" 
                step="0.01" 
                class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors" 
                required
                :class="{ 'border-red-500 dark:border-red-500': formData.min_order_quote <= 0 || formData.min_order_quote > formData.max_order_quote }"
              />
            </div>
            <div>
              <label class="flex items-center space-x-2 mb-1.5">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Max Order Quote</span>
                <span class="text-red-500">*</span>
              </label>
              <input 
                v-model.number="formData.max_order_quote" 
                type="number" 
                step="0.01" 
                class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors" 
                required
                :class="{ 'border-red-500 dark:border-red-500': formData.max_order_quote <= 0 || formData.min_order_quote > formData.max_order_quote }"
              />
            </div>
          </div>
          <p v-if="formData.min_order_quote > formData.max_order_quote" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Min order must be less than or equal to max order</span>
          </p>
        </div>
      </div>
      
      <!-- Dip-Buy Settings -->
      <div class="bg-white dark:bg-[#232436] rounded-xl shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 transition-all duration-200">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Dip-Buy Settings</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Enable automatic buys on price drops.</p>
        </div>
        
        <div class="space-y-5">
          <div class="flex items-center">
            <input 
              v-model="formData.dip_enabled" 
              type="checkbox" 
              class="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
            />
            <label class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">Enable Dip-Buy</label>
          </div>
          
          <div 
            v-if="formData.dip_enabled" 
            class="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-5 border border-gray-200 dark:border-gray-700 transition-all duration-300"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="flex items-center space-x-2 mb-1.5">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Price Drop Threshold (BPS)</span>
                  <div class="relative group">
                    <svg class="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 p-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      Price drop percentage to trigger a dip buy (basis points)
                    </div>
                  </div>
                </label>
                <input 
                  v-model.number="formData.dip_threshold_bps" 
                  type="number" 
                  min="0" 
                  class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors" 
                />
              </div>
              <div>
                <label class="flex items-center space-x-2 mb-1.5">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Dip Order Amount Mode</span>
                </label>
                <select 
                  v-model="formData.dip_amount_mode" 
                  class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors"
                >
                  <option value="same">Same as regular order</option>
                  <option value="multiplier">Multiplier</option>
                </select>
              </div>
            </div>
            
            <div v-if="formData.dip_amount_mode === 'multiplier'">
              <label class="flex items-center space-x-2 mb-1.5">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Dip Amount Multiplier</span>
              </label>
              <input 
                v-model.number="formData.dip_amount_multiplier" 
                type="number" 
                step="0.1" 
                min="0" 
                class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors" 
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="flex items-center space-x-2 mb-1.5">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Dip Max Per Day</span>
                </label>
                <input 
                  v-model.number="formData.dip_max_per_day" 
                  type="number" 
                  min="0" 
                  class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors" 
                />
              </div>
              <div>
                <label class="flex items-center space-x-2 mb-1.5">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cooldown Between Dip Orders (s)</span>
                  <div class="relative group">
                    <svg class="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 p-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      Minimum seconds between dip-triggered orders
                    </div>
                  </div>
                </label>
                <input 
                  v-model.number="formData.dip_cooldown_seconds" 
                  type="number" 
                  min="0" 
                  class="input focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Enable Strategy -->
      <div class="bg-white dark:bg-[#232436] rounded-xl shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 transition-all duration-200">
        <div class="flex items-center">
          <input 
            v-model="formData.enabled" 
            type="checkbox" 
            class="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
          />
          <label class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">Enable Strategy</label>
        </div>
      </div>
      
      <!-- Summary Preview -->
      <div v-if="formValid" class="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-200 dark:border-primary-800 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
          <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Strategy Summary</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600 dark:text-gray-400">Pair:</span>
            <span class="ml-2 font-semibold text-gray-900 dark:text-gray-100">{{ formData.base_currency }}/{{ formData.quote_currency }}</span>
            <span class="ml-2 text-gray-500 dark:text-gray-400">•</span>
            <span class="ml-2 text-gray-600 dark:text-gray-400">Side:</span>
            <span class="ml-2 font-semibold text-gray-900 dark:text-gray-100">{{ formData.order_side }}</span>
            <span class="ml-2 text-gray-500 dark:text-gray-400">•</span>
            <span class="ml-2 text-gray-600 dark:text-gray-400">Interval:</span>
            <span class="ml-2 font-semibold text-gray-900 dark:text-gray-100">{{ formData.interval }}</span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-400">Max Orders:</span>
            <span class="ml-2 font-semibold text-gray-900 dark:text-gray-100">{{ formData.max_daily_orders }}/day</span>
            <span class="ml-2 text-gray-500 dark:text-gray-400">•</span>
            <span class="ml-2 text-gray-600 dark:text-gray-400">Range:</span>
            <span class="ml-2 font-semibold text-gray-900 dark:text-gray-100">${{ formData.min_order_quote }} - ${{ formData.max_order_quote }}</span>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-primary-200 dark:border-primary-800">
          <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Estimated Daily Spend: ${{ estimatedDailySpend.toFixed(2) }}
          </span>
        </div>
      </div>
      
      <!-- Form Actions -->
      <div class="flex gap-4">
        <button 
          type="submit" 
          class="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          :disabled="strategiesStore.isLoading || !formValid"
        >
          <svg v-if="strategiesStore.isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ strategiesStore.isLoading ? 'Creating...' : (mode === 'create' ? 'Create Strategy' : 'Update Strategy') }}</span>
        </button>
        <router-link 
          to="/strategies" 
          class="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 inline-flex items-center"
        >
          Cancel
        </router-link>
      </div>
    </form>
    
    <!-- Success Toast -->
    <div 
      v-if="showSuccessToast" 
      class="fixed bottom-8 right-8 bg-green-600 dark:bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center space-x-3 z-50 animate-fade-in"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <div>
        <p class="font-semibold">Strategy created successfully!</p>
        <button 
          @click="router.push('/strategies')" 
          class="text-sm underline mt-1 hover:text-green-200"
        >
          View Strategy
        </button>
      </div>
      <button @click="showSuccessToast = false" class="ml-4 hover:text-green-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, defineProps } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStrategiesStore } from '@/stores/strategies'
import type { StrategyCreate } from '@/api/types'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import ErrorAlert from '@/components/Common/ErrorAlert.vue'

// Define props
const props = defineProps<{
  mode: 'create' | 'edit'
}>()

const route = useRoute()
const router = useRouter()
const strategiesStore = useStrategiesStore()

const mode = props.mode
const loading = ref(mode === 'edit')
const error = ref<string | null>(null)
const showSuccessToast = ref(false)

const formData = reactive<StrategyCreate>({
  name: '',
  base_currency: '',
  quote_currency: 'USDC',
  amount_quote: 100,
  interval: '1d',
  slippage_bps: 50,
  min_order_quote: 10,
  max_order_quote: 1000,
  max_daily_orders: 1,
  order_side: 'BUY',
  enabled: true,
  dip_enabled: false,
  dip_threshold_bps: 500,
  dip_amount_mode: 'same',
  dip_amount_multiplier: 1.0,
  dip_max_per_day: 2,
  dip_cooldown_seconds: 900,
})

const intervalValid = computed(() => {
  const pattern = /^\d+[hmdw]$/
  return pattern.test(formData.interval)
})

const formValid = computed(() => {
  return intervalValid.value &&
         formData.name.trim() !== '' &&
         formData.base_currency.trim() !== '' &&
         formData.quote_currency.trim() !== '' &&
         formData.amount_quote > 0 &&
         formData.slippage_bps >= 0 && formData.slippage_bps <= 1000 &&
         formData.min_order_quote > 0 &&
         formData.max_order_quote > 0 &&
         formData.min_order_quote <= formData.max_order_quote &&
         formData.max_daily_orders >= 1
})

const estimatedDailySpend = computed(() => {
  // Calculate based on interval and max daily orders
  const intervalHours = parseInterval(formData.interval)
  if (!intervalHours) return 0
  
  const ordersPerDay = Math.min(formData.max_daily_orders, 24 / intervalHours)
  return ordersPerDay * formData.amount_quote
})

const parseInterval = (interval: string): number | null => {
  const match = interval.match(/^(\d+)([hmdw])$/)
  if (!match) return null
  
  const value = parseInt(match[1])
  const unit = match[2]
  
  switch (unit) {
    case 'h': return value
    case 'm': return value / 60
    case 'd': return value * 24
    case 'w': return value * 24 * 7
    default: return null
  }
}

onMounted(async () => {
  if (mode === 'edit') {
    const strategyId = Number(route.params.id)
    try {
      const strategy = await strategiesStore.fetchById(strategyId)
      if (strategy) {
        Object.assign(formData, strategy)
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load strategy'
    } finally {
      loading.value = false
    }
  }
})

const handleSubmit = async () => {
  error.value = null
  if (!formValid.value) {
    error.value = 'Please correct the form errors.'
    return
  }
  try {
    if (mode === 'create') {
      await strategiesStore.create(formData)
      // Redirect immediately to strategies list
      router.push('/strategies')
    } else {
      const strategyId = Number(route.params.id)
      await strategiesStore.update(strategyId, formData)
      router.push(`/strategies/${strategyId}`)
    }
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to save strategy'
    showSuccessToast.value = false
  }
}
</script>
