import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/components/Layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: 'strategies',
        name: 'StrategiesList',
        component: () => import('@/views/StrategiesList.vue'),
      },
      {
        path: 'strategies/new',
        name: 'StrategyCreate',
        component: () => import('@/views/StrategyForm.vue'),
        props: { mode: 'create' },
      },
      {
        path: 'strategies/:id',
        name: 'StrategyDetail',
        component: () => import('@/views/StrategyDetail.vue'),
        props: true,
      },
      {
        path: 'strategies/:id/edit',
        name: 'StrategyEdit',
        component: () => import('@/views/StrategyForm.vue'),
        props: { mode: 'edit' },
      },
      {
        path: 'orders',
        name: 'OrdersList',
        component: () => import('@/views/OrdersList.vue'),
      },
      {
        path: 'orders/:id',
        name: 'OrderDetail',
        component: () => import('@/views/OrderDetail.vue'),
        props: true,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  const isSafeRedirect = (value: unknown): string | null => {
    if (typeof value !== 'string') {
      return null
    }
    if (value.startsWith('/') && !value.startsWith('//')) {
      return value
    }
    return null
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    // Not authenticated, redirect to login
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (!requiresAuth && authStore.isAuthenticated) {
    // Authenticated user trying to access login, redirect to dashboard
    if (to.name === 'Login') {
      next({ name: 'Dashboard' })
    } else {
      next()
    }
  } else if (requiresAuth && authStore.isAuthenticated) {
    // Authenticated, but user data might not be loaded yet
    if (!authStore.isUserLoaded) {
      try {
        await authStore.fetchUser()
        next()
      } catch (error) {
        // Token is likely invalid if fetching user fails
        authStore.logout()
        const safeRedirect = isSafeRedirect(to.fullPath)
        next({ name: 'Login', query: safeRedirect ? { redirect: safeRedirect } : undefined })
      }
    } else {
      // Authenticated and user data is loaded
      next()
    }
  } else {
    // Public route, not authenticated
    next()
  }
})

export default router

