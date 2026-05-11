<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Command {
  id: string
  label: string
  emoji: string
  cmd: string
  description: string
}

const commands: Command[] = [
  { id: 'dev', label: '启动开发服务', emoji: '🚀', cmd: 'pnpm dev --host', description: '启动 Vite 开发服务器（局域网可访问）' },
  { id: 'build', label: '构建项目', emoji: '📦', cmd: 'pnpm build', description: '执行 vue-tsc + vite build' },
  { id: 'test', label: '运行测试', emoji: '🧪', cmd: 'pnpm test', description: '执行 vitest 单元测试' },
  { id: 'test-watch', label: '监听测试', emoji: '🔄', cmd: 'pnpm test:watch', description: '文件变更自动重跑测试' },
  { id: 'preview', label: '预览构建', emoji: '👁️', cmd: 'pnpm preview --host', description: '预览生产构建（局域网可访问）' },
  { id: 'type-check', label: '类型检查', emoji: '✅', cmd: 'npx vue-tsc --noEmit', description: '仅做 TypeScript 类型检查' },
]

const logs = ref<{ id: number; cmd: string; time: string }[]>([])
const networkInfo = ref({ local: '', network: '' })
let logId = 0

onMounted(() => {
  const host = location.hostname
  const port = location.port || '5173'
  networkInfo.value.local = `http://localhost:${port}`
  networkInfo.value.network = `http://${host}:${port}`
})

function copyCmd(cmd: string) {
  navigator.clipboard.writeText(cmd)
  logs.value.unshift({ id: ++logId, cmd, time: new Date().toLocaleTimeString() })
  if (logs.value.length > 20) logs.value.pop()
}

function copyText(text: string) {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="cmd-panel">
    <h2>⚙️ 自动化命令面板</h2>

    <!-- 网络访问信息 -->
    <div class="network-section">
      <h3>🌐 网络访问</h3>
      <div class="addr-row" @click="copyText(networkInfo.local)">
        <span class="addr-label">本地</span>
        <code>{{ networkInfo.local }}</code>
      </div>
      <div class="addr-row" @click="copyText(networkInfo.network)">
        <span class="addr-label">局域网</span>
        <code>{{ networkInfo.network }}</code>
      </div>
      <small class="addr-hint">点击地址复制 · 已配置 host: 0.0.0.0 支持 IP 访问</small>
    </div>

    <!-- 命令列表 -->
    <div class="cmd-section">
      <h3>📋 可用命令</h3>
      <div class="cmd-list">
        <button v-for="c in commands" :key="c.id" class="cmd-item" @click="copyCmd(c.cmd)">
          <span class="cmd-emoji">{{ c.emoji }}</span>
          <div class="cmd-info">
            <strong>{{ c.label }}</strong>
            <code>{{ c.cmd }}</code>
            <small>{{ c.description }}</small>
          </div>
        </button>
      </div>
    </div>

    <!-- 测试信息 -->
    <div class="test-section">
      <h3>🧪 自动化测试概览</h3>
      <div class="test-stats">
        <span class="test-stat">📁 <code>src/__tests__/</code></span>
        <span class="test-stat">🔧 Vitest + Vue Test Utils</span>
        <span class="test-stat">📊 28 个测试用例</span>
      </div>
      <div class="test-files">
        <div class="test-file">
          <strong>App.spec.ts</strong> — 7 个用例（渲染、交互、面板）
        </div>
        <div class="test-file">
          <strong>useCloutChase.spec.ts</strong> — 21 个用例（核心逻辑）
        </div>
      </div>
    </div>

    <!-- 操作记录 -->
    <div v-if="logs.length" class="cmd-log">
      <h3>📝 操作记录</h3>
      <p v-for="l in logs" :key="l.id" class="log-entry">
        <span class="log-time">{{ l.time }}</span>
        <code>{{ l.cmd }}</code>
        <span class="copied-tag">已复制</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.cmd-panel{text-align:left}
.cmd-panel h2{font-size:1.1rem;margin-bottom:12px;text-align:center}
.cmd-panel h3{font-size:.85rem;margin-bottom:8px;color:#4facfe}
.network-section,.cmd-section,.test-section{margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #3a3a5a}
.addr-row{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:6px;cursor:pointer;transition:background .2s}
.addr-row:hover{background:rgba(79,172,254,.06)}
.addr-label{font-size:.7rem;color:#999;min-width:40px}
.addr-row code{font-size:.8rem;color:#43e97b}
.addr-hint{display:block;margin-top:6px;font-size:.68rem;color:#666}
.cmd-list{display:flex;flex-direction:column;gap:6px}
.cmd-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #3a3a5a;border-radius:10px;background:rgba(255,255,255,.02);color:#fff;text-align:left;cursor:pointer;transition:all .2s;width:100%}
.cmd-item:hover{border-color:#4facfe;background:rgba(79,172,254,.06);transform:translateX(3px)}
.cmd-emoji{font-size:1.3rem;min-width:32px;text-align:center}
.cmd-info{display:flex;flex-direction:column;gap:2px}
.cmd-info strong{font-size:.85rem}
.cmd-info code{font-size:.75rem;color:#4facfe;background:rgba(79,172,254,.1);padding:2px 6px;border-radius:4px;width:fit-content}
.cmd-info small{font-size:.7rem;color:#999}
.test-stats{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:8px}
.test-stat{font-size:.75rem;color:#ccc}
.test-stat code{color:#feca57;font-size:.72rem}
.test-files{display:flex;flex-direction:column;gap:4px}
.test-file{font-size:.75rem;color:#bbb;padding:4px 8px;background:rgba(255,255,255,.02);border-radius:4px}
.test-file strong{color:#fff}
.cmd-log{margin-top:14px;border-top:1px solid #3a3a5a;padding-top:10px}
.cmd-log h3{font-size:.85rem;margin-bottom:6px}
.log-entry{display:flex;align-items:center;gap:8px;font-size:.75rem;padding:4px 8px;background:rgba(255,255,255,.02);border-radius:6px;margin-bottom:3px}
.log-time{color:#666;font-size:.7rem}
.log-entry code{color:#43e97b;font-size:.72rem}
.copied-tag{color:#feca57;font-size:.65rem;margin-left:auto}
</style>
