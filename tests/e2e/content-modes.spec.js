import { test, expect } from '@playwright/test';
import { openApp } from './helpers/app.js';

test('Wi-Fi mode composes the encoded string', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Wi-Fi' }).click();
  await page.locator('[data-f="ssid"]').fill('Home;Net');
  await page.locator('[data-f="password"]').fill('pa:ss');
  await expect(page.locator('#qr-data')).toHaveValue('WIFI:T:WPA;S:Home\\;Net;P:pa\\:ss;;');
  await page.locator('[data-sec="nopass"]').click();
  await expect(page.locator('#qr-data')).toHaveValue('WIFI:T:nopass;S:Home\\;Net;;');
});

test('Email, Phone and SMS compose their schemes', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Email' }).click();
  await page.locator('[data-f="to"]').fill('a@b.co');
  await page.locator('[data-f="subject"]').fill('Hi there');
  await expect(page.locator('#qr-data')).toHaveValue('mailto:a@b.co?subject=Hi%20there');
  await page.getByRole('button', { name: 'Phone' }).click();
  await page.locator('[data-f="number"]').fill('+1 (555) 123-4567');
  await expect(page.locator('#qr-data')).toHaveValue('tel:+15551234567');
  await page.getByRole('button', { name: 'SMS' }).click();
  await page.locator('[data-f="number"]').fill('555 1234');
  await page.locator('[data-f="message"]').fill('hello');
  await expect(page.locator('#qr-data')).toHaveValue('SMSTO:5551234:hello');
});

test('switching back to Text restores the typed text', async ({ page }) => {
  await openApp(page);
  await page.locator('#qr-data').fill('my text');
  await page.getByRole('button', { name: 'Phone' }).click();
  await page.getByRole('button', { name: 'Text' }).click();
  await expect(page.locator('#qr-data')).toBeVisible();
  await expect(page.locator('#qr-data')).toHaveValue('my text');
});
