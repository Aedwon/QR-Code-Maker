import { expect } from '@playwright/test';

export async function openApp(page) {
  await page.goto('/');
  await expect(page.locator('#qr-preview canvas, #qr-preview svg').first()).toBeVisible();
}

// Legacy UI collapses most sections; expand them all so controls are reachable.
export async function expandAllSections(page) {
  const headers = page.locator('.section-header[aria-expanded="false"]');
  while (await headers.count()) await headers.first().click();
}
