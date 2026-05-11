<template>
  <Transition name="toast">
    <div v-if="show" class="toast">{{ message }}</div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean; message: string }>()
</script>

<style scoped>
.toast { position: fixed; top: 1rem; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.85); color: white; padding: 0.75rem 1.5rem; border-radius: 24px; font-size: 0.9rem; font-weight: 600; z-index: 1000; pointer-events: none; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
</style>
