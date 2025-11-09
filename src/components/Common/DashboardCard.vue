<template>
  <div class="card hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div class="relative">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for this simple component
</script>
