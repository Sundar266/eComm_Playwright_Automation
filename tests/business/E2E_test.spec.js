//This test is to validate the complete end to end flow of the application, from login to checkout, including product 
// selection and cart management.
import fs from 'node:fs/promises';
import path from 'node:path';
import { test, expect } from '../fixtures/test.fixture.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import {OrdersPage} from '../pages/OrdersPage.js';
import {CartPage} from '../pages/CartPage.js';
import {PaymentPage} from '../pages/PaymentPage.js';
import { getCsvCellValues, getLatestFileByPattern } from '../utilities/csv.utility.js';
import JSONData from '../testData/data.json' assert { type: 'json' };
Object.freeze(JSONData); // Freeze the JSON data to make it immutable

test.before(async ({ page, logger }) => {
    const dashboardPage = new DashboardPage(page, logger);
    dashboardPage.ordersMenu.click(); // Navigate to the orders page
    const ordersPage = new OrdersPage(page, logger);
    await ordersPage.deleteAllProducts(); // Delete all products in the cart
});

test.describe('End to End Flow Tests', { tag: '@E2E' }, () => {
   test('Complete end to end flow', async ({ page, logger }) => {

    let paymentPage;
    const productIDs = [];

    await test.step('Add product by directly adding to cart', async () => {
        const dashboardPage = new DashboardPage(page, logger);
        await dashboardPage.productCard.filter({has: dashboardPage.page.locator('h5',{hasText: JSONData.e2eTestData.product1.name, exact: true})})
                                      .first()
                                      .getByRole('button', { name: 'Add To Cart' })
                                      .click();
        logger.info(`Product ${JSONData.e2eTestData.product1.name} added to cart`);
        expect(await dashboardPage.productAddedMessage.isVisible()).toBe(true);
    });

    await test.step('Add product by viewing and adding to cart', async () => {
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

    await test.step('Navigating to cart page and checkout products', async () => {
        const dashboardPage = new DashboardPage(page, logger);
        await dashboardPage.cartMenu.click();
        logger.info('Navigated to cart page');
        const cartPage = new CartPage(page, logger);
        const productCard = await cartPage.productInfoWrap;
        const productPrice1 = await productCard.filter({has: cartPage.page.locator('h3',{hasText: JSONData.e2eTestData.product1.name, exact: true})})
                                              .locator('prodTotal.cartSection')
                                              .innerText()
                                              .replace(/[^0-9.]/g, '') // Remove any non-numeric characters (like currency symbols)
                                              .trim(); // Remove spaces from the string
        const productPrice2 = await productCard.filter({has: cartPage.page.locator('h3',{hasText: JSONData.e2eTestData.product2.name, exact: true})})
                                              .locator('prodTotal.cartSection')
                                              .innerText()
                                              .replace(/[^0-9.]/g, '') // Remove any non-numeric characters (like currency symbols)
                                              .trim();
        const { totalAmount, subTotalAmount } = await cartPage.getAmounts();    
        expect(Number(totalAmount)).toBeCloseTo(Number(productPrice1) + Number(productPrice2), 2); // Here 2 is the number of decimal places to consider for comparison                                      
        await cartPage.checkOutButton.click();
        logger.info('Checkout button clicked');
        await cartPage.page.waitForLoadState('networkidle'); // Wait for the network to be idle before proceeding
    });

    await test.step('Fill payment details and place order', async () => {
        paymentPage = new PaymentPage(page, logger);
        //Fill credit card details from the JSON data file
        await paymentPage.creditCardInput.fill(JSONData.e2eTestData.paymentDetails.creditCardNumber);
        await paymentPage.ccvInput.fill(JSONData.e2eTestData.paymentDetails.ccv);
        await paymentPage.NameOnCardInput.fill(JSONData.e2eTestData.paymentDetails.nameOnCard);
        //Choose the country from the dropdown using selectOption method
        await paymentPage.country.fill(JSONData.e2eTestData.paymentDetails.country);
        await page.getByRole('button',{ name: 'India', exact: true }).click(); // Click on the country option from the dropdown
        logger.info('Payment details filled');
        //Click on the place order button and wait for the network to be idle before proceeding
        await paymentPage.placeOrderButton.click();
        logger.info('Place order button clicked');
        await paymentPage.page.waitForLoadState('networkidle');
    });

    await test.step('Downlaod Invoice and validate the order confirmation', async () => {
        await paymentPage.validateOrderPlacementSuccess();
        logger.info('Order placed successfully');
        await paymentPage.DownloadInvoiceButton.waitFor({ state: 'visible', timeout: 5000 });
        const capturedProductIDs = await paymentPage.captureProductIDs();
        capturedProductIDs.forEach(id => productIDs.push(id));

        const downloadDirectory = process.env.DOWNLOAD_DIRECTORY;
        // (?: ) -> This means grouping, a space and multiple digits
        // ? -> This group can be present or cannot be present
        // (?: ) similarly, the second grouping, .csv
        // ? -> This grouping also can be present or cannot be present
        const fileNamePattern = /^order-invoice_sundarsnipes(?: \(\d+\))?(?:\.csv)?$/i;

        await paymentPage.DownloadInvoiceButton.click();

        let latestDownloadFilePath = null;
        await expect.poll(async () => {
          latestDownloadFilePath = await getLatestFileByPattern(downloadDirectory, fileNamePattern);
          return !!latestDownloadFilePath;
        }, 
        { timeout: 15000, message: `CSV report matching order-invoice_sundarsnipes was not downloaded to ${downloadDirectory}` }).toBeTruthy();

        const orderIdsFromReport = (await getCsvCellValues(latestDownloadFilePath, ['B2', 'B3']))
                                  .map(value => String(value).trim())
                                  .filter(Boolean);
        //Validate the Product IDs
        expect(orderIdsFromReport).toHaveLength(2);
        expect([...productIDs].sort()).toEqual([...orderIdsFromReport].sort());
    });
  });  
});  
