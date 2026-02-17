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

    await page.goto('/');
  });

  //test: view users

  //test: delete users
});