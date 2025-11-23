<template>
  <div class="glass-card rounded-2xl p-6 relative overflow-hidden group">
    <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div class="relative z-10">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for this simple component
</script>
