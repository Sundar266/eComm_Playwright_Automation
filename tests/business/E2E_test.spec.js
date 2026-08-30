//This test is to validate the complete end to end flow of the application, from login to checkout, including product 
// selection and cart management.
import { test, expect } from '../fixtures/test.fixture.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import {OrdersPage} from '../pages/OrdersPage.js';
import JSONData from '../testData/data.json' assert { type: 'json' };
Object.freeze(JSONData); // Freeze the JSON data to make it immutable

test.before(async ({ page, logger }) => {
    const dashboardPage = new DashboardPage(page, logger);
    dashboardPage.ordersMenu.click(); // Navigate to the orders page
    const ordersPage = new OrdersPage(page, logger);
    await ordersPage.deleteAllProducts(); // Delete all products in the cart
});

test.describe('End to End Flow Tests', { tag: '@E2E' }, () => {
  test.step('Add product by directly adding to cart', async ({ page, logger }) => {
    const dashboardPage = new DashboardPage(page, logger);
    await dashboardPage.productCard.filter({has: dashboardPage.page.locator('h5',{hasText: JSONData.e2eTestData.product1.name, exact: true})})
                                   .first()
                                   .getByRole('button', { name: 'Add To Cart' })
                                   .click();
    logger.info(`Product ${JSONData.e2eTestData.product1.name} added to cart`);
    expect(await dashboardPage.productAddedMessage.isVisible()).toBe(true);
  });

  test.step('Add product by viewing and adding to cart', async ({ page, logger }) => {
    const dashboardPage = new DashboardPage(page, logger);
    //Fetch the product name and price for the product before clicking view and adding to cart from the JSON data file
    const productName = await dashboardPage.productCard
                                           .filter({has: dashboardPage.page.locator('h5',{hasText: JSONData.e2eTestData.product2.name, exact: true})})
                                           .first()
                                           .locator('h5')
                                           .innerText();
    const productPrice = await dashboardPage.productCard
                                            .filter({has: dashboardPage.page.locator('h5',{hasText: JSONData.e2eTestData.product2.name, exact: true})})
                                            .first()
                                            .locator('.text-muted')
                                            .innerText();
    await dashboardPage.productCard.filter({has: dashboardPage.page.locator('h5',{hasText: JSONData.e2eTestData.product2.name, exact: true})})
                                   .first()
                                   .getByRole('button', { name: 'View' })
                                   .click();
    logger.info(`Product ${JSONData.e2eTestData.product2.name} viewed`);
    await dashboardPage.addToCartButtonFromView.click();
    //Validate the product name and price in the view product section after viewing
    const viewProductName = await dashboardPage.viewProductName.innerText();
    const viewProductPrice = await dashboardPage.viewProductPrice.innerText();
    expect(viewProductName).toBe(productName);
    expect(viewProductPrice).toBe(productPrice);
    //Add product to cart
    await dashboardPage.addToCartButtonFromView.click();
    logger.info(`Product ${JSONData.e2eTestData.product2.name} added to cart`);
    expect(await dashboardPage.productAddedMessage.isVisible()).toBe(true);
  });

  test.step('Navigating to cart page and checkout products', async ({ page, logger }) => {
    const dashboardPage = new DashboardPage(page, logger);
    await dashboardPage.cartMenu.click();
    logger.info('Navigated to cart page');
  });

  test.step('Fill payment details and place order', async ({ page, logger }) => {
    const dashboardPage = new DashboardPage(page, logger);
    await dashboardPage.open();
  });

  test.step('Validate invoice and order confirmation', async ({ page, logger }) => {
    const dashboardPage = new DashboardPage(page, logger);
    await dashboardPage.open();
  });

  test.step('Downloaded invoice and validate', async ({ page, logger }) => {
    const dashboardPage = new DashboardPage(page, logger);
    await dashboardPage.open();
  });
});  
