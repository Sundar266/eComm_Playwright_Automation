import { test, expect } from '../fixtures/test.fixture.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import JSONData from '../testData/data.json' assert { type: 'json' };
Object.freeze(JSONData); // Freeze the JSON data to make it immutable

const seededRecordIds = [];

test.describe('Dashboard Tests', { tag: '@Regression' }, () => {
  test.beforeEach(async ({ dbClient, logger }) => {
    if (process.env.DB_ENABLED !== 'true') {
      logger.debug('Database seeding is disabled, check your config file');
      return;
    }

    const result = await dbClient.execute(
      'SELECT * FROM ABCTABLE WHERE ID = :dir AND TYPE = :type',
      {
        name: 'Playwright dashboard test data',
        id: { dir: 3003, type: 2010 }
      },
      { autoCommit: true }
    );

    seededRecordIds.push(result.rows.map((row) => row.ID));
    logger.info('Test data seeded');
  });



  test('Validate if all products have View and Add to cart options', async ({ page, logger }) => {
    const dashboardPage = new DashboardPage(page, logger);
    await dashboardPage.open();
    // Checking if products we counted match the number of products displayed in the "Showing results" label
    const productCount = await dashboardPage.productsCount();
    logger.info(`Total products found: ${productCount}`);
    const showingResults = await dashboardPage.getShowingResultsText();
    expect(showingResults).toBe(productCount);

    // Validating if all products have View and Add to cart buttons
    let productDetails = [];
    const count = await dashboardPage.productCard.count();
    for (let i = 0; i < count; i++) {
      const card = await dashboardPage.productCard.nth(i);
      const productName = await card.locator('h5').innerText();
      const price = await card.locator('.text-muted').innerText();
      productDetails.push({ name: productName, price: price });
      const viewButton = await card.getByRole('button', { name: 'View' });
      const addToCartButton = await card.getByRole('button', { name: 'Add To Cart' });
      expect(viewButton).toBeTruthy();
      expect(addToCartButton).toBeTruthy();
    }
  });

  test('Validate if the Price range filter is working correctly', async ({ page, logger }) => {
    const dashboardPage = new DashboardPage(page, logger);
    await dashboardPage.open();
    const minPrice = JSONData.price.min; const maxPrice = JSONData.price.max;
    logger.info(`Applying price filter with min: ${minPrice} and max: ${maxPrice}`);
    await dashboardPage.minPriceInput.fill(minPrice.toString());
    await dashboardPage.maxPriceInput.fill(maxPrice.toString());
    await dashboardPage.page.keyboard.press('Enter');
    const productCount = await dashboardPage.productsCount();
    logger.info(`Total products found after applying price filter: ${productCount}`);
    const showingResults = await dashboardPage.getShowingResultsText();
    expect(showingResults).toBe(productCount);
    // Validating if all products prices are within the specified range
    let productPrices = [];
    const count = await dashboardPage.productCard.count();
    for (let i = 0; i < count; i++) {
      const card = await dashboardPage.productCard.nth(i);
      const productName = await card.locator('h5').innerText();
      const price = await card.locator('.text-muted').innerText();
      productPrices.push({ name: productName, price: price });
      const viewButton = await card.getByRole('button', { name: 'View' });
      const addToCartButton = await card.getByRole('button', { name: 'Add To Cart' });
      expect(viewButton).toBeTruthy();
      expect(addToCartButton).toBeTruthy();
    }
    productPrices.every((product) => {
      const priceValue = parseFloat(product.price.replace('$', ''));
      expect(priceValue?.trim()).toBeGreaterThanOrEqual(minPrice);
      expect(priceValue?.trim()).toBeLessThanOrEqual(maxPrice);
    });
  });

  test('Validate if user can able to view a product and go back to homepage', async ({ page, logger }) => {
    const dashboardPage = new DashboardPage(page, logger);
    await dashboardPage.open();
    const targetProduct = JSONData.targettedProductToView;
    await dashboardPage.searchProduct(targetProduct.name);
    await dashboardPage.page.keyboard.press('Enter');
    const productCount = await dashboardPage.productsCount();
    logger.info(`Total products found after searching for ${targetProduct.name}: ${productCount}`);
    expect(productCount).toBeGreaterThan(0);
    const showingResults = await dashboardPage.getShowingResultsText();
    expect(showingResults).toBe(productCount);
    // View the first product from the search results
    const firstProductCard = await dashboardPage.productCard.nth(0);
    const productName = await firstProductCard.locator('h5').innerText();
    const price = await firstProductCard.locator('.text-muted').innerText();
    logger.info(`Viewing product: ${productName} with price: ${price}`);
    await firstProductCard.getByRole('button', { name: 'View' }).click();
    const viewProductName = await dashboardPage.viewProductName.innerText();
    const viewProductPrice = await dashboardPage.viewProductPrice.innerText();
    expect(viewProductName).toBe(productName);
    expect(viewProductPrice).toBe(price);
    await expect(dashboardPage.continueButton).toBeVisible();
    await expect(dashboardPage.addToCartButton).toBeVisible();
    //Head back to home page
    await dashboardPage.continueButton.click();
    await expect(dashboardPage.productSearchBox).toBeVisible();
  });

  test.afterEach(async ({ dbClient, logger }) => {
    if (process.env.DB_ENABLED !== 'true' || seededRecordIds.length === 0) {
      return;
    }

    await dbClient.execute(
       'DELETE FROM ABCTABLE WHERE ID IN (:ids)',
        { ids: seededRecordIds },
        { autoCommit: true }
    );
    logger.info('Test data deleted');
  });
});
