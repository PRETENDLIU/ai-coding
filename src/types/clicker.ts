export interface Upgrade {
  id: string
  name: string
  emoji: string
  description: string
  baseCost: number
  costMultiplier: number
  fansPerSecond: number
  owned: number
}

export interface ClickerPlatform {
  id: string
  name: string
  emoji: string
  unlockAt: number
  multiplier: number
  unlocked: boolean
}

export interface Achievement {
  id: string
  title: string
  emoji: string
  description: string
  condition: (fans: number, clicks: number) => boolean
  unlocked: boolean
}

export interface ClickerState {
  fans: number
  totalFans: number
  totalClicks: number
  fansPerClick: number
  fansPerSecond: number
  upgrades: Upgrade[]
  platforms: ClickerPlatform[]
  achievements: Achievement[]
  viralMultiplier: number
}
