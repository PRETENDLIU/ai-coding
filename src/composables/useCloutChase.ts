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
}

export interface ContentChoice {
  id: string; label: string; emoji: string; description: string
  energyCost: number; followerGain: () => number; moneyGain: number; reputationChange: number
}

export interface RandomEvent {
  id: string; title: string; emoji: string; description: string
  choices: { label: string; effect: Partial<Pick<GameState, 'followers' | 'energy' | 'money' | 'reputation'>>; resultText: string }[]
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const CONTENT_CHOICES: ContentChoice[] = [
  { id: 'dance', label: 'Viral Dance', emoji: '\u{1F483}', description: 'Trending dance. High risk, high reward!', energyCost: 30, followerGain: () => rand(5000, 50000), moneyGain: 100, reputationChange: 5 },
  { id: 'mukbang', label: 'Mukbang', emoji: '\u{1F354}', description: 'Eat something wild on camera.', energyCost: 20, followerGain: () => rand(3000, 20000), moneyGain: 200, reputationChange: 2 },
  { id: 'drama', label: 'Start Drama', emoji: '\u{1F525}', description: 'Call out another creator. Risky!', energyCost: 10, followerGain: () => (Math.random() > 0.4 ? rand(20000, 100000) : -rand(5000, 30000)), moneyGain: 50, reputationChange: -10 },
  { id: 'collab', label: 'Collab', emoji: '\u{1F91D}', description: 'Team up. Costs money but safe.', energyCost: 25, followerGain: () => rand(10000, 40000), moneyGain: -500, reputationChange: 8 },
  { id: 'vlog', label: 'Day in My Life', emoji: '\u{1F4F8}', description: 'Authentic. Slow but steady.', energyCost: 15, followerGain: () => rand(2000, 15000), moneyGain: 150, reputationChange: 10 },
  { id: 'rest', label: 'Take a Break', emoji: '\u{1F634}', description: 'Rest and recharge.', energyCost: -50, followerGain: () => -rand(500, 2000), moneyGain: 0, reputationChange: 0 },
]

const EVENTS: RandomEvent[] = [
  { id: 'brand', title: 'Brand Deal Offer!', emoji: '\u{1F4B0}', description: 'A brand wants to sponsor you! But their product is questionable.', choices: [
    { label: 'Accept the bag', effect: { money: 2000, reputation: -15, followers: 5000 }, resultText: 'Cha-ching! But fans are side-eyeing you...' },
    { label: 'Decline', effect: { reputation: 10 }, resultText: 'Integrity intact. Fans respect it.' },
  ]},
  { id: 'cancel', title: "You're Getting Cancelled!", emoji: '\u{1F631}', description: 'An old tweet resurfaced. Twitter is NOT happy.', choices: [
    { label: 'Apologize', effect: { reputation: -5, followers: -10000 }, resultText: 'Apology helped but lost followers.' },
    { label: 'Double down', effect: { reputation: -20, followers: 30000 }, resultText: 'Lost respect but gained hate-followers.' },
    { label: 'Go silent', effect: { followers: -5000 }, resultText: 'It blew over. Could have been worse.' },
  ]},
  { id: 'viral', title: 'You Went VIRAL!', emoji: '\u{1F680}', description: 'Your post is blowing up!', choices: [
    { label: 'Ride the wave!', effect: { followers: 80000, energy: -30 }, resultText: 'Massive growth!' },
    { label: 'Play it cool', effect: { followers: 40000, reputation: 5 }, resultText: 'Solid growth and good vibes.' },
  ]},
  { id: 'copycat', title: 'Someone Copied You!', emoji: '\u{1F624}', description: 'A bigger creator stole your idea.', choices: [
    { label: 'Call them out', effect: { followers: 25000, reputation: -5 }, resultText: 'Drama brought attention.' },
    { label: 'Let it go', effect: { reputation: 10, energy: 10 }, resultText: 'High road. Real fans noticed.' },
  ]},
  { id: 'algo', title: 'Algorithm Change!', emoji: '\u{1F4C9}', description: 'Platform changed its algorithm.', choices: [
    { label: 'Adapt strategy', effect: { energy: -20, followers: 10000 }, resultText: 'Figured out the new algorithm!' },
    { label: 'Complain online', effect: { followers: -5000, reputation: -5 }, resultText: 'Nobody likes a complainer.' },
  ]},
  { id: 'meetup', title: 'Fan Meetup!', emoji: '\u{1F389}', description: 'Fans want to meet you IRL!', choices: [
    { label: 'Host it!', effect: { money: -1000, followers: 20000, reputation: 15 }, resultText: 'Amazing event! Community loves you!' },
    { label: 'Rain check', effect: { reputation: -3 }, resultText: 'Fans are a bit disappointed.' },
  ]},
]

const WIN = 1_000_000
const MAX_DAYS = 30

function init(platform: Platform): GameState {
  return { day: 1, followers: 100, energy: 100, money: 500, reputation: 50, platform, isGameOver: false, isWin: false }
}

export function useCloutChase() {
  const state = ref<GameState>(init('tiktok'))
  const gameStarted = ref(false)
  const currentEvent = ref<RandomEvent | null>(null)
  const eventResult = ref<string | null>(null)
  const dayLog = ref<string[]>([])
  const followerProgress = computed(() => Math.min((state.value.followers / WIN) * 100, 100))

  function fmt(n: number): string {
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M'
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K'
    return n.toString()
  }

  function startGame(p: Platform) { state.value = init(p); gameStarted.value = true; currentEvent.value = null; eventResult.value = null; dayLog.value = [] }

  function postContent(c: ContentChoice) {
    if (state.value.energy < c.energyCost && c.energyCost > 0) return
    if (state.value.isGameOver) return
    const gain = c.followerGain()
    state.value.energy = Math.max(0, Math.min(100, state.value.energy - c.energyCost))
    state.value.followers = Math.max(0, state.value.followers + gain)
    state.value.money += c.moneyGain
    state.value.reputation = Math.max(0, Math.min(100, state.value.reputation + c.reputationChange))
    dayLog.value.unshift('Day ' + state.value.day + ': ' + c.emoji + ' ' + c.label + ' -> ' + (gain >= 0 ? '+' : '') + fmt(gain))
    advance()
  }

  function advance() {
    state.value.day++
    if (state.value.followers >= WIN) { state.value.isGameOver = true; state.value.isWin = true; return }
    if (state.value.day > MAX_DAYS) { state.value.isGameOver = true; state.value.isWin = false; return }
    if (Math.random() < 0.3) currentEvent.value = EVENTS[Math.floor(Math.random() * EVENTS.length)]
  }

  function handleEvent(c: RandomEvent['choices'][0]) {
    if (c.effect.followers) state.value.followers = Math.max(0, state.value.followers + c.effect.followers)
    if (c.effect.energy) state.value.energy = Math.max(0, Math.min(100, state.value.energy + c.effect.energy))
    if (c.effect.money) state.value.money += c.effect.money
    if (c.effect.reputation) state.value.reputation = Math.max(0, Math.min(100, state.value.reputation + c.effect.reputation))
    eventResult.value = c.resultText
  }

  function dismissEvent() { currentEvent.value = null; eventResult.value = null }
  function reset() { gameStarted.value = false; state.value = init('tiktok'); currentEvent.value = null; eventResult.value = null; dayLog.value = [] }

  return { state, gameStarted, currentEvent, eventResult, dayLog, followerProgress, choices: CONTENT_CHOICES, startGame, postContent, handleEvent, dismissEvent, reset, fmt }
}
