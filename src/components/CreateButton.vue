<template>
  <button class="create-btn" @click="$emit('click')">
    <span class="btn-emoji">📱</span>
    <span class="btn-text">Create Content</span>
    <span class="btn-sub">+{{ fansPerClick }} fans</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{ fansPerClick: number }>()
defineEmits<{ click: [] }>()
</script>

<style scoped>
.create-btn { width: 180px; height: 180px; border-radius: 50%; border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; transition: transform 0.1s, box-shadow 0.1s; box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4); user-select: none; }
.create-btn:active { transform: scale(0.92); }
.create-btn:hover { transform: scale(1.05); }
.btn-emoji { font-size: 3rem; }
.btn-text { font-size: 1rem; font-weight: 700; }
.btn-sub { font-size: 0.8rem; opacity: 0.8; }
</style>
