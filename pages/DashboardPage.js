import { BasePage } from './BasePage.js';

class DashboardPage extends BasePage {
  constructor(page, logger) {
    super(page, logger);

    this.homeMenu = page.getByRole('button', { name: 'HOME' });
    this.ordersMenu = page.getByRole('button', { name: 'ORDERS' });
    this.cartMenu = page.getByRole('button', { name: 'Cart' });
    this.searchBox = page.getByPlaceholder('search');
    this.productsHeading = page.getByRole('heading', { name: 'Filters' });
  }

  async open() {
    await this.goto('./', 'Dashboard opened');
  }

  async searchProduct(productName) {
    await this.fill(this.searchBox, productName, `Product search entered: ${productName}`);
  }

  async openOrders() {
    await this.click(this.ordersMenu, 'Orders menu clicked');
  }

  async openCart() {
    await this.click(this.cartMenu, 'Cart menu clicked');
  }
}

export { DashboardPage };
