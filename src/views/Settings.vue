<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
    </div>
    
    <!-- Account Information -->
    <div class="bg-white dark:bg-[#232436] rounded-xl shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-6 transition-all duration-200">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Account Information</h2>
        <button
          @click="refreshUserInfo"
          :disabled="isRefreshing"
          class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh user information"
        >
          <svg 
            :class="['w-4 h-4', isRefreshing ? 'animate-spin' : '']" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="hidden sm:inline">{{ isRefreshing ? 'Refreshing...' : 'Refresh' }}</span>
        </button>
      </div>
      
      <LoadingSpinner v-if="isRefreshing && !authStore.currentUser" />
      
      <div v-else-if="authStore.currentUser" class="space-y-6">
        <!-- User Identity Card - Large Avatar with Gradient -->
        <div class="relative p-6 rounded-xl overflow-hidden" style="background: linear-gradient(145deg, #1E1F29 0%, #2C2D3A 100%);">
          <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <!-- Large Avatar -->
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-xl ring-4 ring-primary-500/20">
              {{ authStore.currentUser.username.charAt(0).toUpperCase() }}
            </div>
            
            <!-- User Info -->
            <div class="flex-1 text-center sm:text-left">
              <div class="flex items-center justify-center sm:justify-start space-x-3 mb-2">
                <h3 class="text-2xl sm:text-3xl font-bold text-white">{{ authStore.currentUser.username }}</h3>
              </div>
              <p class="text-base text-gray-300 dark:text-gray-400 mb-3">{{ authStore.currentUser.email }}</p>
              
              <!-- Role & Status -->
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-200 border border-primary-400/30">
                  <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {{ authStore.currentUser.is_superuser ? 'Administrator' : 'Standard User' }}
                </span>
                <StatusBadge :status="authStore.currentUser.is_active ? 'enabled' : 'disabled'" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="mb-4">Unable to load user information</p>
        <button @click="refreshUserInfo" class="btn-secondary">Try Again</button>
      </div>
    </div>
    
    <!-- Change Password -->
    <div class="bg-white dark:bg-[#232436] rounded-xl shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-6 transition-all duration-200">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Change Password</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Update your account password to keep it secure</p>
      </div>
      
      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-fade-in">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-green-800 dark:text-green-200 font-medium">{{ successMessage }}</p>
          </div>
          <button @click="successMessage = null" class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-800 dark:text-red-200 font-medium">{{ errorMessage }}</p>
          </div>
          <button @click="errorMessage = null" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <form @submit.prevent="handleChangePassword" class="space-y-5">
        <!-- Current Password -->
        <div>
          <label class="label">Current Password</label>
          <div class="relative">
            <input
              v-model="passwordForm.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              required
              class="input pr-10 focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A] transition-colors"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              :class="[
                'absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors',
                showCurrentPassword ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              ]"
              :title="showCurrentPassword ? 'Hide password' : 'Show password'"
            >
              <svg v-if="showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- New Password -->
        <div>
          <label class="label">New Password</label>
          <div class="relative">
            <input
              v-model="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              required
              minlength="8"
              :class="[
                'input pr-10 transition-colors',
                passwordForm.newPassword ? (
                  passwordStrength.score >= 2 
                    ? 'border-green-500 dark:border-green-500 focus:ring-green-500' 
                    : passwordStrength.score === 1
                    ? 'border-yellow-500 dark:border-yellow-500 focus:ring-yellow-500'
                    : 'border-red-500 dark:border-red-500 focus:ring-red-500'
                ) : '',
                'focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A]'
              ]"
              placeholder="Enter your new password"
              @input="validatePassword"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              :class="[
                'absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors',
                showNewPassword ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              ]"
              :title="showNewPassword ? 'Hide password' : 'Show password'"
            >
              <svg v-if="showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          <!-- Password Strength Indicator -->
          <div v-if="passwordForm.newPassword" class="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-2 mb-3">
              <div class="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  :class="[
                    'h-full transition-all duration-300',
                    passwordStrength.score === 0 ? 'bg-red-500' : '',
                    passwordStrength.score === 1 ? 'bg-orange-500' : '',
                    passwordStrength.score === 2 ? 'bg-yellow-500' : '',
                    passwordStrength.score === 3 ? 'bg-green-500' : '',
                  ]"
                  :style="{ width: `${(passwordStrength.score + 1) * 25}%` }"
                ></div>
              </div>
              <div class="flex items-center space-x-1">
                <svg 
                  v-if="passwordStrength.score >= 2"
                  class="w-4 h-4 text-green-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-xs font-semibold" :class="[
                  passwordStrength.score === 0 ? 'text-red-600 dark:text-red-400' : '',
                  passwordStrength.score === 1 ? 'text-orange-600 dark:text-orange-400' : '',
                  passwordStrength.score === 2 ? 'text-yellow-600 dark:text-yellow-400' : '',
                  passwordStrength.score === 3 ? 'text-green-600 dark:text-green-400' : '',
                ]">
                  {{ passwordStrength.label }}
                </span>
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Must include uppercase, number, symbol</p>
            <ul class="text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
              <li class="flex items-center space-x-2">
                <svg :class="['w-4 h-4', passwordForm.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>At least 8 characters</span>
              </li>
              <li class="flex items-center space-x-2">
                <svg :class="['w-4 h-4', passwordStrength.hasUpper && passwordStrength.hasLower ? 'text-green-500' : 'text-gray-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Uppercase and lowercase letters</span>
              </li>
              <li class="flex items-center space-x-2">
                <svg :class="['w-4 h-4', passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>At least one number</span>
              </li>
              <li class="flex items-center space-x-2">
                <svg :class="['w-4 h-4', passwordStrength.hasSpecial ? 'text-green-500' : 'text-gray-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>At least one special character</span>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Confirm New Password -->
        <div>
          <label class="label">Confirm New Password</label>
          <div class="relative">
            <input
              v-model="passwordForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              :class="[
                'input pr-10 transition-colors',
                passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword 
                  ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                  : passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword
                  ? 'border-green-500 dark:border-green-500 focus:ring-green-500'
                  : '',
                'focus:bg-[#1E1F29] dark:focus:bg-[#1E1F29] hover:bg-gray-50 dark:hover:bg-[#2A2B3A]'
              ]"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              :class="[
                'absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors',
                showConfirmPassword ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              ]"
              :title="showConfirmPassword ? 'Hide password' : 'Show password'"
            >
              <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          <p v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Passwords do not match</span>
          </p>
          <p v-else-if="passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword" class="mt-1.5 text-sm text-green-600 dark:text-green-400 flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Passwords match</span>
          </p>
        </div>
        
        <div class="flex items-center space-x-3 pt-4">
          <button
            type="submit"
            :disabled="isChangingPassword || !isFormValid"
            class="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isChangingPassword" class="w-4 h-4 animate-spin inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ isChangingPassword ? 'Changing Password...' : 'Change Password' }}</span>
          </button>
          <button
            type="button"
            @click="resetPasswordForm"
            class="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Cancel
          </button>
        </div>
        
        <!-- Helpful Hint -->
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center space-x-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Tip: Use a strong, unique password and never share it with anyone.</span>
        </p>
      </form>
    </div>
    
    <!-- Account Actions - Bottom Right -->
    <div class="flex justify-end">
      <button 
        @click="showLogoutConfirm = true" 
        class="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
    
    <!-- Logout Confirmation Dialog -->
    <ConfirmDialog
      v-if="showLogoutConfirm"
      :show="showLogoutConfirm"
      title="Confirm Logout"
      message="Are you sure you want to logout? You will need to login again to access your account."
      confirm-text="Logout"
      cancel-text="Cancel"
      @confirm="handleLogout"
      @cancel="showLogoutConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import StatusBadge from '@/components/Common/StatusBadge.vue'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import ConfirmDialog from '@/components/Common/ConfirmDialog.vue'

