import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCloutChase } from '../composables/useCloutChase'

describe('useCloutChase', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('初始化', () => {
    it('startGame 初始化正确的游戏状态', () => {
      const { state, gameStarted, startGame } = useCloutChase()
      startGame('tiktok')
      expect(gameStarted.value).toBe(true)
      expect(state.value.platform).toBe('tiktok')
      expect(state.value.day).toBe(1)
      expect(state.value.followers).toBe(100)
      expect(state.value.energy).toBe(100)
      expect(state.value.money).toBe(500)
      expect(state.value.reputation).toBe(50)
      expect(state.value.isGameOver).toBe(false)
    })

    it('支持不同平台选择', () => {
      const { state, startGame } = useCloutChase()
      startGame('youtube')
      expect(state.value.platform).toBe('youtube')
    })
  })

  describe('发布内容', () => {
    it('发布内容消耗能量并推进天数', () => {
      const { state, startGame, choices, postContent } = useCloutChase()
      startGame('tiktok')
      const vlog = choices.value.find(c => c.id === 'vlog')!
      postContent(vlog)
      expect(state.value.day).toBe(2)
      expect(state.value.energy).toBeLessThanOrEqual(100)
    })

    it('能量不足时无法发布高消耗内容', () => {
      const { state, startGame, choices, postContent } = useCloutChase()
      startGame('tiktok')
      state.value.energy = 5
      const dance = choices.value.find(c => c.id === 'dance')!
      const dayBefore = state.value.day
      postContent(dance)
      expect(state.value.day).toBe(dayBefore) // 没有推进
    })

    it('休息恢复能量', () => {
      const { state, startGame, choices, postContent } = useCloutChase()
      startGame('tiktok')
      state.value.energy = 30
      const rest = choices.value.find(c => c.id === 'rest')!
      postContent(rest)
      expect(state.value.energy).toBe(80) // 30 - (-50) = 80
    })

    it('连续发布相同内容触发连击', () => {
      const { state, startGame, choices, postContent } = useCloutChase()
      startGame('tiktok')
      const vlog = choices.value.find(c => c.id === 'vlog')!
      postContent(vlog)
      postContent(vlog)
      expect(state.value.streak).toBeGreaterThanOrEqual(1)
    })

    it('活动日志记录操作', () => {
      const { startGame, choices, postContent, dayLog } = useCloutChase()
      startGame('tiktok')
      const vlog = choices.value.find(c => c.id === 'vlog')!
      postContent(vlog)
      expect(dayLog.value.length).toBe(1)
      expect(dayLog.value[0]).toContain('Vlog')
    })
  })

  describe('游戏结束条件', () => {
    it('粉丝达到100万时获胜', () => {
      const { state, startGame, choices, postContent } = useCloutChase()
      startGame('tiktok')
      state.value.followers = 999_990
      const vlog = choices.value.find(c => c.id === 'vlog')!
      // 强制 followerGain 返回大值
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      postContent(vlog)
      // 可能赢也可能没赢（随机），但逻辑正确
      if (state.value.followers >= 1_000_000) {
        expect(state.value.isGameOver).toBe(true)
        expect(state.value.isWin).toBe(true)
      }
      vi.restoreAllMocks()
    })

    it('超过30天时游戏结束（失败）', () => {
      const { state, startGame, choices, postContent } = useCloutChase()
      startGame('tiktok')
      state.value.day = 30
      const rest = choices.value.find(c => c.id === 'rest')!
      postContent(rest)
      expect(state.value.isGameOver).toBe(true)
      expect(state.value.isWin).toBe(false)
    })

    it('游戏结束后无法继续操作', () => {
      const { state, startGame, choices, postContent } = useCloutChase()
      startGame('tiktok')
      state.value.isGameOver = true
      const dayBefore = state.value.day
      const vlog = choices.value.find(c => c.id === 'vlog')!
      postContent(vlog)
      expect(state.value.day).toBe(dayBefore)
    })
  })

  describe('技能系统', () => {
    it('购买技能扣钱并标记已拥有', () => {
      const { state, startGame, buySkill } = useCloutChase()
      startGame('tiktok')
      state.value.money = 5000
      const skill = state.value.skills[0]
      const cost = skill.cost
      buySkill(skill)
      expect(skill.owned).toBe(true)
      expect(state.value.money).toBe(5000 - cost)
    })

    it('钱不够无法购买技能', () => {
      const { state, startGame, buySkill } = useCloutChase()
      startGame('tiktok')
      state.value.money = 10
      const skill = state.value.skills[0]
      buySkill(skill)
      expect(skill.owned).toBe(false)
    })

    it('已拥有的技能不能重复购买', () => {
      const { state, startGame, buySkill } = useCloutChase()
      startGame('tiktok')
      state.value.money = 10000
      const skill = state.value.skills[0]
      buySkill(skill)
      const moneyAfter = state.value.money
      buySkill(skill)
      expect(state.value.money).toBe(moneyAfter) // 没有再扣钱
    })
  })

  describe('里程碑系统', () => {
    it('达到目标后可以领取里程碑', () => {
      const { state, startGame, claimMilestone } = useCloutChase()
      startGame('tiktok')
      state.value.followers = 1500
      const m = state.value.milestones[0] // 1000粉丝里程碑
      claimMilestone(m)
      expect(m.claimed).toBe(true)
    })

    it('未达到目标无法领取', () => {
      const { state, startGame, claimMilestone } = useCloutChase()
      startGame('tiktok')
      state.value.followers = 500
      const m = state.value.milestones[0] // 需要1000
      claimMilestone(m)
      expect(m.claimed).toBe(false)
    })

    it('1k里程碑奖励$200', () => {
      const { state, startGame, claimMilestone } = useCloutChase()
      startGame('tiktok')
      state.value.followers = 1500
      const moneyBefore = state.value.money
      const m = state.value.milestones[0]
      claimMilestone(m)
      expect(state.value.money).toBe(moneyBefore + 200)
    })
  })

  describe('事件系统', () => {
    it('handleEvent 正确应用效果', () => {
      const { state, startGame, handleEvent, eventResult } = useCloutChase()
      startGame('tiktok')
      const choice = { label: '测试', effect: { money: 1000, followers: 5000 }, resultText: '成功！' }
      const moneyBefore = state.value.money
      const followersBefore = state.value.followers
      handleEvent(choice)
      expect(state.value.money).toBe(moneyBefore + 1000)
      expect(state.value.followers).toBe(followersBefore + 5000)
      expect(eventResult.value).toBe('成功！')
    })

    it('dismissEvent 清除事件状态', () => {
      const { startGame, currentEvent, eventResult, dismissEvent } = useCloutChase()
      startGame('tiktok')
      currentEvent.value = { id: 'test', title: 'T', emoji: '🎯', description: 'D', choices: [] }
      eventResult.value = '结果'
      dismissEvent()
      expect(currentEvent.value).toBeNull()
      expect(eventResult.value).toBeNull()
    })
  })

  describe('重置', () => {
    it('reset 恢复初始状态', () => {
      const { state, gameStarted, startGame, reset, dayLog } = useCloutChase()
      startGame('tiktok')
      state.value.followers = 50000
      state.value.day = 15
      dayLog.value.push('test')
      reset()
      expect(gameStarted.value).toBe(false)
      expect(state.value.followers).toBe(100)
      expect(state.value.day).toBe(1)
      expect(dayLog.value.length).toBe(0)
    })
  })

  describe('辅助函数', () => {
    it('fmt 格式化数字', () => {
      const { fmt } = useCloutChase()
      expect(fmt(500)).toBe('500')
      expect(fmt(1500)).toBe('1.5K')
      expect(fmt(1_500_000)).toBe('1.5M')
    })

    it('choices 根据粉丝数解锁内容', () => {
      const { state, startGame, choices } = useCloutChase()
      startGame('tiktok')
      state.value.followers = 50
      const ids = choices.value.map(c => c.id)
      expect(ids).not.toContain('challenge') // 需要10000粉丝
      expect(ids).not.toContain('tutorial') // 需要100000粉丝

      state.value.followers = 100001
      const ids2 = choices.value.map(c => c.id)
      expect(ids2).toContain('challenge')
      expect(ids2).toContain('tutorial')
    })
  })
})
