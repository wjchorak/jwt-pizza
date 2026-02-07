import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/');

  //homepage
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Order now' })).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Pizza is an absolute delight that brings joy to people of all ages. The perfect combination of crispy crust, savory sauce, and gooey cheese makes pizza an irresistible treat. At JWT Pizza, we take pride in serving the web\'s best pizza, crafted with love and passion. Our skilled chefs use only the finest ingredients to create mouthwatering pizzas that will leave you craving for more. Whether you prefer classic flavors or adventurous toppings, our diverse menu has something for everyone. So why wait? Indulge in the pizza experience of a lifetime and visit JWT Pizza today!');
  await expect(page.getByRole('main').getByRole('img')).toBeVisible();
  await expect(page.getByText('© 2024 JWT Pizza LTD. All')).toBeVisible();

  //about
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByRole('main')).toContainText('The secret sauce');
  await expect(page.getByRole('img').nth(3)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Our employees' })).toBeVisible();

  //history
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
  await expect(page.getByRole('main').getByRole('img')).toBeVisible();

  //docs
  await page.goto('/docs');
  await expect(page.getByRole('link', { name: 'docs' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '[POST] /api/auth' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '[PUT] /api/auth' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '🔐 [DELETE] /api/auth' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '🔐 [GET] /api/user/me' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '🔐 [PUT] /api/user/:userId' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '[GET] /api/order/menu' })).toBeVisible();
  await expect(page.getByRole('heading')).toContainText('JWT Pizza API');
  await expect(page.getByRole('main')).toContainText('factory: https://pizza-factory.cs329.click');
});