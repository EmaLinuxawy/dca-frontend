import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { UserResponse, UserLogin } from '@/api/types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const currentUser = ref<UserResponse | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => !!accessToken.value)
    const isUserLoaded = computed(() => !!currentUser.value)

    const setTokens = (access: string, refresh: string) => {
      accessToken.value = access
      refreshToken.value = refresh
    }

    const login = async (credentials: UserLogin) => {
      isLoading.value = true
      error.value = null
      try {
        const tokenData = await authApi.login(credentials)
        setTokens(tokenData.access_token, tokenData.refresh_token)
        await fetchUser()
        return tokenData
      } catch (err: any) {
        console.error('Login failed:', err)
        
        // Extract error message from various error formats
        let errorMessage = 'Login failed. Please check your credentials.'
        
        if (err.response) {
          // HTTP error response
          const data = err.response.data
          if (data?.detail) {
            // FastAPI error format
            errorMessage = typeof data.detail === 'string' ? data.detail : data.detail.message || errorMessage
          } else if (data?.message) {
            errorMessage = data.message
          } else if (err.response.status === 401) {
            errorMessage = 'Invalid username or password'
          } else if (err.response.status === 400) {
            errorMessage = 'Invalid request. Please check your credentials.'
          }
        } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          errorMessage = 'Request timed out. Please check your connection and try again.'
        } else if (err.message) {
          errorMessage = err.message
        }
        
        error.value = errorMessage
        // Clear tokens on login failure but keep error message visible
        accessToken.value = null
        refreshToken.value = null
        currentUser.value = null
        throw err
      } finally {
        isLoading.value = false
      }
    }


    const fetchUser = async () => {
      if (!accessToken.value) return
      try {
        currentUser.value = await authApi.getCurrentUser()
        return currentUser.value
      } catch (err) {
        console.error('Failed to fetch user:', err)
        // The API client interceptor will handle 401s and trigger a logout if needed.
        throw err
      }
    }

    const logout = () => {
      accessToken.value = null
      refreshToken.value = null
      currentUser.value = null
      error.value = null
    }

    const setRefreshedToken = (newAccessToken: string) => {
      accessToken.value = newAccessToken
    }

    return {
      accessToken,
      refreshToken,
      currentUser,
      isLoading,
      error,
      isAuthenticated,
      isUserLoaded,
      login,
      fetchUser,
      logout,
      setTokens,
      setRefreshedToken,
    }
  },
  {
    persist: {
      key: 'auth-store',
      storage: localStorage,
      // Only persist tokens. User data should be fetched on app load.
      paths: ['accessToken', 'refreshToken'],
    },
  }
)

