import { test as setup, expect } from '@playwright/test';
import fs from 'fs/promises';

const authFile = 'playwright/.auth/user.json';

setup('authenticate through the login API', async ({ request, browser }) => {
  const response = await request.post(process.env.API_LOGIN_URL, {
    data: {
      userEmail: process.env.API_USER_EMAIL,
      userPassword: process.env.API_USER_PASSWORD
    }
  });

  await expect(response).toBeOK();
  const responseBody = await response.json();
  expect(responseBody.token).toBeTruthy();

  await fs.mkdir('playwright/.auth', { recursive: true });

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript((token) => { window.localStorage.setItem('token', token); }, responseBody.token);
  await page.goto(process.env.BASE_URL);
  await context.storageState({ path: authFile });
  await context.close();
});