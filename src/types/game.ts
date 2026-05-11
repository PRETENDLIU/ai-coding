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

export type Platform = 'tiktok' | 'instagram' | 'youtube'

export interface ContentChoice {
  id: string
  label: string
  emoji: string
  description: string
  energyCost: number
  followerGain: () => number
  moneyGain: number
  reputationChange: number
}

export interface RandomEvent {
  id: string
  title: string
  emoji: string
  description: string
  choices: EventChoice[]
}

export interface EventChoice {
  label: string
  effect: Partial<Pick<GameState, 'followers' | 'energy' | 'money' | 'reputation'>>
  resultText: string
}

// Keep old exports for compatibility (unused but prevents deletion)
export type Upgrade = never
export type Achievement = never
