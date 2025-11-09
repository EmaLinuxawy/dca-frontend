<template>
  <div 
    v-if="error" 
    class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-lg mb-4 flex justify-between items-start gap-4 shadow-sm"
  >
    <div class="flex items-start space-x-3 flex-1">
      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <p class="text-sm font-medium flex-1">{{ error }}</p>
    </div>
    <button 
      @click="$emit('dismiss')" 
      class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold text-xl leading-none focus:outline-none focus:ring-2 focus:ring-red-500 rounded transition-colors"
      aria-label="Dismiss error"
    >
      &times;
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string | null
}>()

defineEmits<{
  dismiss: []
}>()
</script>

