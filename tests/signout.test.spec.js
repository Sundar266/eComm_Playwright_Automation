import { test, expect } from '../fixtures/test.fixture.js';

const loginRoute = `${process.env.BASE_URL}#/auth/login`;
const dashboardRoute = `${process.env.BASE_URL}#/dashboard/dash`;

test.describe('Sign Out Tests', { tag: '@Regression' }, () => {
  test('User can sign out from dashboard and return to login page', { tag: '@E2E' }, async ({ page, logger, actionValidation }) => {
    const signOutButton = page.getByRole('button', { name: /^Sign Out$/i });
    const loginInput = page.getByPlaceholder('email@example.com');

    await page.goto(process.env.BASE_URL);
    await page.waitForLoadState('networkidle');

    await actionValidation.validate([
      { type: 'url', expected: dashboardRoute },
      { type: 'locator', locator: page.getByRole('button', { name: /^HOME$/i }) }
    ]);

    await expect(signOutButton).toBeVisible();
    await signOutButton.click();

    await actionValidation.validate([
      { type: 'url', expected: loginRoute },
      { type: 'locator', locator: loginInput }
    ]);

    logger.info('User signed out successfully and the login page is visible');
  });

  test('Signed-out user cannot access protected dashboard route', async ({ page, logger, actionValidation }) => {
    const signOutButton = page.getByRole('button', { name: /^Sign Out$/i });
    const loginInput = page.getByPlaceholder('email@example.com');

    await page.goto(process.env.BASE_URL);
    await page.waitForLoadState('networkidle');

    await expect(signOutButton).toBeVisible();
    await signOutButton.click();

    await actionValidation.validate([
      { type: 'url', expected: loginRoute },
      { type: 'locator', locator: loginInput }
    ]);

    await page.goto(dashboardRoute);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(new RegExp('#/auth/login$'));
    await expect(loginInput).toBeVisible();

    logger.info('Protected dashboard route is blocked after sign out');
  });
});
