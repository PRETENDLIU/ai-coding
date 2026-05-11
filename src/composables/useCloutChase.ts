import { ref, computed } from 'vue'

export type Platform = 'tiktok' | 'instagram' | 'youtube'

export interface GameState {
  day: number
  followers: number
  energy: number
  money: number
  reputation: number
  platform: Platform
  isGameOver: boolean
  isWin: boolean
  streak: number
  lastContentType: string
  trendingType: string
  level: number
  xp: number
  skills: Skill[]
  milestones: Milestone[]
  combo: number
  comboTimer: number | null
}

export interface ContentChoice {
  id: string; label: string; emoji: string; description: string
  energyCost: number; followerGain: () => number; moneyGain: number; reputationChange: number
  unlockAt?: number
}

export interface RandomEvent {
  id: string; title: string; emoji: string; description: string
  choices: { label: string; effect: Partial<Pick<GameState, 'followers' | 'energy' | 'money' | 'reputation'>>; resultText: string }[]
}

export interface Skill {
  id: string; name: string; emoji: string; description: string
  cost: number; owned: boolean; effect: string
}

export interface Milestone {
  id: string; title: string; emoji: string; target: number; reward: string; claimed: boolean
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const TRENDING_TYPES = ['dance', 'mukbang', 'drama', 'collab', 'vlog', 'challenge', 'tutorial']

const SKILLS: Skill[] = [
  { id: 'charisma', name: '天生魅力', emoji: '✨', description: '所有内容粉丝+20%', cost: 1000, owned: false, effect: 'follower_boost' },
  { id: 'stamina', name: '精力充沛', emoji: '⚡', description: '每天额外恢复15点能量', cost: 800, owned: false, effect: 'energy_regen' },
  { id: 'business', name: '商业头脑', emoji: '💼', description: '收入翻倍', cost: 1500, owned: false, effect: 'money_boost' },
  { id: 'thick_skin', name: '厚脸皮', emoji: '🛡️', description: '声望损失减半', cost: 1200, owned: false, effect: 'rep_shield' },
  { id: 'viral_gene', name: '病毒基因', emoji: '🧬', description: '暴击概率翻倍(额外粉丝)', cost: 2000, owned: false, effect: 'crit_boost' },
  { id: 'network', name: '人脉广', emoji: '🌐', description: '合作内容收益+50%', cost: 1800, owned: false, effect: 'collab_boost' },
]

const MILESTONES: Milestone[] = [
  { id: 'm1k', title: '小有名气', emoji: '⭐', target: 1000, reward: '+$200', claimed: false },
  { id: 'm10k', title: '小网红', emoji: '🌟', target: 10000, reward: '解锁挑战内容', claimed: false },
  { id: 'm50k', title: '中V', emoji: '🔥', target: 50000, reward: '+$1000', claimed: false },
  { id: 'm100k', title: '大V认证', emoji: '✅', target: 100000, reward: '解锁教程内容', claimed: false },
  { id: 'm500k', title: '顶流', emoji: '👑', target: 500000, reward: '所有收益+30%', claimed: false },
]

const BASE_CONTENT: ContentChoice[] = [
  { id: 'dance', label: '热门舞蹈', emoji: '💃', description: '跟风热门舞蹈，高风险高回报！', energyCost: 30, followerGain: () => rand(5000, 50000), moneyGain: 100, reputationChange: 5 },
  { id: 'mukbang', label: '吃播', emoji: '🍔', description: '大胃王挑战，稳定涨粉', energyCost: 20, followerGain: () => rand(3000, 20000), moneyGain: 200, reputationChange: 2 },
  { id: 'drama', label: '搞事情', emoji: '🔥', description: '挑起争议！可能翻车！', energyCost: 10, followerGain: () => (Math.random() > 0.4 ? rand(20000, 100000) : -rand(5000, 30000)), moneyGain: 50, reputationChange: -10 },
  { id: 'collab', label: '联动合作', emoji: '🤝', description: '和大V合作，花钱但稳', energyCost: 25, followerGain: () => rand(10000, 40000), moneyGain: -500, reputationChange: 8 },
  { id: 'vlog', label: '日常Vlog', emoji: '📸', description: '真实日常，慢但稳', energyCost: 15, followerGain: () => rand(2000, 15000), moneyGain: 150, reputationChange: 10 },
  { id: 'rest', label: '休息一天', emoji: '😴', description: '恢复精力，但会掉粉', energyCost: -50, followerGain: () => -rand(500, 2000), moneyGain: 0, reputationChange: 0 },
  { id: 'challenge', label: '极限挑战', emoji: '🎯', description: '高难度挑战，超高回报！', energyCost: 40, followerGain: () => rand(15000, 80000), moneyGain: 300, reputationChange: 12, unlockAt: 10000 },
  { id: 'tutorial', label: '干货教程', emoji: '📚', description: '分享技能，涨铁粉', energyCost: 35, followerGain: () => rand(8000, 30000), moneyGain: 500, reputationChange: 15, unlockAt: 100000 },
]

const EVENTS: RandomEvent[] = [
  { id: 'brand', title: '品牌找上门！', emoji: '💰', description: '一个品牌想赞助你，但产品口碑一般...', choices: [
    { label: '接！恰饭要紧', effect: { money: 2000, reputation: -15, followers: 5000 }, resultText: '钱到手了！但粉丝在骂你恰烂钱...' },
    { label: '拒绝，爱惜羽毛', effect: { reputation: 10 }, resultText: '粉丝：有原则！路人转粉！' },
  ]},
  { id: 'cancel', title: '被挂了！', emoji: '😱', description: '你的黑历史被扒出来了，评论区炸了！', choices: [
    { label: '诚恳道歉', effect: { reputation: -5, followers: -10000 }, resultText: '道歉有用，但还是掉粉了' },
    { label: '硬刚到底', effect: { reputation: -20, followers: 30000 }, resultText: '虽然口碑崩了，但黑粉也是粉！' },
    { label: '装死', effect: { followers: -5000 }, resultText: '风头过了，还好不严重' },
  ]},
  { id: 'viral', title: '爆了！！！', emoji: '🚀', description: '你的视频突然上了热搜！', choices: [
    { label: '趁热打铁连更！', effect: { followers: 80000, energy: -30 }, resultText: '疯狂涨粉！但累坏了...' },
    { label: '稳住，别飘', effect: { followers: 40000, reputation: 5 }, resultText: '稳步增长，口碑也好' },
  ]},
  { id: 'copycat', title: '被抄袭了！', emoji: '😤', description: '一个百万粉大V抄了你的创意！', choices: [
    { label: '公开锤他', effect: { followers: 25000, reputation: -5 }, resultText: '吃瓜群众涌入，涨粉了！' },
    { label: '算了，格局大', effect: { reputation: 10, energy: 10 }, resultText: '真粉看在眼里，路人缘好' },
  ]},
  { id: 'algo', title: '算法大改！', emoji: '📉', description: '平台改了推荐算法，流量暴跌！', choices: [
    { label: '研究新算法', effect: { energy: -20, followers: 10000 }, resultText: '摸透了新规则！' },
    { label: '发帖吐槽平台', effect: { followers: -5000, reputation: -5 }, resultText: '没人同情你...' },
  ]},
  { id: 'meetup', title: '粉丝见面会！', emoji: '🎉', description: '粉丝想线下见你！', choices: [
    { label: '办！花钱也值', effect: { money: -1000, followers: 20000, reputation: 15 }, resultText: '超成功！粉丝粘性暴增！' },
    { label: '下次吧', effect: { reputation: -3 }, resultText: '粉丝有点失望...' },
  ]},
  { id: 'invest', title: '投资机会！', emoji: '📈', description: '有人想投资你的MCN，但要分成...', choices: [
    { label: '签约！', effect: { money: 5000, followers: 30000, reputation: -5 }, resultText: '资源到位，但自由度降低了' },
    { label: '独立发展', effect: { reputation: 8 }, resultText: '保持独立，粉丝尊重你的选择' },
  ]},
  { id: 'hack', title: '账号被盗！', emoji: '🔓', description: '你的账号被黑客入侵了！', choices: [
    { label: '紧急找回', effect: { energy: -30, followers: -3000 }, resultText: '找回了，但损失了一些粉丝' },
    { label: '开新号重来', effect: { followers: -20000, reputation: 5 }, resultText: '粉丝迁移中...真爱粉跟过来了' },
  ]},
]

const WIN = 1_000_000
const MAX_DAYS = 30

function init(platform: Platform): GameState {
  return {
    day: 1, followers: 100, energy: 100, money: 500, reputation: 50,
    platform, isGameOver: false, isWin: false,
    streak: 0, lastContentType: '', trendingType: TRENDING_TYPES[rand(0, TRENDING_TYPES.length - 1)],
    level: 1, xp: 0,
    skills: JSON.parse(JSON.stringify(SKILLS)),
    milestones: JSON.parse(JSON.stringify(MILESTONES)),
    combo: 0, comboTimer: null,
  }
}

export function useCloutChase() {
  const state = ref<GameState>(init('tiktok'))
  const gameStarted = ref(false)
  const currentEvent = ref<RandomEvent | null>(null)
  const eventResult = ref<string | null>(null)
  const dayLog = ref<string[]>([])
  const showSkillPanel = ref(false)
  const showMilestonePanel = ref(false)
  const floatingTexts = ref<{ id: number; text: string; type: 'gain' | 'loss' | 'crit' }[]>([])
  let floatId = 0

  const followerProgress = computed(() => Math.min((state.value.followers / WIN) * 100, 100))
  const xpToNext = computed(() => state.value.level * 100)
  const levelProgress = computed(() => (state.value.xp / xpToNext.value) * 100)

  const choices = computed(() => {
    return BASE_CONTENT.filter(c => !c.unlockAt || state.value.followers >= c.unlockAt)
  })

  const unclaimedMilestones = computed(() =>
    state.value.milestones.filter(m => !m.claimed && state.value.followers >= m.target).length
  )

  function hasSkill(id: string) { return state.value.skills.find(s => s.id === id)?.owned ?? false }

  function fmt(n: number): string {
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M'
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K'
    return n.toString()
  }

  function addFloat(text: string, type: 'gain' | 'loss' | 'crit') {
    const id = ++floatId
    floatingTexts.value.push({ id, text, type })
    setTimeout(() => { floatingTexts.value = floatingTexts.value.filter(f => f.id !== id) }, 1500)
  }

  function startGame(p: Platform) {
    state.value = init(p)
    gameStarted.value = true
    currentEvent.value = null
    eventResult.value = null
    dayLog.value = []
  }

  function postContent(c: ContentChoice) {
    if (state.value.energy < c.energyCost && c.energyCost > 0) return
    if (state.value.isGameOver) return

    let gain = c.followerGain()

    // 连击加成
    if (c.id === state.value.lastContentType && c.id !== 'rest') {
      state.value.streak++
      const streakBonus = Math.min(state.value.streak * 0.1, 0.5) // 最高50%加成
      gain = Math.floor(gain * (1 + streakBonus))
    } else {
      state.value.streak = c.id === 'rest' ? state.value.streak : 0
    }
    state.value.lastContentType = c.id

    // 热门加成
    if (c.id === state.value.trendingType) {
      gain = Math.floor(gain * 1.5)
      addFloat('🔥 热门加成 x1.5!', 'crit')
    }

    // 技能加成
    if (hasSkill('charisma')) gain = Math.floor(gain * 1.2)
    if (hasSkill('collab_boost') && c.id === 'collab') gain = Math.floor(gain * 1.5)
    if (hasSkill('viral_gene') && Math.random() < 0.15) {
      gain = Math.floor(gain * 2.5)
      addFloat('🧬 暴击! x2.5!', 'crit')
    }

    // 500k里程碑加成
    if (state.value.milestones.find(m => m.id === 'm500k')?.claimed) {
      gain = Math.floor(gain * 1.3)
    }

    let money = c.moneyGain
    if (hasSkill('business')) money *= 2

    let repChange = c.reputationChange
    if (hasSkill('thick_skin') && repChange < 0) repChange = Math.ceil(repChange / 2)

    state.value.energy = Math.max(0, Math.min(100, state.value.energy - c.energyCost))
    if (hasSkill('stamina')) state.value.energy = Math.min(100, state.value.energy + 15)

    state.value.followers = Math.max(0, state.value.followers + gain)
    state.value.money += money
    state.value.reputation = Math.max(0, Math.min(100, state.value.reputation + repChange))

    // XP & 升级
    state.value.xp += Math.abs(gain) > 0 ? Math.ceil(Math.abs(gain) / 1000) : 1
    while (state.value.xp >= xpToNext.value) {
      state.value.xp -= xpToNext.value
      state.value.level++
      addFloat('⬆️ 等级 ' + state.value.level + '!', 'crit')
    }

    // 浮动文字
    if (gain > 0) addFloat('+' + fmt(gain) + ' 粉丝', 'gain')
    else if (gain < 0) addFloat(fmt(gain) + ' 粉丝', 'loss')

    const streakText = state.value.streak > 1 ? ' (连击x' + state.value.streak + ')' : ''
    dayLog.value.unshift('Day ' + state.value.day + ': ' + c.emoji + ' ' + c.label + ' → ' + (gain >= 0 ? '+' : '') + fmt(gain) + streakText)

    advance()
  }

  function advance() {
    state.value.day++
    // 每天换热门
    if (state.value.day % 3 === 0) {
      state.value.trendingType = TRENDING_TYPES[rand(0, TRENDING_TYPES.length - 1)]
    }
    if (state.value.followers >= WIN) { state.value.isGameOver = true; state.value.isWin = true; return }
    if (state.value.day > MAX_DAYS) { state.value.isGameOver = true; state.value.isWin = false; return }
    if (Math.random() < 0.35) currentEvent.value = EVENTS[Math.floor(Math.random() * EVENTS.length)]
  }

  function handleEvent(c: RandomEvent['choices'][0]) {
    let followers = c.effect.followers ?? 0
    let rep = c.effect.reputation ?? 0
    if (hasSkill('charisma') && followers > 0) followers = Math.floor(followers * 1.2)
    if (hasSkill('thick_skin') && rep < 0) rep = Math.ceil(rep / 2)

    if (followers) state.value.followers = Math.max(0, state.value.followers + followers)
    if (c.effect.energy) state.value.energy = Math.max(0, Math.min(100, state.value.energy + c.effect.energy))
    if (c.effect.money) state.value.money += c.effect.money
    if (rep) state.value.reputation = Math.max(0, Math.min(100, state.value.reputation + rep))
    eventResult.value = c.resultText
  }

  function buySkill(skill: Skill) {
    if (skill.owned || state.value.money < skill.cost) return
    state.value.money -= skill.cost
    skill.owned = true
    addFloat('🎓 学会了: ' + skill.name, 'crit')
  }

  function claimMilestone(m: Milestone) {
    if (m.claimed || state.value.followers < m.target) return
    m.claimed = true
    if (m.id === 'm1k') state.value.money += 200
    if (m.id === 'm50k') state.value.money += 1000
    addFloat('🏆 ' + m.title + '!', 'crit')
  }

  function dismissEvent() { currentEvent.value = null; eventResult.value = null }
  function reset() { gameStarted.value = false; state.value = init('tiktok'); currentEvent.value = null; eventResult.value = null; dayLog.value = [] }

  return {
    state, gameStarted, currentEvent, eventResult, dayLog, followerProgress,
    choices, startGame, postContent, handleEvent, dismissEvent, reset, fmt,
    showSkillPanel, showMilestonePanel, buySkill, claimMilestone,
    floatingTexts, levelProgress, xpToNext, unclaimedMilestones, hasSkill,
  }
}
