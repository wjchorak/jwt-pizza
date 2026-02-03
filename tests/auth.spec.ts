import { test, expect } from 'playwright-test-coverage';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  await page.getByRole('link', { name: 'Register' }).click();
  await expect(page.getByRole('textbox', { name: 'Full name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('test');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('test@test.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('testpassword');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await expect(page.getByRole('link', { name: 't', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 't', exact: true }).click();
  await expect(page.getByRole('main')).toContainText('test');
  await expect(page.getByRole('main')).toContainText('test@test.com');
  await expect(page.getByRole('main')).toContainText('diner');
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
});