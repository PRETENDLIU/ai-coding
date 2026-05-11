<template>
  <div class="achievements-panel">
    <h3>Achievements ({{ unlockedCount }}/{{ total }})</h3>
    <div class="achievement-list">
      <div v-for="a in achievements" :key="a.id" class="achievement-item" :class="{ unlocked: a.unlocked }" :title="a.description">
        <span>{{ a.unlocked ? a.emoji : '?' }}</span>
        <span class="ach-title">{{ a.unlocked ? a.title : '???' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Achievement } from '../types/clicker'
const props = defineProps<{ achievements: Achievement[] }>()
const unlockedCount = computed(() => props.achievements.filter(a => a.unlocked).length)
const total = computed(() => props.achievements.length)
</script>

<style scoped>
.achievements-panel h3 { margin: 0 0 0.5rem; font-size: 1.1rem; }
.achievement-list { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.achievement-item { display: flex; align-items: center; gap: 0.3rem; padding: 0.4rem 0.6rem; border-radius: 8px; background: #f0f0f0; font-size: 0.8rem; opacity: 0.5; }
.achievement-item.unlocked { opacity: 1; background: #fff3cd; }
.ach-title { font-weight: 600; }
</style>
