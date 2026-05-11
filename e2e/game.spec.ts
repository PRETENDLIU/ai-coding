import { test, expect } from '@playwright/test'

test.describe('Clout Chase 游戏', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('首页显示游戏标题和平台选择', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('CLOUT CHASE')
    await expect(page.getByText('选择你的平台')).toBeVisible()
    await expect(page.getByText('TikTok')).toBeVisible()
    await expect(page.getByText('Instagram')).toBeVisible()
    await expect(page.getByText('YouTube')).toBeVisible()
  })

  test('选择平台后进入游戏', async ({ page }) => {
    await page.getByText('TikTok').click()
    await expect(page.getByText('今天发什么？')).toBeVisible()
    await expect(page.getByText('Day 1/30')).toBeVisible()
  })

  test('游戏中可以发布内容', async ({ page }) => {
    await page.getByText('TikTok').click()
    // 点击第一个内容选项
    const firstChoice = page.locator('.choice').first()
    await firstChoice.click()
    // 日志应该有记录
    await expect(page.locator('.log-item').first()).toBeVisible()
  })

  test('可以打开技能面板', async ({ page }) => {
    await page.getByText('TikTok').click()
    await page.getByText('🎓 技能').click()
    await expect(page.getByText('技能树')).toBeVisible()
  })

  test('可以打开里程碑面板', async ({ page }) => {
    await page.getByText('TikTok').click()
    await page.getByRole('button', { name: '🏆 里程碑' }).click()
    await expect(page.getByRole('heading', { name: '里程碑' })).toBeVisible()
  })

  test('可以打开命令面板', async ({ page }) => {
    await page.getByText('⚙️ 自动化命令').click()
    await expect(page.locator('.modal')).toBeVisible()
  })
})
