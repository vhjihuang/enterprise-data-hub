import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login form', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('企业级数据中心')
    await expect(page.locator('input[placeholder="请输入用户名"]')).toBeVisible()
    await expect(page.locator('input[placeholder="请输入密码"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText('登录')
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.click('button[type="submit"]')
    
    // 等待验证错误出现
    await expect(page.locator('.el-form-item__error')).toBeVisible()
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.fill('input[placeholder="请输入用户名"]', 'admin')
    await page.fill('input[placeholder="请输入密码"]', 'password')
    await page.click('button[type="submit"]')
    
    // 等待跳转到首页
    await expect(page).toHaveURL('/')
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[placeholder="请输入用户名"]', 'invalid')
    await page.fill('input[placeholder="请输入密码"]', 'wrong')
    await page.click('button[type="submit"]')
    
    // 等待错误消息出现
    await expect(page.locator('.el-message--error')).toBeVisible()
  })
}) 