<template>
  <div class="platforms-panel">
    <h3>Platforms</h3>
    <div class="platform-list">
      <div v-for="p in platforms" :key="p.id" class="platform-item" :class="{ unlocked: p.unlocked }">
        <span class="plat-emoji">{{ p.emoji }}</span>
        <span class="plat-name">{{ p.name }}</span>
        <span v-if="p.unlocked" class="plat-mult">{{ p.multiplier }}x</span>
        <span v-else class="plat-lock">{{ formatNumber(p.unlockAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClickerPlatform } from '../types/clicker'
defineProps<{ platforms: ClickerPlatform[]; formatNumber: (n: number) => string }>()
</script>

<style scoped>
.platforms-panel h3 { margin: 0 0 0.5rem; font-size: 1.1rem; }
.platform-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.platform-item { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.75rem; border-radius: 20px; background: #f5f5f5; font-size: 0.85rem; }
.platform-item.unlocked { background: linear-gradient(135deg, #667eea22, #764ba222); border: 1px solid #667eea44; }
.plat-emoji { font-size: 1.2rem; }
.plat-name { font-weight: 600; }
.plat-mult { color: #667eea; font-weight: 700; }
.plat-lock { color: #aaa; font-size: 0.75rem; }
</style>
