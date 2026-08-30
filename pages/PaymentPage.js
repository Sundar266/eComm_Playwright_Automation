import {BasePage} from './BasePage.js'; 

class PaymentPage extends BasePage {
    constructor(page, logger) {
        super(page, logger);
        this.creditCardInput = page.getByRole('textbox', { name: 'Credit Card Number' });
        this.ccvInput =  page.locator('.title',{hasText: 'CVV Code'}).locator('..').locator('input');
        this.NameOnCardInput =  page.locator('.title',{hasText: 'Name on Card'}).locator('..').locator('input');
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
        this.country = page.getByPlaceholder('Select Country');
        this.OrderPlacementSuccessHeading = page.getByRole('heading',{hasText: 'Thankyou for the order.'});
        this.DownloadInvoiceButton = page.getByRole('button', { name: 'Click To Download Order Details in CSV' });
        this.OrderHistoryPageLink = page.getByRole('link', { name: 'Orders History Page' });
    }

    async validateOrderPlacementSuccess() {
        await this.OrderPlacementSuccessHeading.waitFor({ state: 'visible', timeout: 5000 });
        expect(await this.OrderPlacementSuccessHeading.isVisible()).toBe(true);
        await this.OrderPlacementSuccessHeading.waitFor({ state: 'visible', timeout: 5000 });
        expect(await this.OrderPlacementSuccessHeading.isVisible()).toBe(true);
    }

    async captureProductIDs(){
        const productIDs = await this.page.locator('label').allTextContents();
        this.productIDs = productIDs
            .map(text => text.split('|')[1]?.trim())
            .filter(Boolean);
        return this.productIDs;
    }
}

export {PaymentPage} ;