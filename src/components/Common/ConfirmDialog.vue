<template>
  <transition name="fade">
    <div 
      v-if="show" 
      class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm" 
      @click="$emit('cancel')"
    >
      <div 
        class="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 transition-all duration-200" 
        @click.stop
      >
        <div class="flex items-center space-x-3 mb-4">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ title }}</h3>
        </div>
        <p class="text-gray-700 dark:text-gray-300 mb-6 ml-[52px]">{{ message }}</p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="$emit('cancel')" 
            class="btn-secondary"
          >
            {{ cancelText || 'Cancel' }}
          </button>
          <button 
            @click="$emit('confirm')" 
            class="btn-danger"
          >
            {{ confirmText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

