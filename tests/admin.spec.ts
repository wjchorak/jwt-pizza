import { Page } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';
import { User, Role } from '../src/service/pizzaService';

async function adminInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = { 'd@jwt.com': { id: '3', name: 'Kai Chen', email: 'd@jwt.com', password: 'a', roles: [{ role: Role.Admin }] } };
  
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = route.request().postDataJSON();
    const user = validUsers[loginReq.email];
    if (!user || user.password !== loginReq.password) {
      await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
      return;
    }
    loggedInUser = validUsers[loginReq.email];
    const loginRes = {
      user: loggedInUser,
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('PUT');
    await route.fulfill({ json: loginRes });
  });

  //franchises
  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    if(route.request().method() == 'GET') {
      const franchiseRes = {
        franchises: [
          {
            id: 2,
            name: 'LotaPizza',
            stores: [
              { id: 4, name: 'Lehi' },
              { id: 5, name: 'Springville' },
              { id: 6, name: 'American Fork' },
            ],
          },
          { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
          { id: 4, name: 'topSpot', stores: [] },
        ],
      };
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: franchiseRes });
    }
    else if(route.request().method() == 'POST') {
      const body = route.request().postDataJSON();

      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('admins');

      const franchiseRes = {
        id: 8,
        name: body.name,
        admins: body.admins.map((admin: { email: any; }, index: number) => ({
          id: index + 10,
          email: admin.email,
          name: 'pizza franchisee',
        })),
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: franchiseRes,
      });
    }
  });

  //store close
  await page.route(/\/api\/franchise\/\d+\/store\/\d+/, async (route) => {
    const request = route.request();
  
    expect(request.method()).toBe('DELETE');

    const storeDeletionResponse = { message: 'store deleted' };

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: storeDeletionResponse,
    });
  });


  await page.goto('/');
}

test('franchises', async ({ page }) => {
  await adminInit(page);

  //login
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  //add franchise
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('textbox', { name: 'Filter franchises' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('testfranchise');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('d@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();

  //close store
  await page.getByRole('row', { name: 'Spanish Fork ₿ Close' }).getByRole('button').click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('heading', { name: 'Franchises' })).toBeVisible();
});