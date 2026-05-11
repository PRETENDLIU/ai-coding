<template>
  <div class="stats-bar">
    <div class="stat-main">
      <span class="stat-value">{{ formatNumber(fans) }}</span>
      <span class="stat-label">fans</span>
    </div>
    <div class="stat-secondary">
      <span>{{ formatNumber(fansPerSecond) }}/s</span>
      <span>{{ fansPerClick }}/click</span>
      <span>{{ multiplier.toFixed(1) }}x</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ fans: number; fansPerSecond: number; fansPerClick: number; multiplier: number; formatNumber: (n: number) => string }>()
</script>

<style scoped>
.stats-bar { text-align: center; padding: 1rem; }
.stat-main { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.stat-value { font-size: 2.5rem; font-weight: 800; color: #667eea; }
.stat-label { font-size: 1.2rem; color: #888; }
.stat-secondary { display: flex; gap: 1rem; justify-content: center; margin-top: 0.5rem; font-size: 0.9rem; color: #666; }
</style>
