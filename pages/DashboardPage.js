import { BasePage } from './BasePage.js';

class DashboardPage extends BasePage {
  constructor(page, logger) {
    super(page, logger);

    this.homeMenu = page.getByRole('button', { name: 'HOME' });
    this.ordersMenu = page.getByRole('button', { name: 'ORDERS' });
    this.cartMenu = page.locator('button[routerlink="/dashboard/cart"]');
    this.searchBox = page.getByPlaceholder('search');
    this.productsHeading = page.getByRole('heading', { name: 'Filters' });
    this.productImgs = page.getByRole('img');
    this.productCard = this.productImgs.locator('..');
    this.viewButton = page.getByRole('button', { name: 'View' });
    this.addToCartButton = page.getByRole('button', { name: 'Add To Cart' });
    this.showingResultsLabel = page.locator('#res');
    this.minPriceInput = page.getByPlaceholder('Min Price');
    this.maxPriceInput = page.getByPlaceholder('Max Price');
    this.productSearchBox = page.getByRole('textbox', { name: 'search' });
    this.productAddedMessage = page.getByRole('alert', {name:"Product Added To Cart"});
    //View Product section
    this.viewProductName = page.locator('.col-lg-6.rtl-text').locator('h2');
    this.viewProductPrice = page.locator('.col-lg-6.rtl-text').locator('h3');
    this.continueButton = page.getByRole('link', { name: 'Continue Shopping' });
    this.addToCartButtonFromView = page.getByRole('button', { name: 'Add to Cart' });
  }

  async open() {
    await this.goto('./', 'Dashboard opened');
  }

  async searchProduct(productName) {
    await this.fill(this.productSearchBox, productName, `Product search entered: ${productName}`);
  }

  async openOrders() {
    await this.click(this.ordersMenu, 'Orders menu clicked');
  }

  async openCart() {
    await this.click(this.cartMenu, 'Cart menu clicked');
  }

  async productsCount() {
    const count = await this.productImgs.count();
    this.logger.info(`Number of products found: ${count}`);
    return count;
  }

  async getShowingResultsText() {
    const text = await this.showingResultsLabel.innerText();
    // (/\d+/g) - Global search for one or more digits in the string ( like Showing 2 in page 1), returns an array of matches. We 
    // take the first match or default to '0' if no match is found.
    const number = text.match(/\d+/g)?.[0] || '0';
    this.logger.info(`Showing results text: ${text}`);
    return Number(number);
  }
}

export { DashboardPage };
