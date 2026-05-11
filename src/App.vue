<script setup lang="ts">
import { useCloutChase } from './composables/useCloutChase'
const { state, gameStarted, currentEvent, eventResult, dayLog, followerProgress, choices, startGame, postContent, handleEvent, dismissEvent, reset, fmt } = useCloutChase()
const platforms = [
  { id: 'tiktok' as const, label: 'TikTok', emoji: '\u{1F3B5}' },
  { id: 'instagram' as const, label: 'Instagram', emoji: '\u{1F4F7}' },
  { id: 'youtube' as const, label: 'YouTube', emoji: '\u{25B6}\u{FE0F}' },
]
</script>

<template>
  <!-- START SCREEN -->
  <div v-if="!gameStarted" class="app center">
    <h1 class="title">CLOUT CHASE</h1>
    <p class="subtitle">Influencer Simulator</p>
    <p class="desc">Can you hit <strong>1 MILLION</strong> followers in <strong>30 days</strong>?</p>
    <p class="choose">Choose your platform:</p>
    <div class="platforms">
      <button v-for="p in platforms" :key="p.id" class="plat-btn" @click="startGame(p.id)">
        <span class="plat-emoji">{{ p.emoji }}</span><span>{{ p.label }}</span>
      </button>
    </div>
    <p class="tip">Tip: Balance growth, reputation, and energy to win!</p>
  </div>

  <!-- GAME OVER -->
  <div v-else-if="state.isGameOver" class="app center">
    <template v-if="state.isWin">
      <h1 class="win">YOU MADE IT!</h1>
      <p class="win-sub">1 MILLION FOLLOWERS!</p>
      <p class="info">Done in {{ state.day - 1 }} days | ${{ fmt(state.money) }} | Rep: {{ state.reputation }}</p>
    </template>
    <template v-else>
      <h1 class="lose">TIME'S UP</h1>
      <p class="info">You reached {{ fmt(state.followers) }} followers</p>
    </template>
    <button class="restart-btn" @click="reset()">Play Again</button>
  </div>

  <!-- GAME BOARD -->
  <div v-else class="app">
    <!-- Stats -->
    <div class="stats">
      <span>Day {{ state.day }}/30</span>
      <span>{{ fmt(state.followers) }} followers</span>
      <span>{{ state.energy }}% energy</span>
      <span>${{ fmt(state.money) }}</span>
      <span>Rep: {{ state.reputation }}</span>
    </div>
    <div class="progress"><div class="bar" :style="{ width: followerProgress + '%' }"></div><span class="bar-label">{{ fmt(state.followers) }} / 1M</span></div>

    <div class="board">
      <!-- Content choices -->
      <div class="panel">
        <h2>What's today's content?</h2>
        <button v-for="c in choices" :key="c.id" class="choice" :disabled="state.energy < c.energyCost && c.energyCost > 0" @click="postContent(c)">
          <span class="c-emoji">{{ c.emoji }}</span>
          <div class="c-info"><strong>{{ c.label }}</strong><small>{{ c.description }}</small><span class="c-cost">Energy: {{ c.energyCost > 0 ? '-' : '+' }}{{ Math.abs(c.energyCost) }}</span></div>
        </button>
      </div>
      <!-- Activity log -->
      <div class="log-panel">
        <h3>Activity Log</h3>
        <p v-if="dayLog.length === 0" class="empty">No activity yet.</p>
        <p v-for="(l, i) in dayLog" :key="i" class="log-item">{{ l }}</p>
      </div>
    </div>

    <!-- Event modal -->
    <div v-if="currentEvent" class="overlay">
      <div class="modal">
        <h2>{{ currentEvent.emoji }} {{ currentEvent.title }}</h2>
        <p class="ev-desc">{{ currentEvent.description }}</p>
        <template v-if="!eventResult">
          <button v-for="(ch, i) in currentEvent.choices" :key="i" class="ev-btn" @click="handleEvent(ch)">{{ ch.label }}</button>
        </template>
        <template v-else>
          <p class="ev-result">{{ eventResult }}</p>
          <button class="ev-dismiss" @click="dismissEvent()">Continue</button>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);min-height:100vh;color:#fff}
