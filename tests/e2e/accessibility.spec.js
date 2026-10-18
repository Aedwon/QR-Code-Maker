import { test, expect } from '@playwright/test';
import { openApp } from './helpers/app.js';

test.describe('temporary surfaces', () => {
  test.use({ viewport: { width: 768, height: 900 } });

  test('Escape closes Inspector and returns focus to its trigger', async ({ page }) => {
    await openApp(page);
    await page.locator('#open-inspector').click();
    await expect(page.locator('#workspace')).toHaveJSProperty('inert', true);
    await expect(page.locator('#app-nav')).toHaveJSProperty('inert', true);
    await page.keyboard.press('Escape');
    await expect(page.locator('#app-inspector')).not.toBeVisible();
    await expect(page.locator('#open-inspector')).toBeFocused();
    await expect(page.locator('#workspace')).toHaveJSProperty('inert', false);
  });

  test('Escape closes Navigation and returns focus to its trigger', async ({ page }) => {
    await openApp(page);
    await page.locator('#open-navigation').click();
    await expect(page.locator('#close-navigation')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#app-nav')).not.toBeVisible();
    await expect(page.locator('#open-navigation')).toBeFocused();
  });

  test('handoff returns focus to the Inspector trigger only after Inspector closes', async ({ page }) => {
    await openApp(page);
    await page.locator('#open-navigation').click();
    await page.locator('[data-feature="logo"]').click();
    await expect(page.locator('#inspector-title')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#open-inspector')).toBeFocused();
  });

  test('backdrop click closes and body scroll is locked only while open', async ({ page }) => {
    await openApp(page);
    await page.locator('#open-inspector').click();
    await expect(page.locator('html')).toHaveClass(/scroll-lock/);
    await page.locator('#panel-backdrop').click({ position: { x: 10, y: 400 } });
    await expect(page.locator('#app-inspector')).not.toBeVisible();
    await expect(page.locator('html')).not.toHaveClass(/scroll-lock/);
  });

  test('inactive Inspector sections are hidden and inert while Inspector is open', async ({ page }) => {
    await openApp(page);
    await page.locator('#open-inspector').click();
    await expect(page.locator('[data-inspector-section="colors"]')).toBeHidden();
    await expect(page.locator('[data-inspector-section="colors"]')).toHaveJSProperty('inert', true);
  });
});

test('legal dialogs: semantics, Escape, focus return and inert background', async ({ page }) => {
  await openApp(page);
  const dialog = page.getByRole('dialog', { name: 'Privacy Policy' });
  await page.locator('#privacy-link').click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(page.locator('#privacy-close')).toBeFocused();
  await expect(page.locator('#app-shell')).toHaveJSProperty('inert', true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('#privacy-link')).toBeFocused();
  await expect(page.locator('#app-shell')).toHaveJSProperty('inert', false);

  await page.locator('#terms-link').click();
  await expect(page.getByRole('dialog', { name: 'Terms of Use' })).toBeVisible();
  await page.locator('#terms-close').click();
  await expect(page.locator('#terms-link')).toBeFocused();
});
