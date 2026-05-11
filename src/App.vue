<script setup lang="ts">
import { useCloutChase } from './composables/useCloutChase'
const {
  state, gameStarted, currentEvent, eventResult, dayLog, followerProgress,
  choices, startGame, postContent, handleEvent, dismissEvent, reset, fmt,
  showSkillPanel, showMilestonePanel, buySkill, claimMilestone,
  floatingTexts, levelProgress, xpToNext, unclaimedMilestones,
} = useCloutChase()

const platforms = [
  { id: 'tiktok' as const, label: 'TikTok', emoji: '🎵', desc: '短视频之王，涨粉快' },
  { id: 'instagram' as const, label: 'Instagram', emoji: '📷', desc: '图文为主，变现强' },
  { id: 'youtube' as const, label: 'YouTube', emoji: '▶️', desc: '长视频，粉丝粘性高' },
]
</script>

<template>
  <!-- START SCREEN -->
  <div v-if="!gameStarted" class="app center">
    <div class="logo-area">
      <h1 class="title">CLOUT CHASE</h1>
      <p class="subtitle">网红模拟器 2.0</p>
    </div>
    <p class="desc">在 <strong>30天</strong> 内冲到 <strong>100万</strong> 粉丝！</p>
    <div class="features">
      <span>🎯 策略选择</span><span>🔥 热门加成</span><span>⚡ 连击系统</span><span>🎓 技能树</span><span>🏆 里程碑</span>
    </div>
    <p class="choose">选择你的平台：</p>
    <div class="platforms">
      <button v-for="p in platforms" :key="p.id" class="plat-btn" @click="startGame(p.id)">
        <span class="plat-emoji">{{ p.emoji }}</span>
        <span class="plat-name">{{ p.label }}</span>
        <small class="plat-desc">{{ p.desc }}</small>
      </button>
    </div>
  </div>

  <!-- GAME OVER -->
  <div v-else-if="state.isGameOver" class="app center">
    <template v-if="state.isWin">
      <h1 class="win">🎉 百万网红！</h1>
      <p class="win-sub">你做到了！</p>
      <div class="end-stats">
        <span>📅 用时 {{ state.day - 1 }} 天</span>
        <span>💰 ${{ fmt(state.money) }}</span>
        <span>⭐ 声望 {{ state.reputation }}</span>
        <span>📊 等级 {{ state.level }}</span>
      </div>
    </template>
    <template v-else>
      <h1 class="lose">⏰ 时间到！</h1>
      <p class="lose-sub">最终粉丝: {{ fmt(state.followers) }}</p>
      <div class="end-stats">
        <span>达成 {{ Math.floor(state.followers / 10000) }}% 目标</span>
        <span>等级 {{ state.level }}</span>
      </div>
    </template>
    <button class="restart-btn" @click="reset()">🔄 再来一局</button>
  </div>

  <!-- GAME BOARD -->
  <div v-else class="app game">
    <!-- Top Stats -->
    <div class="top-bar">
      <div class="stats">
        <div class="stat"><span class="stat-label">📅</span><span>Day {{ state.day }}/30</span></div>
        <div class="stat"><span class="stat-label">👥</span><span>{{ fmt(state.followers) }}</span></div>
        <div class="stat"><span class="stat-label">⚡</span><span>{{ state.energy }}%</span></div>
        <div class="stat"><span class="stat-label">💰</span><span>${{ fmt(state.money) }}</span></div>
        <div class="stat"><span class="stat-label">⭐</span><span>{{ state.reputation }}</span></div>
        <div class="stat"><span class="stat-label">Lv.</span><span>{{ state.level }}</span></div>
      </div>
      <div class="progress-row">
        <div class="progress"><div class="bar follower-bar" :style="{ width: followerProgress + '%' }"></div><span class="bar-label">{{ fmt(state.followers) }} / 1M</span></div>
        <div class="progress xp-bar-wrap"><div class="bar xp-bar" :style="{ width: levelProgress + '%' }"></div><span class="bar-label">XP {{ state.xp }}/{{ xpToNext }}</span></div>
      </div>
    </div>

    <!-- Trending & Streak info -->
    <div class="info-bar">
      <span class="trending">🔥 今日热门: <strong>{{ choices.find(c => c.id === state.trendingType)?.label || '—' }}</strong> (x1.5)</span>
      <span v-if="state.streak > 1" class="streak">🔗 连击 x{{ state.streak }}</span>
      <button class="tab-btn" :class="{ notify: unclaimedMilestones > 0 }" @click="showMilestonePanel = !showMilestonePanel">🏆 里程碑{{ unclaimedMilestones > 0 ? ' (' + unclaimedMilestones + ')' : '' }}</button>
      <button class="tab-btn" @click="showSkillPanel = !showSkillPanel">🎓 技能</button>
    </div>

    <div class="board">
      <!-- Content choices -->
      <div class="panel main-panel">
        <h2>今天发什么？</h2>
        <div class="choices-grid">
          <button v-for="c in choices" :key="c.id" class="choice" :class="{ trending: c.id === state.trendingType }" :disabled="state.energy < c.energyCost && c.energyCost > 0" @click="postContent(c)">
            <span class="c-emoji">{{ c.emoji }}</span>
            <div class="c-info">
              <strong>{{ c.label }}</strong>
              <small>{{ c.description }}</small>
              <span class="c-meta">
                <span class="c-cost" :class="{ restore: c.energyCost < 0 }">⚡{{ c.energyCost > 0 ? '-' : '+' }}{{ Math.abs(c.energyCost) }}</span>
                <span v-if="c.id === state.trendingType" class="c-hot">🔥热门</span>
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Activity log -->
      <div class="log-panel">
        <h3>📋 活动日志</h3>
        <p v-if="dayLog.length === 0" class="empty">还没有活动记录</p>
        <p v-for="(l, i) in dayLog" :key="i" class="log-item" :class="{ good: l.includes('+'), bad: l.includes('-') && !l.includes('→ +') }">{{ l }}</p>
      </div>
    </div>

    <!-- Floating texts -->
    <div class="floats">
      <transition-group name="float">
        <span v-for="f in floatingTexts" :key="f.id" class="float-text" :class="f.type">{{ f.text }}</span>
      </transition-group>
    </div>

    <!-- Skill Panel -->
    <div v-if="showSkillPanel" class="overlay" @click.self="showSkillPanel = false">
      <div class="modal skill-modal">
        <h2>🎓 技能树</h2>
        <p class="modal-sub">花钱学技能，永久生效！</p>
        <div class="skill-grid">
          <div v-for="s in state.skills" :key="s.id" class="skill-card" :class="{ owned: s.owned }">
            <span class="skill-emoji">{{ s.emoji }}</span>
            <strong>{{ s.name }}</strong>
            <small>{{ s.description }}</small>
            <button v-if="!s.owned" class="skill-buy" :disabled="state.money < s.cost" @click="buySkill(s)">${{ s.cost }}</button>
            <span v-else class="skill-owned">✅ 已学会</span>
          </div>
        </div>
        <button class="ev-dismiss" @click="showSkillPanel = false">关闭</button>
      </div>
    </div>

    <!-- Milestone Panel -->
    <div v-if="showMilestonePanel" class="overlay" @click.self="showMilestonePanel = false">
      <div class="modal">
        <h2>🏆 里程碑</h2>
        <div class="milestone-list">
          <div v-for="m in state.milestones" :key="m.id" class="milestone-item" :class="{ reached: state.followers >= m.target, claimed: m.claimed }">
            <span>{{ m.emoji }} {{ m.title }} — {{ fmt(m.target) }}粉丝</span>
            <small>奖励: {{ m.reward }}</small>
            <button v-if="state.followers >= m.target && !m.claimed" class="claim-btn" @click="claimMilestone(m)">领取</button>
            <span v-else-if="m.claimed" class="claimed-tag">✅</span>
            <span v-else class="locked-tag">🔒</span>
          </div>
        </div>
        <button class="ev-dismiss" @click="showMilestonePanel = false">关闭</button>
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
          <button class="ev-dismiss" @click="dismissEvent()">继续</button>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);min-height:100vh;color:#fff}
