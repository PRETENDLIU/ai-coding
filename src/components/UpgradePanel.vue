<template>
  <div class="upgrades-panel">
    <h3>Upgrades</h3>
    <div class="upgrade-list">
      <button v-for="u in upgrades" :key="u.id" class="upgrade-item" :class="{ affordable: fans >= getCost(u) }" :disabled="fans < getCost(u)" @click="$emit('buy', u)">
        <span class="up-emoji">{{ u.emoji }}</span>
        <div class="up-info">
          <span class="up-name">{{ u.name }}</span>
          <span class="up-desc">{{ u.description }}</span>
        </div>
        <div class="up-meta">
          <span class="up-cost">{{ formatNumber(getCost(u)) }}</span>
          <span class="up-owned">x{{ u.owned }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Upgrade } from '../types/clicker'
defineProps<{ upgrades: Upgrade[]; fans: number; getCost: (u: Upgrade) => number; formatNumber: (n: number) => string }>()
defineEmits<{ buy: [upgrade: Upgrade] }>()
</script>

<style scoped>
.upgrades-panel h3 { margin: 0 0 0.5rem; font-size: 1.1rem; }
.upgrade-list { display: flex; flex-direction: column; gap: 0.5rem; }
.upgrade-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 2px solid #eee; border-radius: 12px; background: white; cursor: pointer; transition: all 0.2s; text-align: left; }
.upgrade-item:disabled { opacity: 0.5; cursor: not-allowed; }
.upgrade-item.affordable { border-color: #667eea; }
.upgrade-item.affordable:hover { background: #f0f0ff; transform: translateX(4px); }
.up-emoji { font-size: 1.5rem; }
.up-info { flex: 1; display: flex; flex-direction: column; }
.up-name { font-weight: 700; font-size: 0.9rem; }
.up-desc { font-size: 0.75rem; color: #888; }
.up-meta { text-align: right; }
.up-cost { font-size: 0.85rem; font-weight: 600; color: #667eea; display: block; }
.up-owned { font-size: 0.75rem; color: #aaa; }
</style>
