<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
    <div class="card w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-xl mb-4 shadow-lg">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <ErrorAlert v-if="authStore.error" :error="authStore.error" @dismiss="authStore.error = null" />
        
        <div>
          <label for="username" class="label">Username or Email</label>
          <div class="mt-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username or email"
              class="input pl-10"
              required
              :disabled="authStore.isLoading"
            />
          </div>
        </div>
        
        <div>
          <label for="password" class="label">Password</label>
          <div class="mt-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="input pl-10"
              required
              :disabled="authStore.isLoading"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          class="w-full btn-primary py-3 text-base" 
          :disabled="authStore.isLoading"
        >
          <span v-if="authStore.isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging in...
          </span>
          <span v-else>Login</span>
        </button>
        
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Need access? Contact an administrator to be provisioned.
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ErrorAlert from '@/components/Common/ErrorAlert.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const getSafeRedirect = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '/'
  }

  // Only allow same-origin relative paths
  if (value.startsWith('/') && !value.startsWith('//')) {
    return value
  }

  return '/'
}

const handleLogin = async () => {
  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    })
    
    // Navigate after login succeeds
    const redirect = getSafeRedirect(route.query.redirect)
    await router.push(redirect)
  } catch (error) {
    // Error handled by store - error message will be displayed
  }
}
</script>

