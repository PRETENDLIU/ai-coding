import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { ClickerState } from '../types/clicker'
import { UPGRADES, PLATFORMS, ACHIEVEMENTS } from '../data/gameData'

export function useGame() {
  const state = ref<ClickerState>({
    fans: 0,
    totalFans: 0,
    totalClicks: 0,
    fansPerClick: 1,
    fansPerSecond: 0,
    upgrades: JSON.parse(JSON.stringify(UPGRADES)),
    platforms: JSON.parse(JSON.stringify(PLATFORMS)),
    achievements: JSON.parse(JSON.stringify(ACHIEVEMENTS)),
    viralMultiplier: 1,
  })

  let tickInterval: number | undefined
  const toastMessage = ref('')
  const showToast = ref(false)

  const activeMultiplier = computed(() => {
    return state.value.platforms
      .filter(p => p.unlocked)
      .reduce((max, p) => Math.max(max, p.multiplier), 1)
  })

  function getUpgradeCost(upgrade: typeof state.value.upgrades[0]) {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned))
  }

  function createContent() {
    const gained = state.value.fansPerClick * activeMultiplier.value * state.value.viralMultiplier
    state.value.fans += gained
    state.value.totalFans += gained
    state.value.totalClicks++

    if (Math.random() < 0.02) {
      const viralGain = gained * 5
      state.value.fans += viralGain
      state.value.totalFans += viralGain
      notify('VIRAL! Your post blew up! +' + formatNumber(viralGain) + ' fans!')
    }

    checkAchievements()
    checkPlatforms()
  }

  function buyUpgrade(upgrade: typeof state.value.upgrades[0]) {
    const cost = getUpgradeCost(upgrade)
    if (state.value.fans >= cost) {
      state.value.fans -= cost
      upgrade.owned++
      state.value.fansPerSecond += upgrade.fansPerSecond
    }
  }

  function tick() {
    if (state.value.fansPerSecond > 0) {
      const gained = state.value.fansPerSecond * activeMultiplier.value * state.value.viralMultiplier / 10
      state.value.fans += gained
      state.value.totalFans += gained
      checkAchievements()
      checkPlatforms()
    }
  }

  function checkPlatforms() {
    state.value.platforms.forEach(p => {
      if (!p.unlocked && state.value.totalFans >= p.unlockAt) {
        p.unlocked = true
        notify(p.emoji + ' ' + p.name + ' unlocked! ' + p.multiplier + 'x multiplier!')
      }
    })
  }

  function checkAchievements() {
    state.value.achievements.forEach(a => {
      if (!a.unlocked && a.condition(state.value.totalFans, state.value.totalClicks)) {
        a.unlocked = true
        notify('Achievement: ' + a.title + '!')
        state.value.fansPerClick++
      }
    })
  }

  function notify(msg: string) {
    toastMessage.value = msg
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  }

  function formatNumber(n: number): string {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
    return Math.floor(n).toString()
  }

  onMounted(() => {
    tickInterval = window.setInterval(tick, 100)
  })

  onUnmounted(() => {
    if (tickInterval) clearInterval(tickInterval)
  })

  return {
    state,
    activeMultiplier,
    toastMessage,
    showToast,
    getUpgradeCost,
    createContent,
    buyUpgrade,
    formatNumber,
  }
}
