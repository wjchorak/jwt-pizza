import { Page } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';
import { User, Role } from '../src/service/pizzaService';

let users : any[];
const token = 'mock-token';

test.describe('admin dashboard users', () => {
  test.beforeEach(async ({ page }) => {
    users = [
      { id: 1, name: 'pizza diner1', email: 'diner@test.com', roles: [{ role: 'diner' }] },
      { id: 2, name: 'admin user', email: 'admin@test.com', roles: [{ role: 'admin' }] },
      { id: 3, name: 'pizza diner2', email: 'diner2@test.com', roles: [{ role: 'diner' }] },
      { id: 4, name: 'pizza diner3', email: 'diner3@test.com', roles: [{ role: 'diner' }] },
      { id: 5, name: 'pizza diner4', email: 'diner4@test.com', roles: [{ role: 'diner' }] },
      { id: 6, name: 'pizza diner5', email: 'diner5@test.com', roles: [{ role: 'diner' }] },
      { id: 7, name: 'pizza diner6', email: 'diner6@test.com', roles: [{ role: 'diner' }] },
      { id: 8, name: 'pizza diner7', email: 'diner7@test.com', roles: [{ role: 'diner' }] },
      { id: 9, name: 'pizza diner8', email: 'diner8@test.com', roles: [{ role: 'diner' }] },
      { id: 10, name: 'pizza diner9', email: 'diner9@test.com', roles: [{ role: 'diner' }] },
      { id: 11, name: 'pizza diner10', email: 'diner10@test.com', roles: [{ role: 'diner' }] },
    ];

    await page.route('**/api/auth', async (route, request) => {
      if (request.method() === 'PUT') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: {
              id: 99,
              name: 'Admin',
              email: 'admin@jwt.com',
              roles: [{ role: 'admin' }],
            },
            token,
          }),
        });
      }
    });

    await page.route('**/api/user*', async (route, request) => {
      const url = new URL(request.url());
      const pageParam = Number(url.searchParams.get('page') || 0);
      const limitParam = Number(url.searchParams.get('limit') || 3);
      const nameFilter = url.searchParams.get('name')?.replace(/\*/g, '').toLowerCase() || '';

      let filtered = users.filter((u) => u.name.toLowerCase().includes(nameFilter));
      let offset = pageParam * limitParam;
      let paginated = filtered.slice(offset, offset + limitParam + 1);
      const more = paginated.length > limitParam;
      if (more) paginated = paginated.slice(0, limitParam);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ users: paginated, more }),
      });
    });

    await page.route('**/api/user/*', async (route, request) => {
      if (request.method() === 'DELETE') {
        const id = Number(request.url().split('/').pop());
        users = users.filter((u) => u.id !== id);

        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'user deleted' }),
        });
      }
    });

    await page.goto('/');
  });

  test('admin can view paginated users', async ({ page }) => {
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('admin@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
    await page.getByRole('link', { name: 'Admin' }).click();

    await expect(page.getByRole('main')).toContainText('Users');
    await expect(page.getByRole('table').first()).toContainText('pizza diner1');
    await expect(page.getByRole('table').first()).toContainText('admin user');
    await expect(page.getByRole('table').first()).toContainText('pizza diner2');
    await expect(page.getByRole('table').first()).toContainText('diner@test.com');
    await expect(page.getByRole('table').first()).toContainText('diner');

    await expect(page.getByRole('button', { name: '»' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: '«' }).first()).toBeVisible();
  });

  test('admin can delete a user', async ({ page }) => {
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('admin@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'Admin' }).click();

    await expect(page.getByRole('table').first()).toContainText('pizza diner1');

    await page
      .getByRole('row', { name: /pizza diner1/i })
      .getByRole('button')
      .click();

    await expect(page.getByRole('table').first()).not.toContainText('pizza diner1');
  });
});