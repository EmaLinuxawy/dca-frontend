<template>
  <div class="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200 overflow-hidden relative">
    <!-- Mesh Gradient Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-500/10 blur-[100px]"></div>
      <div class="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]"></div>
      <div class="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px]"></div>
    </div>
    <Navbar />
    <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto relative z-10">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue'
</script>

