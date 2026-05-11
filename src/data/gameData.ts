import type { Upgrade, ClickerPlatform, Achievement } from '../types/clicker'

export const UPGRADES: Upgrade[] = [
  { id: 'selfie', name: 'Ring Light', emoji: '💡', description: 'Better lighting = more fans', baseCost: 10, costMultiplier: 1.15, fansPerSecond: 1, owned: 0 },
  { id: 'editor', name: 'Video Editor', emoji: '🎬', description: 'Pro edits go viral', baseCost: 100, costMultiplier: 1.15, fansPerSecond: 5, owned: 0 },
  { id: 'collab', name: 'Collab Partner', emoji: '🤝', description: 'Two creators > one', baseCost: 500, costMultiplier: 1.15, fansPerSecond: 20, owned: 0 },
  { id: 'manager', name: 'Talent Manager', emoji: '🕴️', description: 'Handles the boring stuff', baseCost: 2000, costMultiplier: 1.15, fansPerSecond: 50, owned: 0 },
  { id: 'studio', name: 'Content Studio', emoji: '🏠', description: 'Your own creator house', baseCost: 10000, costMultiplier: 1.15, fansPerSecond: 200, owned: 0 },
  { id: 'brand', name: 'Brand Deal', emoji: '💰', description: 'Sponsors bring exposure', baseCost: 50000, costMultiplier: 1.15, fansPerSecond: 1000, owned: 0 },
]

export const PLATFORMS: ClickerPlatform[] = [
  { id: 'tiktok', name: 'TikTok', emoji: '🎵', unlockAt: 0, multiplier: 1, unlocked: true },
  { id: 'instagram', name: 'Instagram', emoji: '📸', unlockAt: 1000, multiplier: 1.5, unlocked: false },
  { id: 'youtube', name: 'YouTube', emoji: '▶️', unlockAt: 10000, multiplier: 2, unlocked: false },
  { id: 'twitch', name: 'Twitch', emoji: '🎮', unlockAt: 100000, multiplier: 3, unlocked: false },
  { id: 'podcast', name: 'Podcast', emoji: '🎙️', unlockAt: 500000, multiplier: 5, unlocked: false },
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_post', title: 'First Post!', emoji: '📱', description: 'Create your first content', condition: (_fans: number, clicks: number) => clicks >= 1, unlocked: false },
  { id: 'hundred', title: 'Micro Influencer', emoji: '⭐', description: 'Reach 100 fans', condition: (fans: number) => fans >= 100, unlocked: false },
  { id: 'thousand', title: 'Rising Star', emoji: '🌟', description: 'Reach 1K fans', condition: (fans: number) => fans >= 1000, unlocked: false },
  { id: 'tenk', title: 'Verified', emoji: '✅', description: 'Reach 10K fans', condition: (fans: number) => fans >= 10000, unlocked: false },
  { id: 'hundredk', title: 'Going Viral', emoji: '🔥', description: 'Reach 100K fans', condition: (fans: number) => fans >= 100000, unlocked: false },
  { id: 'million', title: 'Mega Star', emoji: '👑', description: 'Reach 1M fans', condition: (fans: number) => fans >= 1000000, unlocked: false },
  { id: 'clicker', title: 'Content Machine', emoji: '⚡', description: 'Click 500 times', condition: (_fans: number, clicks: number) => clicks >= 500, unlocked: false },
]
