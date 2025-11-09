<template>
  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', badgeClass]">
    <span :class="['w-1.5 h-1.5 rounded-full mr-1.5', dotClass]"></span>
    {{ displayText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()

const badgeClass = computed(() => {
  const statusLower = props.status.toLowerCase()
  if (statusLower === 'filled' || statusLower === 'enabled') {
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700'
  }
  if (statusLower === 'pending') {
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700'
  }
  if (statusLower === 'failed' || statusLower === 'cancelled' || statusLower === 'disabled') {
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'
  }
  return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
})

const dotClass = computed(() => {
  const statusLower = props.status.toLowerCase()
  if (statusLower === 'filled' || statusLower === 'enabled') {
    return 'bg-green-600 dark:bg-green-400'
  }
  if (statusLower === 'pending') {
    return 'bg-yellow-600 dark:bg-yellow-400'
  }
  if (statusLower === 'failed' || statusLower === 'cancelled' || statusLower === 'disabled') {
    return 'bg-red-600 dark:bg-red-400'
  }
  return 'bg-gray-600 dark:bg-gray-400'
})

const displayText = computed(() => {
  return props.status.charAt(0).toUpperCase() + props.status.slice(1).toLowerCase()
})
</script>