const router = useRouter()
const authStore = useAuthStore()

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isChangingPassword = ref(false)
const isRefreshing = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const showLogoutConfirm = ref(false)
let successMessageTimeout: ReturnType<typeof setTimeout> | null = null

// Password strength calculation
const passwordStrength = computed(() => {
  const password = passwordForm.value.newPassword
  if (!password) {
    return { score: -1, label: '', checks: 0, hasUpper: false, hasLower: false, hasNumber: false, hasSpecial: false }
  }
  
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const checks = [hasUpper, hasLower, hasNumber, hasSpecial, password.length >= 8].filter(Boolean).length
  
  let score = 0
  let label = 'Weak'
  
  if (checks <= 2) {
    score = 0
    label = 'Weak'
  } else if (checks === 3) {
    score = 1
    label = 'Fair'
  } else if (checks === 4) {
    score = 2
    label = 'Good'
  } else {
    score = 3
    label = 'Strong'
  }
  
  return { score, label, checks, hasUpper, hasLower, hasNumber, hasSpecial }
})

// Form validation
const isFormValid = computed(() => {
  return (
    passwordForm.value.currentPassword &&
    passwordForm.value.newPassword &&
    passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword.length >= 8 &&
    passwordForm.value.currentPassword !== passwordForm.value.newPassword
  )
})

const validatePassword = () => {
  // Clear error if password is being changed
  if (errorMessage.value) {
    errorMessage.value = null
  }
}

const handleChangePassword = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Please fill in all fields correctly'
    return
  }
  
  if (passwordForm.value.currentPassword === passwordForm.value.newPassword) {
    errorMessage.value = 'New password must be different from current password'
    return
  }
  
  isChangingPassword.value = true
  successMessage.value = null
  errorMessage.value = null
  
  // Clear any existing timeout
  if (successMessageTimeout) {
    clearTimeout(successMessageTimeout)
    successMessageTimeout = null
  }
  
  try {
    await authApi.changePassword({
      current_password: passwordForm.value.currentPassword,
      new_password: passwordForm.value.newPassword,
    })
    
    successMessage.value = 'Password changed successfully!'
    resetPasswordForm()
    
    // Auto-dismiss success message after 5 seconds
    successMessageTimeout = setTimeout(() => {
      successMessage.value = null
    }, 5000)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.detail || 'Failed to change password. Please check your current password and try again.'
  } finally {
    isChangingPassword.value = false
  }
}

const refreshUserInfo = async () => {
  isRefreshing.value = true
  try {
    await authStore.fetchUser()
  } catch (error) {
    console.error('Failed to refresh user info:', error)
  } finally {
    isRefreshing.value = false
  }
}

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
  errorMessage.value = null
}

const handleLogout = () => {
  showLogoutConfirm.value = false
  authStore.logout()
  router.push('/login')
}

// Cleanup on unmount
onUnmounted(() => {
  if (successMessageTimeout) {
    clearTimeout(successMessageTimeout)
  }
})

// Fetch user info on mount if not already loaded
onMounted(async () => {
  if (!authStore.currentUser && authStore.accessToken) {
    await refreshUserInfo()
  }
})
</script>

