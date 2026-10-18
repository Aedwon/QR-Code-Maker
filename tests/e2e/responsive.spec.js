import { test, expect } from '@playwright/test';
import { openApp } from './helpers/app.js';

test('899px uses temporary panels', async ({ page }) => {
  await page.setViewportSize({ width: 899, height: 800 });
  await openApp(page);
  await expect(page.locator('#open-navigation')).toBeVisible();
  await expect(page.locator('#open-inspector')).toBeVisible();
  await expect(page.locator('#app-nav')).not.toBeVisible();
  await expect(page.locator('#app-inspector')).not.toBeVisible();
});

test('900px keeps all three zones permanently visible', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 800 });
  await openApp(page);
  await expect(page.locator('#app-nav')).toBeVisible();
  await expect(page.locator('#workspace')).toBeVisible();
  await expect(page.locator('#app-inspector')).toBeVisible();
  await expect(page.locator('#open-navigation')).toBeHidden();
  await expect(page.locator('#open-inspector')).toBeHidden();
});

for (const [name, size] of [['tablet', { width: 768, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  test(`${name}: choosing a feature hands Navigation directly to Inspector`, async ({ page }) => {
    await page.setViewportSize(size);
    await openApp(page);
    await page.locator('#open-navigation').click();
    await expect(page.locator('#app-nav')).toBeVisible();
    await page.locator('[data-feature="colors"]').click();
    await expect(page.locator('#app-nav')).not.toBeVisible();
    await expect(page.locator('#app-inspector')).toBeVisible();
    await expect(page.locator('[data-inspector-section="colors"]')).toBeVisible();
    await expect(page.locator('#inspector-title')).toBeFocused();
  });
}

test('selecting the already-active feature still opens Inspector', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await openApp(page);
  await page.locator('#open-navigation').click();
  await page.locator('[data-feature="style"]').click();
  await expect(page.locator('#app-inspector')).toBeVisible();
  await page.locator('#close-inspector').click();
  await page.locator('#open-navigation').click();
  await page.locator('[data-feature="style"]').click();
  await expect(page.locator('#app-inspector')).toBeVisible();
});

test('appearance change keeps temporary Navigation open', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  await page.locator('#open-navigation').click();
  await page.getByRole('button', { name: 'Dark appearance' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('#app-nav')).toBeVisible();
});

test('pin dock lives inside the temporary Inspector', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  await page.locator('#open-inspector').click();
  await page.locator('[data-pin-action="module-shape"]').click();
  await expect(page.locator('#app-inspector #pinned-controls')).toBeVisible();
});

test('crossing 900px normalizes to the permanent layout', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 800 });
  await openApp(page);
  await page.locator('#open-inspector').click();
  await expect(page.locator('#panel-backdrop')).toBeVisible();
  await page.setViewportSize({ width: 1000, height: 800 });
  await expect(page.locator('#panel-backdrop')).toBeHidden();
  await expect(page.locator('#app-nav')).toBeVisible();
  await expect(page.locator('#app-inspector')).toBeVisible();
  await expect(page.locator('#workspace')).toHaveJSProperty('inert', false);
  await expect(page.locator('html')).not.toHaveClass(/scroll-lock/);
});

test('touch targets are at least 44px on phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  for (const sel of ['#open-navigation', '#open-inspector']) {
    const box = await page.locator(sel).boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  await page.locator('#open-navigation').click();
  for (const sel of ['[data-feature="style"]', '#close-navigation', '#terms-link']) {
    const box = await page.locator(sel).boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});
