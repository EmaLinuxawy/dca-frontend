<template>
  <div class="flex flex-col items-center justify-center p-8 min-h-[200px]">
    <div class="spinner"></div>
    <p v-if="message" class="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

