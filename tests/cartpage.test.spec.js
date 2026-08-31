import { test, expect } from '../fixtures/test.fixture.js';
import {CartPage} from '../pages/CartPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import { OrdersPage } from '../pages/OrdersPage.js';
import JSONData from '../../testData/data.json' assert { type: 'json' };
Object.freeze(JSONData); // Freeze the JSON data to make it immutable

test.describe('Cart Page tests', {tag: '@Regression'},() => {
        test('Validate if only one product can be added to checkout section', async ({page, logger}) => {
                const dashboardPage = new DashboardPage(page, logger);
                const cartpage = new CartPage(page, logger);
                async function addProductToCart(product){
                await dashboardPage.productCard.filter({has: dashboardPage.page.locator('h5',{hasText: product, exact: true})})
                                                      .first()
                                                      .getByRole('button', { name: 'Add To Cart' })
                                                      .click();
                logger.info(`Product ${JSONData.e2eTestData.product2.name} added to cart`);
                await dashboardPage.productAddedMessage.waitFor({ state: 'visible', timeout: 5000 });
                expect(await dashboardPage.productAddedMessage.isVisible()).toBe(true);
             }  

                // Add 2 products directly to the cart
                await addProductToCart(JSONData.e2eTestData.product1.name);
                await addProductToCart(JSONData.e2eTestData.product2.name);
                
                await dashboardPage.cartMenu.click();
                logger.info('Navigated to cart page');

                //Click on Buy for only one product
                const productInCart = cartpage.productInfoWrap.filter({has: page.locator('h3',{hasText: JSONData.e2eTestData.product1.name, exact:true})});
                await productInCart.buyNowButton.click();
                //Validate if only one product is present and the name is as the chosen one
                const productsInCartCount = page.locator('.item__details').count();
                expect(productsInCartCount).toBe(1);
                const productNameInCart = page.locator('.item__title').innerText();
                expect(productNameInCart).toBe(JSONData.e2eTestData.product1.name);
        });

        test('Validate if one product can be deleted in checkout section', async ({page, logger}) => {
                const dashboardPage = new DashboardPage(page, logger);
                const cartpage = new CartPage(page, logger);
                const orderpage = new OrdersPage(page, logger);
                async function addProductToCart(product){
                await dashboardPage.productCard.filter({has: dashboardPage.page.locator('h5',{hasText: product, exact: true})})
                                                      .first()
                                                      .getByRole('button', { name: 'Add To Cart' })
                                                      .click();
                logger.info(`Product ${JSONData.e2eTestData.product2.name} added to cart`);
                await dashboardPage.productAddedMessage.waitFor({ state: 'visible', timeout: 5000 });
                expect(await dashboardPage.productAddedMessage.isVisible()).toBe(true);
             }  

                // Add 2 products directly to the cart
                await addProductToCart(JSONData.e2eTestData.product1.name);
                await addProductToCart(JSONData.e2eTestData.product2.name);
                
                await dashboardPage.cartMenu.click();
                logger.info('Navigated to cart page');

                //Click on Buy for only one product
                const productInCart = orderpage.productInfoWrap.filter({has: page.locator('h3',{hasText: JSONData.e2eTestData.product1.name, exact:true})});
                await productInCart.deleteButton.click();
                //Validate if only one product is present and the name is as the chosen one
                const final_product_count = await cartpage.productInfoWrap.count();
                expect(final_product_count).toBe(1);
        });
});

