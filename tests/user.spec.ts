import { test, expect } from 'playwright-test-coverage';

let currentUser: any;
const token = 'mock-token';

test.describe('updateUser', () => {
  test.beforeAll(async () => {
    const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;

    currentUser = {
      id: 1,
      name: 'pizza diner',
      email,
    };
  });

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth', async (route, request) => {
      if (request.method() === 'POST') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: currentUser,
            token,
          }),
        });
      }
    });

    await page.route('**/api/user/*', async (route, request) => {
      if (request.method() === 'PUT') {
        const body = JSON.parse(request.postData() || '{}');

        currentUser = {
          ...currentUser,
          ...body,
        };

        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: currentUser,
            token,
          }),
        });
      }
    });

    await page.route('**/api/user/me', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(currentUser),
      });
    });

    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill(currentUser.name);
    await page.getByRole('textbox', { name: 'Email address' }).fill(currentUser.email);
    await page.getByRole('textbox', { name: 'Password' }).fill('diner');
    await page.getByRole('button', { name: 'Register' }).click();

    await page.getByRole('link', { name: 'pd' }).click();
  });

  test('shows current user info', async ({ page }) => {
    await expect(page.getByRole('main')).toContainText('pizza diner');
  });

  test('closes edit modal without changes', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.locator('h3')).toContainText('Edit user');

    await page.getByRole('button', { name: 'Update' }).click();
    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza diner');
  });

  test('updates only the name', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();

    await page.getByRole('textbox').first().fill('pizza dinerx');
    await page.getByRole('button', { name: 'Update' }).click();

    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza dinerx');
  });

  test('updates name, email and password', async ({ page }) => {
    const updatedEmail = `updated${Math.floor(Math.random() * 10000)}@jwt.com`;
    const updatedPassword = 'newpassword';

    await page.getByRole('button', { name: 'Edit' }).click();

    await page.getByRole('textbox').nth(0).fill('pizza diner updated');
    await page.getByRole('textbox').nth(1).fill(updatedEmail);
    await page.getByRole('textbox').nth(2).fill(updatedPassword);

    await page.getByRole('button', { name: 'Update' }).click();
    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza diner updated');
    await expect(page.getByRole('main')).toContainText(updatedEmail);
  });
});
