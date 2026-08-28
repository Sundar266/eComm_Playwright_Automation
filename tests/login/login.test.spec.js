import { test, expect } from '../../fixtures/test.fixture.js';
import { LoginPage } from '../../pages/LoginPage.js';
import JSONdata from '../../testData/data.json' with { type: 'json' };
Object.freeze(JSONdata); // Freeze the JSON data to make it immutable

test.describe('Login Tests', () => {
  test('Login with valid credentials', async ({ page, logger, actionValidation }) => {
    
    const loginPage = new LoginPage(page, logger);
    await loginPage.open();
    await loginPage.login(process.env.USER_NAME, process.env.PASSWORD);
    //Send out a complex validation to validate the URL and the locator of the home menu button
    await actionValidation.validate([
      { type: 'url', expected: `${process.env.BASE_URL}/#/dashboard/dash` },
      { type: 'locator', locator: loginPage.homeMenu }
    ]);
  });

  test('Login with invalid credentials', async ({ page, logger, actionValidation }) => {
    const loginPage = new LoginPage(page, logger);
    await loginPage.open();
    //Login with invalid username and password
    await loginPage.login(JSONdata.invalidUser.username, JSONdata.invalidUser.password);
    await expect(page.getByText('*Enter Valid Email')).toBeVisible();
    //Login with valid username and invalid password
    await loginPage.login(process.env.USER_NAME, JSONdata.invalidUser.password);
    await expect(page.getByRole('alert')).toHaveText('Incorrect email or password.');
  });

  test('Login with empty credentials', async ({ page, logger, actionValidation }) => {
    const loginPage = new LoginPage(page, logger);
    await loginPage.open();
    //Passing empty strings for username and password to validate the error messages
    await loginPage.login('', '');
    await expect(page.getByText('*Enter Valid Email')).toBeVisible();
    await expect(page.getByText('*Password is required')).toBeVisible();
  });

  test('Verify the Register and Forgot Password links', async ({ page, logger, actionValidation }) => {
    const loginPage = new LoginPage(page, logger);
    await loginPage.open();
    //Here toBeVisible() is an async function, so we need to await it to ensure that the test waits for the visibility 
    //check to complete before proceeding.
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
  });
});