.app{min-height:100vh;display:flex;flex-direction:column;padding:20px;max-width:960px;margin:0 auto;gap:12px}
.app.center{align-items:center;justify-content:center;text-align:center}
.app.game{padding-top:12px}
.logo-area{margin-bottom:24px}
.title{font-size:3.5rem;background:linear-gradient(90deg,#f093fb,#f5576c,#feca57);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:900;letter-spacing:2px}
.subtitle{font-size:1.3rem;color:#a0a0c0;margin-top:4px}
.desc{font-size:1.1rem;margin-bottom:20px;line-height:1.6;color:#ddd}
.features{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-bottom:28px;font-size:.9rem;color:#bbb}
.choose{margin-bottom:16px;color:#ccc;font-size:1rem}
.platforms{display:flex;gap:16px;flex-wrap:wrap;justify-content:center}
.plat-btn{display:flex;flex-direction:column;align-items:center;gap:6px;padding:24px 32px;border:2px solid #444;border-radius:16px;background:rgba(255,255,255,.03);color:#fff;font-size:1rem;cursor:pointer;transition:all .25s;min-width:140px}
.plat-btn:hover{border-color:#f093fb;background:rgba(240,147,251,.08);transform:translateY(-4px);box-shadow:0 8px 24px rgba(240,147,251,.2)}
.plat-emoji{font-size:2.5rem}
.plat-name{font-weight:bold;font-size:1.1rem}
.plat-desc{color:#999;font-size:.75rem}
.win{font-size:2.5rem;margin-bottom:8px}.win-sub{font-size:1.5rem;background:linear-gradient(90deg,#feca57,#f093fb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:16px}
.lose{font-size:2.5rem;margin-bottom:8px}.lose-sub{color:#ccc;font-size:1.2rem;margin-bottom:16px}
.end-stats{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-bottom:24px;color:#aaa}
.restart-btn{padding:14px 36px;border:none;border-radius:12px;background:linear-gradient(135deg,#f093fb,#f5576c);color:#fff;font-size:1.1rem;font-weight:bold;cursor:pointer;transition:transform .2s}
.restart-btn:hover{transform:scale(1.05)}
.top-bar{display:flex;flex-direction:column;gap:8px}
.stats{display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;background:rgba(255,255,255,.04);border:1px solid #3a3a5a;border-radius:12px;padding:10px 16px}
.stat{display:flex;align-items:center;gap:4px;font-size:.85rem}
.stat-label{opacity:.7}
.progress-row{display:flex;gap:8px}
.progress{position:relative;height:22px;background:#1a1a2e;border-radius:11px;overflow:hidden;flex:1}
.xp-bar-wrap{max-width:200px}
.bar{height:100%;border-radius:11px;transition:width .5s}
.follower-bar{background:linear-gradient(90deg,#f5576c,#feca57,#4facfe)}
.xp-bar{background:linear-gradient(90deg,#43e97b,#38f9d7)}
.bar-label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:bold;text-shadow:0 1px 3px rgba(0,0,0,.9)}
.info-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:.85rem;padding:6px 0}
.trending{color:#feca57}
.streak{color:#4facfe;font-weight:bold;animation:pulse .8s infinite alternate}
@keyframes pulse{from{opacity:.7}to{opacity:1}}
.tab-btn{padding:4px 12px;border:1px solid #555;border-radius:8px;background:rgba(255,255,255,.05);color:#ddd;font-size:.8rem;cursor:pointer;transition:all .2s}
.tab-btn:hover{border-color:#f093fb;background:rgba(240,147,251,.1)}
.tab-btn.notify{border-color:#feca57;animation:pulse .8s infinite alternate}
.board{display:grid;grid-template-columns:1fr 260px;gap:12px;flex:1}
@media(max-width:768px){.board{grid-template-columns:1fr}.log-panel{max-height:200px}}
.panel{background:rgba(255,255,255,.03);border:1px solid #3a3a5a;border-radius:12px;padding:14px}
.panel h2{font-size:1rem;margin-bottom:10px}
.main-panel{overflow-y:auto}
.choices-grid{display:flex;flex-direction:column;gap:6px}
.choice{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #3a3a5a;border-radius:10px;background:rgba(255,255,255,.02);color:#fff;text-align:left;cursor:pointer;transition:all .2s;width:100%}
.choice:hover:not(:disabled){border-color:#4facfe;background:rgba(79,172,254,.06);transform:translateX(3px)}
.choice.trending{border-color:rgba(254,202,87,.3);background:rgba(254,202,87,.04)}
.choice.trending:hover:not(:disabled){border-color:#feca57;background:rgba(254,202,87,.1)}
.choice:disabled{opacity:.35;cursor:not-allowed}
.c-emoji{font-size:1.5rem;min-width:36px;text-align:center}
.c-info{display:flex;flex-direction:column;gap:2px}.c-info strong{font-size:.9rem}.c-info small{font-size:.72rem;color:#999}
.c-meta{display:flex;gap:8px;align-items:center;margin-top:2px}
.c-cost{font-size:.7rem;color:#f5576c}.c-cost.restore{color:#43e97b}
.c-hot{font-size:.65rem;color:#feca57;font-weight:bold}
.log-panel{background:rgba(255,255,255,.03);border:1px solid #3a3a5a;border-radius:12px;padding:14px;max-height:500px;overflow-y:auto}
.log-panel h3{margin-bottom:8px;font-size:.9rem}
.log-item{font-size:.75rem;color:#bbb;padding:5px 8px;background:rgba(255,255,255,.02);border-radius:6px;margin-bottom:3px;border-left:2px solid transparent}
.log-item.good{border-left-color:#43e97b}.log-item.bad{border-left-color:#f5576c}
.empty{color:#666;font-size:.85rem}
.floats{position:fixed;top:80px;left:50%;transform:translateX(-50%);pointer-events:none;z-index:200;display:flex;flex-direction:column;align-items:center;gap:4px}
.float-text{font-size:1.1rem;font-weight:bold;animation:floatUp 1.5s ease-out forwards;opacity:0}
.float-text.gain{color:#43e97b}.float-text.loss{color:#f5576c}.float-text.crit{color:#feca57;font-size:1.3rem}
@keyframes floatUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-60px)}}
.float-enter-active{animation:floatUp 1.5s ease-out forwards}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;backdrop-filter:blur(4px)}
.modal{background:#1e1e2e;border:1px solid #444;border-radius:16px;padding:28px;max-width:480px;width:100%;text-align:center;max-height:80vh;overflow-y:auto}
.modal h2{margin-bottom:8px}
.modal-sub{color:#999;font-size:.85rem;margin-bottom:16px}
.ev-desc{color:#ccc;margin-bottom:20px;line-height:1.5}
.ev-btn{display:block;width:100%;padding:12px;border:1px solid #555;border-radius:10px;background:rgba(255,255,255,.05);color:#fff;font-size:.95rem;cursor:pointer;margin-bottom:8px;transition:all .2s}
.ev-btn:hover{border-color:#f093fb;background:rgba(240,147,251,.1);transform:scale(1.02)}
.ev-result{color:#4facfe;font-size:1.1rem;margin-bottom:20px;line-height:1.5}
.ev-dismiss{padding:10px 24px;border:none;border-radius:8px;background:linear-gradient(135deg,#4facfe,#43e97b);color:#000;font-weight:bold;cursor:pointer;margin-top:12px}
.skill-modal{max-width:560px}
.skill-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
@media(max-width:500px){.skill-grid{grid-template-columns:1fr}}
.skill-card{display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px;border:1px solid #444;border-radius:12px;background:rgba(255,255,255,.03);transition:all .2s}
.skill-card.owned{border-color:#43e97b;background:rgba(67,233,123,.05)}
.skill-emoji{font-size:1.8rem}
.skill-card strong{font-size:.85rem}
.skill-card small{font-size:.7rem;color:#999;text-align:center}
.skill-buy{margin-top:6px;padding:4px 12px;border:1px solid #f093fb;border-radius:6px;background:rgba(240,147,251,.1);color:#f093fb;font-size:.8rem;cursor:pointer}
.skill-buy:disabled{opacity:.4;cursor:not-allowed}
.skill-buy:hover:not(:disabled){background:rgba(240,147,251,.2)}
.skill-owned{color:#43e97b;font-size:.75rem;margin-top:4px}
.milestone-list{display:flex;flex-direction:column;gap:8px;margin:16px 0;text-align:left}
.milestone-item{display:flex;align-items:center;gap:8px;padding:10px;border:1px solid #333;border-radius:8px;background:rgba(255,255,255,.02);flex-wrap:wrap}
.milestone-item.reached{border-color:#feca57;background:rgba(254,202,87,.05)}
.milestone-item.claimed{opacity:.6}
.milestone-item span{font-size:.85rem}
.milestone-item small{font-size:.7rem;color:#999;margin-left:auto}
.claim-btn{padding:3px 10px;border:none;border-radius:6px;background:#feca57;color:#000;font-size:.75rem;font-weight:bold;cursor:pointer;margin-left:auto}
.claimed-tag{color:#43e97b;margin-left:auto}
.locked-tag{margin-left:auto;opacity:.4}
</style>
