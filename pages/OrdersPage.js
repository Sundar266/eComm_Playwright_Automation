import { expect } from '@playwright/test';
import {BasePage} from './BasePage.js';

class OrdersPage extends BasePage {
  constructor(page, logger) {
    super(page, logger);
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
  }

  async deleteAllProducts() {
    const deleteButtonsCount = await this.deleteButton.count();
    console.log(deleteButtonsCount);
    this.logger.info(`Number of delete buttons found: ${deleteButtonsCount}`);
    if(this.deleteButton !== 0) {
      for (let i = 0; i < deleteButtonsCount; i++) {
        await this.click(this.deleteButton.nth(0), `Delete button clicked for product ${i + 1}`);
      }
    }
    // Validate that all products have been deleted
    const remainingProducts = await this.deleteButton.count();
    console.log(remainingProducts);
    this.logger.info(`Number of products remaining in cart: ${remainingProducts}`);
    expect(remainingProducts).toBe(0);
    //Navigate to home page after deleting all products
    await this.goto('./', 'Navigated to home page after deleting all products');
    await this.page.waitForLoadState('networkidle'); // Wait for the page to load completely
  }
}

export { OrdersPage };