.app{min-height:100vh;display:flex;flex-direction:column;padding:20px;max-width:900px;margin:0 auto;gap:16px}
.app.center{align-items:center;justify-content:center;text-align:center}
.title{font-size:3rem;background:linear-gradient(90deg,#ff6b6b,#feca57,#48dbfb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.subtitle{font-size:1.2rem;color:#a0a0a0;margin-bottom:24px}
.desc{font-size:1.1rem;margin-bottom:32px;line-height:1.6}
.choose{margin-bottom:16px;color:#ccc}
.platforms{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.plat-btn{display:flex;flex-direction:column;align-items:center;gap:8px;padding:20px 28px;border:2px solid #333;border-radius:16px;background:rgba(255,255,255,.05);color:#fff;font-size:1rem;cursor:pointer;transition:all .2s}
.plat-btn:hover{border-color:#48dbfb;background:rgba(72,219,251,.1);transform:translateY(-2px)}
.plat-emoji{font-size:2rem}
.tip{margin-top:32px;color:#888;font-size:.9rem}
.win{font-size:2.5rem}.win-sub{font-size:1.5rem;background:linear-gradient(90deg,#feca57,#ff6b6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:16px}
.lose{font-size:2.5rem;margin-bottom:8px}.info{color:#ccc;margin-bottom:24px}
.restart-btn{padding:14px 32px;border:none;border-radius:12px;background:linear-gradient(135deg,#ff6b6b,#feca57);color:#000;font-size:1.1rem;font-weight:bold;cursor:pointer}
.restart-btn:hover{transform:scale(1.05)}
.stats{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:12px;padding:12px 16px;font-size:.9rem}
.progress{position:relative;height:24px;background:#222;border-radius:12px;overflow:hidden;width:100%}
.bar{height:100%;background:linear-gradient(90deg,#ff6b6b,#feca57,#48dbfb);border-radius:12px;transition:width .5s}
.bar-label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:bold;text-shadow:0 1px 2px rgba(0,0,0,.8)}
.board{display:grid;grid-template-columns:1fr 280px;gap:16px}
@media(max-width:768px){.board{grid-template-columns:1fr}}
.panel{background:rgba(255,255,255,.03);border:1px solid #333;border-radius:12px;padding:16px}
.panel h2{font-size:1.1rem;margin-bottom:12px}
.choice{display:flex;align-items:center;gap:12px;padding:10px;border:1px solid #444;border-radius:10px;background:rgba(255,255,255,.02);color:#fff;text-align:left;cursor:pointer;transition:all .2s;width:100%;margin-bottom:6px}
.choice:hover:not(:disabled){border-color:#48dbfb;background:rgba(72,219,251,.08)}
.choice:disabled{opacity:.4;cursor:not-allowed}
.c-emoji{font-size:1.6rem}
.c-info{display:flex;flex-direction:column}.c-info small{font-size:.75rem;color:#aaa}.c-cost{font-size:.7rem;color:#feca57}
.log-panel{background:rgba(255,255,255,.03);border:1px solid #333;border-radius:12px;padding:16px;max-height:400px;overflow-y:auto}
.log-panel h3{margin-bottom:10px;font-size:.95rem}
.log-item{font-size:.78rem;color:#bbb;padding:5px 8px;background:rgba(255,255,255,.02);border-radius:6px;margin-bottom:4px}
.empty{color:#666;font-size:.85rem}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}
.modal{background:#1e1e2e;border:1px solid #444;border-radius:16px;padding:28px;max-width:420px;width:100%;text-align:center}
.modal h2{margin-bottom:12px}
.ev-desc{color:#ccc;margin-bottom:20px;line-height:1.5}
.ev-btn{display:block;width:100%;padding:12px;border:1px solid #555;border-radius:10px;background:rgba(255,255,255,.05);color:#fff;font-size:1rem;cursor:pointer;margin-bottom:8px;transition:all .2s}
.ev-btn:hover{border-color:#feca57;background:rgba(254,202,87,.1)}
.ev-result{color:#48dbfb;font-size:1.1rem;margin-bottom:20px;line-height:1.5}
.ev-dismiss{padding:10px 24px;border:none;border-radius:8px;background:#48dbfb;color:#000;font-weight:bold;cursor:pointer}
</style>
