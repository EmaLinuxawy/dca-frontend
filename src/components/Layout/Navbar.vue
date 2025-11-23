<template>
  <nav class="glass sticky top-0 z-40 transition-all duration-200">
    <div class="container mx-auto flex justify-between items-center py-3 px-4 md:px-6 lg:px-8">
      <!-- Left: Logo -->
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">DCA Trading Dashboard</h1>
      </div>

      <!-- Center: Navigation Links -->
      <nav class="hidden md:flex items-center space-x-1 lg:space-x-2">
        <router-link 
          to="/" 
          :class="[
            'flex items-center space-x-2 py-2 px-3 lg:px-4 text-sm font-medium rounded-full transition-all duration-200 relative',
            $route.path === '/' 
              ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </router-link>
        <router-link 
          to="/strategies" 
          class="flex items-center space-x-2 py-2 px-3 lg:px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-full transition-all duration-200 relative"
          active-class="bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold shadow-[0_0_10px_rgba(59,130,246,0.2)]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Strategies</span>
        </router-link>
        <router-link 
          to="/orders" 
          class="flex items-center space-x-2 py-2 px-3 lg:px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-full transition-all duration-200 relative"
          active-class="bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold shadow-[0_0_10px_rgba(59,130,246,0.2)]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Orders</span>
        </router-link>
        <router-link 
          to="/settings" 
          class="flex items-center space-x-2 py-2 px-3 lg:px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-full transition-all duration-200 relative"
          active-class="bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold shadow-[0_0_10px_rgba(59,130,246,0.2)]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </router-link>
      </nav>

      <!-- Mobile Navigation Menu Button -->
      <div class="md:hidden">
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Right: User Menu & Logout -->
      <div class="hidden md:flex items-center space-x-3 md:space-x-4">
        <div v-if="authStore.currentUser" class="relative user-menu-container">
          <button
            @click="userMenuOpen = !userMenuOpen"
            class="group flex items-center space-x-3 pl-1 pr-3 py-1 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-md ring-2 ring-white dark:ring-gray-900 group-hover:ring-primary-200 dark:group-hover:ring-primary-900 transition-all">
              <span class="text-white text-xs font-bold">
                {{ authStore.currentUser.username.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="flex flex-col items-start">
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ authStore.currentUser.username }}
              </span>
            </div>
            <svg 
              :class="['w-4 h-4 text-gray-400 transition-transform duration-200', userMenuOpen ? 'rotate-180' : '']" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- User Dropdown Menu -->
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div 
              v-if="userMenuOpen" 
              class="absolute right-0 mt-2 w-60 glass-card rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
              @click.stop
            >
              <!-- User Header -->
              <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ authStore.currentUser.username }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ authStore.currentUser.email }}</p>
              </div>
              
              <!-- Menu Items -->
              <div class="p-1">
                <router-link 
                  to="/settings" 
                  @click="userMenuOpen = false"
                  class="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                >
                  <div class="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span>Settings</span>
                </router-link>
                
                <div class="my-1 border-t border-gray-100 dark:border-gray-700/50"></div>
                
                <button
                  @click="handleLogout"
                  class="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <div class="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-md text-red-500 dark:text-red-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <nav class="flex flex-col space-y-1 p-4">
        <router-link 
          to="/" 
          @click="mobileMenuOpen = false"
          :class="[
            'flex items-center space-x-3 py-2.5 px-4 rounded-lg transition-all duration-200',
            $route.path === '/' 
              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </router-link>
        <router-link 
          to="/strategies" 
          @click="mobileMenuOpen = false"
          class="flex items-center space-x-3 py-2.5 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          active-class="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Strategies</span>
        </router-link>
        <router-link 
          to="/orders" 
          @click="mobileMenuOpen = false"
          class="flex items-center space-x-3 py-2.5 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          active-class="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Orders</span>
        </router-link>
        <router-link 
          to="/settings" 
          @click="mobileMenuOpen = false"
          class="flex items-center space-x-3 py-2.5 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          active-class="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </router-link>
        <div v-if="authStore.currentUser" class="flex items-center space-x-3 py-2.5 px-4 border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
          <div class="w-8 h-8 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center">
            <span class="text-white text-sm font-medium">
              {{ authStore.currentUser.username.charAt(0).toUpperCase() }}
            </span>
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ authStore.currentUser.username }}
          </span>
        </div>
        <button 
          @click="handleLogout" 
          class="btn-secondary text-sm px-4 py-2 w-full mt-2"
        >
          Logout
        </button>
      </nav>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Close user menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.user-menu-container')) {
      userMenuOpen.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

