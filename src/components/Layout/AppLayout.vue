<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <Navbar />
    <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue'
</script>

