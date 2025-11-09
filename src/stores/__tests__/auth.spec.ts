import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { describe, it, expect, beforeEach } from 'vitest'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const store = useAuthStore()
    expect(store.accessToken).toBeNull()
    expect(store.refreshToken).toBeNull()
    expect(store.currentUser).toBeNull()
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.isUserLoaded).toBe(false)
  })

  it('should set tokens and update isAuthenticated', () => {
    const store = useAuthStore()
    store.setTokens('access', 'refresh')
    expect(store.accessToken).toBe('access')
    expect(store.refreshToken).toBe('refresh')
    expect(store.isAuthenticated).toBe(true)
  })

  it('should logout and reset the state', () => {
    const store = useAuthStore()
    store.setTokens('access', 'refresh')
    store.currentUser = { id: 1, username: 'test', email: 'test@test.com', is_active: true, is_superuser: false }
    
    store.logout()

    expect(store.accessToken).toBeNull()
    expect(store.refreshToken).toBeNull()
    expect(store.currentUser).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
