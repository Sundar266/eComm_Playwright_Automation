//This test is to validate the complete end to end flow of the application, from login to checkout, including product 
// selection and cart management.
import fs from 'node:fs/promises';
import path from 'node:path';
import { test, expect } from '../../fixtures/test.fixture.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import {OrdersPage} from '../../pages/OrdersPage.js';
import {CartPage} from '../../pages/CartPage.js';
import {PaymentPage} from '../../pages/PaymentPage.js';
import { getCsvCellValues, getLatestFileByPattern } from '../../utilities/csv.utility.js';
import JSONData from '../../testData/data.json' assert { type: 'json' };
Object.freeze(JSONData); // Freeze the JSON data to make it immutable

test.beforeEach(async ({ page, logger }) => {
    await page.addInitScript(() => {
      document.documentElement.style.setProperty('zoom', '50%', 'important');
    });
    const dashboardPage = new DashboardPage(page, logger);
    await dashboardPage.open(); // Navigate to the dashboard
    await page.waitForLoadState('domcontentloaded'); // Wait for the page to fully load
    await dashboardPage.ordersMenu.click(); // Navigate to the orders page
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
        await dashboardPage.productAddedMessage.waitFor({ state: 'visible', timeout: 5000 });
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
        //Wait for the view modal to load and the product details to be visible
        await dashboardPage.viewProductName.waitFor({ state: 'visible', timeout: 5000 });
        await page.waitForLoadState('domcontentloaded');
        //Validate the product name and price in the view product section after viewing
        const viewProductName = await dashboardPage.viewProductName.innerText();
        const viewProductPrice = await dashboardPage.viewProductPrice.innerText();
        expect(viewProductName).toBe(productName);
        expect(viewProductPrice).toBe(productPrice);
        //Add product to cart
        await dashboardPage.addToCartButtonFromView.click();
        logger.info(`Product ${JSONData.e2eTestData.product2.name} added to cart`);
        await dashboardPage.productAddedMessage.waitFor({ state: 'visible', timeout: 5000 });
        expect(await dashboardPage.productAddedMessage.isVisible()).toBe(true);
    });

    await test.step('Navigating to cart page and checkout products', async () => {
        const dashboardPage = new DashboardPage(page, logger);
        await dashboardPage.cartMenu.click();
        logger.info('Navigated to cart page');
        const cartPage = new CartPage(page, logger);
        const { totalAmount, subTotalAmount } = await cartPage.getAmounts();    
        logger.info(`Cart total: ${totalAmount}, subtotal: ${subTotalAmount}`);
        // Validate that we have a non-zero total amount
        expect(Number(totalAmount.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
        await cartPage.checkOutButton.click();
        logger.info('Checkout button clicked');
        await cartPage.page.waitForLoadState('networkidle'); // Wait for the network to be idle before proceeding
    });

    await test.step('Fill payment details and place order', async () => {
        paymentPage = new PaymentPage(page, logger);
        // Wait longer for the payment page to fully load
        await page.waitForTimeout(2000); // Wait 2 seconds for dynamic content
        await page.waitForLoadState('networkidle');
        try {
            await paymentPage.creditCardInput.waitFor({ state: 'visible', timeout: 10000 });
        } catch (e) {
            logger.info('Payment form not found with expected selector, checking page content...');
            await page.screenshot({ path: 'payment-page-debug.png' });
        }
        
        //Fill credit card details from the JSON data file
        await paymentPage.creditCardInput.fill(JSONData.e2eTestData.paymentDetails.creditCardNumber);
        await paymentPage.ccvInput.fill(JSONData.e2eTestData.paymentDetails.ccv);
        await paymentPage.NameOnCardInput.fill(JSONData.e2eTestData.paymentDetails.nameOnCard);
        await page.pause();
        //Choose the country from the dropdown using selectOption method
        const countryName = JSONData.e2eTestData.paymentDetails.country;
        await paymentPage.country.click();
        await paymentPage.country.pressSequentially(JSONData.e2eTestData.paymentDetails.country,{delay:300});
        // Look for the country option in the dropdown and click it
        const countryOption = page.locator('button.ta-item').filter({ hasText: new RegExp(`^\\s*${countryName}\\s*$`)});
        await countryOption.waitFor({state: 'visible', timeout: 10000});
        await countryOption.click();
        await paymentPage.placeOrderButton.scrollIntoViewIfNeeded();
        //Click on the place order button and wait for the network to be idle before proceeding
        await paymentPage.placeOrderButton.click();        
        logger.info('✓ Place order button clicked');
        await paymentPage.validateOrderPlacementSuccess();
        await paymentPage.page.waitForLoadState('networkidle');
        logger.info('Order placed successfully');
    });

    await test.step('Download Invoice and validate the order confirmation', async () => {      
                
        // Close any modal overlays by pressing Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
        const capturedProductIDs = await paymentPage.captureProductIDs();
        capturedProductIDs.forEach(id => productIDs.push(id));

        const downloadDirectory = process.env.DOWNLOAD_DIRECTORY;
        const fileNamePattern = /^order-invoice_sundarsnipes(?: \(\d+\))?(?:\.csv)?$/i;

        // Set up API monitoring for successful CSV download responses
        let apiDownloadSuccess = false;
        page.on('response', async (response) => {
            if (response.url().includes('csv') || response.url().includes('download') || response.url().includes('invoice')) {
                const status = response.status();
                logger.info(`API Response for download: ${response.url()} - Status: ${status}`);
                if (status === 200) {
                    apiDownloadSuccess = true;
                    logger.info('✓ API returned 200 OK for CSV download');
                }
            }
        });

        // Set up download handler
        const downloadPromise = page.waitForEvent('download');
        
        // Find and click the exact download button
        const downloadBtn = page.locator('button.btn.btn-primary:has-text("Click To Download Order Details in CSV")');
        await downloadBtn.waitFor({ state: 'visible', timeout: 5000 });
        await downloadBtn.click();
        
        // Wait for download with timeout
        try {
            const download = await Promise.race([
                downloadPromise,
                // _ here is that we are saying, do not consider 'resolve' as a parameter, if we only give reject, then as it
                // is a first param, JS will consider it as a 'resolve' only
                new Promise((_, reject) => setTimeout(() => reject(new Error('Download timeout')), 5000))
            ]);
            if (download) {
                const filename = download.suggestedFilename();
                await download.saveAs(`${downloadDirectory}/${filename}`);
                logger.info(`✓ File saved: ${filename}`);
            }
        } catch (error) {
            logger.info(`Download event error: ${error.message}`);
        }

        // Verify the CSV file was downloaded, .poll repeatedly watches for the file else timeout in given time
        let latestDownloadFilePath = null;
        await expect.poll(async () => {
          latestDownloadFilePath = await getLatestFileByPattern(downloadDirectory, fileNamePattern);
          return !!latestDownloadFilePath; // !! means convert anything to boolean
        }, 
        { timeout: 15000, message: `CSV report matching order-invoice_sundarsnipes was not downloaded to ${downloadDirectory}` }).toBeTruthy();

        logger.info(`✓ Downloaded file found: ${latestDownloadFilePath}`);
        
        if (apiDownloadSuccess) { logger.info('✓ API confirmed successful download response (200 OK)'); }

        const orderIdsFromReport = (await getCsvCellValues(latestDownloadFilePath, ['B2', 'B3']))
                                  .map(value => String(value).trim())
                                  .filter(Boolean);
        //Validate the Product IDs
        expect(orderIdsFromReport).toHaveLength(2);
        expect([...productIDs].sort()).toEqual([...orderIdsFromReport].sort());
    });
  });  
});  
