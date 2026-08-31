import { expect } from '@playwright/test';
import {BasePage} from './BasePage.js'; 

class PaymentPage extends BasePage {
    constructor(page, logger) {
        super(page, logger);
        // Find text input fields using nth() - simpler and more reliable
        const textInputs = page.locator('input[type="text"], input:not([type])');
        this.creditCardInput = textInputs.nth(0); // First text input - credit card
        this.ccvInput = textInputs.nth(1); // Second text input - CVV
        this.NameOnCardInput = textInputs.nth(2); // Third text input - Name on Card
        this.placeOrderButton = page.locator('a.action__submit', { hasText: 'Place Order' });
        this.country = page.getByPlaceholder('Select Country');
        this.OrderPlacementSuccessHeading = page.getByRole('heading',{name: 'Thankyou for the order.', exact:true});
        this.DownloadInvoiceButton = page.locator('button:has-text("Download"), button:has-text("CSV")').first().or(page.getByRole('button', { name: 'Click To Download Order Details in CSV' }));
        this.OrderHistoryPageLink = page.getByRole('link', { name: 'Orders History Page' });
    }

    async validateOrderPlacementSuccess() {
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