import { test, expect } from '@playwright/test';
import { openApp, openSection } from './helpers/app.js';
import { getPreviewSignature } from './helpers/preview.js';

const pinBtn = (page, key) => page.locator(`[data-pin-action="${key}"]`);
const pinned = (page, key) => page.locator(`#pinned-controls [data-pinned-key="${key}"]`);

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

test('dock is hidden when nothing is pinned', async ({ page }) => {
  await expect(page.locator('#pinned-controls')).toBeHidden();
});

test('only the five approved controls can be pinned', async ({ page }) => {
  await expect(page.locator('[data-pin-action]')).toHaveCount(5);
});

test('pinned module shape and the native control share one value', async ({ page }) => {
  await pinBtn(page, 'module-shape').click();
  await expect(pinned(page, 'module-shape')).toBeVisible();
  await expect(pinBtn(page, 'module-shape')).toHaveAttribute('aria-pressed', 'true');

  const before = await getPreviewSignature(page);
  await pinned(page, 'module-shape').getByRole('button', { name: 'Dots' }).click();
  await expect(page.locator('#dot-style-grid .style-btn[data-value="dots"]')).toHaveClass(/active/);
  await expect.poll(() => getPreviewSignature(page)).not.toBe(before);

  await page.locator('#dot-style-grid .style-btn[data-value="rounded"]').click();
  await expect(pinned(page, 'module-shape').getByRole('button', { name: 'Rounded', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('native controls stay in their home sections after pinning', async ({ page }) => {
  await pinBtn(page, 'module-shape').click();
  await expect(page.locator('[data-inspector-section="style"] #dot-style-grid')).toHaveCount(1);
  await expect(page.locator('#pinned-controls #dot-style-grid')).toHaveCount(0);
  await expect(page.locator('[data-inspector-section="style"]')).toBeVisible();
  await expect(page.locator('#qr-data')).toHaveValue('https://example.com');
});

test('pins persist in order and survive reload', async ({ page }) => {
  await pinBtn(page, 'module-shape').click();
  await openSection(page, 'output');
  await pinBtn(page, 'output-size').click();
  await page.getByRole('button', { name: /Move Output · Output size up/ }).click();
  expect(await page.evaluate(() => localStorage.getItem('qr-studio:pins:v1'))).toBe(
    JSON.stringify(['output-size', 'module-shape'])
  );
  await page.reload();
  await expect(page.locator('#pinned-controls [data-pinned-key]').first()).toHaveAttribute('data-pinned-key', 'output-size');
});

test('stale or malformed storage fails safely', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('qr-studio:pins:v1', JSON.stringify(['module-shape', 'removed-key', 'module-shape'])));
  await page.reload();
  await expect(pinned(page, 'module-shape')).toBeVisible();
  await expect(page.locator('[data-pinned-key="removed-key"]')).toHaveCount(0);
  await expect(page.locator('#pinned-controls [data-pinned-key]')).toHaveCount(1);

  await page.evaluate(() => localStorage.setItem('qr-studio:pins:v1', '{not json'));
  await page.reload();
  await expect(page.locator('#qr-preview canvas, #qr-preview svg').first()).toBeVisible();
  await expect(page.locator('#pinned-controls')).toBeHidden();
});

test('unpinning the last pin hides the dock; collapse keeps pins', async ({ page }) => {
  await pinBtn(page, 'module-shape').click();
  await page.getByRole('button', { name: 'Collapse pinned controls' }).click();
  await expect(pinned(page, 'module-shape')).toHaveCount(0);
  await page.getByRole('button', { name: 'Expand pinned controls' }).click();
  await expect(pinned(page, 'module-shape')).toBeVisible();
  await page.getByRole('button', { name: /Unpin Style · Module shape/ }).click();
  await expect(page.locator('#pinned-controls')).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('qr-studio:pins:v1'))).toBe('[]');
});

test('pin actions are keyboard reachable', async ({ page }) => {
  await pinBtn(page, 'module-shape').focus();
  await page.keyboard.press('Enter');
  await expect(pinned(page, 'module-shape')).toBeVisible();
  await page.getByRole('button', { name: /Unpin Style · Module shape/ }).focus();
  await expect(page.getByRole('button', { name: /Unpin Style · Module shape/ })).toBeFocused();
});

test('presets update pinned shape and color mirrors', async ({ page }) => {
  await pinBtn(page, 'module-shape').click();
  await openSection(page, 'colors');
  await pinBtn(page, 'primary-color').click();
  await openSection(page, 'style');
  await page.locator('.preset-btn[data-preset="dots"]').click();
  await expect(pinned(page, 'module-shape').getByRole('button', { name: 'Dots' })).toHaveAttribute('aria-pressed', 'true');
  await expect(pinned(page, 'primary-color').locator('input[type="color"]')).toHaveValue('#333333');
});

test('logo automation updates a pinned error correction', async ({ page }) => {
  await openSection(page, 'scan-quality');
  await pinBtn(page, 'error-correction').click();
  const level = (l) => pinned(page, 'error-correction').locator(`[data-level="${l}"]`);
  await openSection(page, 'logo');
  await page.locator('#logo-upload').setInputFiles('tests/e2e/fixtures/logo.svg');
  await expect(level('H')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#logo-remove').click();
  await expect(level('Q')).toHaveAttribute('aria-pressed', 'true');
});

test('pinned ranges stay interactive across section changes', async ({ page }) => {
  await openSection(page, 'scan-quality');
  await pinBtn(page, 'quiet-zone').click();
  await openSection(page, 'output');
  await pinBtn(page, 'output-size').click();
  await openSection(page, 'style');
  await pinned(page, 'quiet-zone').locator('input[type="range"]').fill('24');
  await pinned(page, 'output-size').locator('input[type="range"]').fill('450');
  await openSection(page, 'scan-quality');
  await expect(page.locator('#qr-margin')).toHaveValue('24');
  await expect(page.locator('#qr-margin-val')).toHaveText('24px');
  await openSection(page, 'output');
  await expect(page.locator('#qr-size')).toHaveValue('450');
});
