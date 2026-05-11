import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App.vue', () => {
  it('渲染开始界面', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('CLOUT CHASE')
    expect(wrapper.text()).toContain('网红模拟器')
  })

  it('显示三个平台选择按钮', () => {
    const wrapper = mount(App)
    const buttons = wrapper.findAll('.plat-btn')
    expect(buttons.length).toBe(3)
    expect(wrapper.text()).toContain('TikTok')
    expect(wrapper.text()).toContain('Instagram')
    expect(wrapper.text()).toContain('YouTube')
  })

  it('点击平台按钮进入游戏', async () => {
    const wrapper = mount(App)
    await wrapper.find('.plat-btn').trigger('click')
    expect(wrapper.find('.top-bar').exists()).toBe(true)
    expect(wrapper.text()).toContain('Day 1/30')
  })

  it('游戏界面显示内容选择', async () => {
    const wrapper = mount(App)
    await wrapper.find('.plat-btn').trigger('click')
    expect(wrapper.text()).toContain('今天发什么？')
    expect(wrapper.findAll('.choice').length).toBeGreaterThan(0)
  })

  it('点击内容按钮推进游戏', async () => {
    const wrapper = mount(App)
    await wrapper.find('.plat-btn').trigger('click')
    const choices = wrapper.findAll('.choice')
    // 点击 vlog（低能量消耗，稳定）
    const vlog = choices.find(c => c.text().includes('Vlog'))
    if (vlog) {
      await vlog.trigger('click')
      expect(wrapper.text()).toContain('Day 2/30')
    }
  })

  it('技能面板可以打开和关闭', async () => {
    const wrapper = mount(App)
    await wrapper.find('.plat-btn').trigger('click')
    const skillBtn = wrapper.findAll('.tab-btn').find(b => b.text().includes('技能'))!
    await skillBtn.trigger('click')
    expect(wrapper.find('.skill-modal').exists()).toBe(true)
    await wrapper.find('.ev-dismiss').trigger('click')
    expect(wrapper.find('.skill-modal').exists()).toBe(false)
  })

  it('里程碑面板可以打开', async () => {
    const wrapper = mount(App)
    await wrapper.find('.plat-btn').trigger('click')
    const milestoneBtn = wrapper.findAll('.tab-btn').find(b => b.text().includes('里程碑'))!
    await milestoneBtn.trigger('click')
    expect(wrapper.text()).toContain('里程碑')
    expect(wrapper.find('.milestone-list').exists()).toBe(true)
  })
})
