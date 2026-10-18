import { expect } from '@playwright/test';

export async function openApp(page) {
  await page.goto('/');
  await expect(page.locator('#qr-preview canvas, #qr-preview svg').first()).toBeVisible();
}

// Desktop (>=900px): choose an Inspector section from Navigation.
export async function openSection(page, feature) {
  await page.locator(`[data-feature="${feature}"]`).click();
  await expect(page.locator(`[data-inspector-section="${feature}"]`)).toBeVisible();
}
