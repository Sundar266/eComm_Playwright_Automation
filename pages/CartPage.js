import {BasePage} from "./BasePage";

class CartPage extends BasePage {
  constructor(page, logger) {
    super(page, logger);

    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkOutButton = page.getByRole('button', { name: 'Checkout' });
    this.totalAmountLabel = page.locator('.subtotal.cf .value').nth(0);
    this.subTotalAmountLabel = page.locator('.subtotal.cf .value').nth(1);
    this.buyNowButton = page.getByRole('button', { name: 'Buy Now' });
    this.productInfoWrap = page.locator('.infoWrap');    
  }

  async getAmounts() {
    const totalAmount = await this.totalAmountLabel.innerText();
    const subTotalAmount = await this.subTotalAmountLabel.innerText();
    totalAmount.replace(/[^0-9.]/g, ''); // Remove any non-numeric characters (like currency symbols)
    subTotalAmount.replace(/[^0-9.]/g, ''); // Remove any non-numeric characters (like currency symbols)
    this.logger.info(`Total Amount: ${totalAmount}, Subtotal Amount: ${subTotalAmount}`);
    return { totalAmount, subTotalAmount };
  }
}      

export { CartPage };