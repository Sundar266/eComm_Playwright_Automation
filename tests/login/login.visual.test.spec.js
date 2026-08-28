import { test, expect } from '../../fixtures/test.fixture.js';
import { LoginPage } from '../../pages/LoginPage.js';

test.describe('Login Page Visual Tests', () => {
  test('Login page matches the visual baseline', async ({ page, logger }) => {
    const loginPage = new LoginPage(page, logger);
    await loginPage.open();

    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      mask: [page.locator('label.blink_me')]
    });
  });
});
