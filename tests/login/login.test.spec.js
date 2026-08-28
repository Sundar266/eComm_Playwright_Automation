import { test, expect } from '../../fixtures/test.fixture.js';
import { LoginPage } from '../../pages/LoginPage.js';

test.describe('Login Tests', () => {
  test('Login with valid credentials', async ({ page, logger, actionValidation }) => {
    
    const loginPage = new LoginPage(page, logger);
    await loginPage.open();
    await loginPage.login(process.env.USER_NAME, process.env.PASSWORD);

    await actionValidation.validate([
      { type: 'url', expected: `${process.env.BASE_URL}/#/dashboard/dash` },
      { type: 'locator', locator: loginPage.homeMenu }
    ]);
  });
});