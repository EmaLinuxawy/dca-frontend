import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { UserResponse, UserLogin, UserCreate } from '@/api/types'

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
        error.value = err.response?.data?.detail || 'Login failed'
        logout() // Clear state on login failure
        throw err
      } finally {
        isLoading.value = false
      }
    }

    const register = async (userData: UserCreate) => {
      isLoading.value = true
      error.value = null
      try {
        const user = await authApi.register(userData)
        // Auto-login after registration
        await login({ username: userData.username, password: userData.password })
        return user
      } catch (err: any) {
        error.value = err.response?.data?.detail || 'Registration failed'
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
      register,
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

