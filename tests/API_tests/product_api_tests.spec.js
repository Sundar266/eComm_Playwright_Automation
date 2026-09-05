import { test, expect } from '../../fixtures/api.fixture.js';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import productCreateResponseSchema from '../../testData/product-create-response.schema.json' with { type: 'json' };

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateProductCreateResponse = ajv.compile(productCreateResponseSchema);

test.describe.serial('ReqRes product API Tests', () => {
    let id = null;

    test('Create a product', async ({ productApiContext }) => {
        const response = await productApiContext.post(
            `collections/products/records?project_id=${process.env.PROJECT_ID}`,
            {
                data: {
                    data: {
                        name: 'Running Shoes',
                        price: 150.0,
                        category: 'Sportswear',
                        in_stock: false,
                    },
                },
            }
        );

        const responseBody = await response.json();
        expect(response.status()).toBe(201);
        expect(responseBody).toHaveProperty('data');
        id = responseBody.data.id;

        const isValid = validateProductCreateResponse(responseBody);
        expect(isValid, JSON.stringify(validateProductCreateResponse.errors, null, 2)).toBe(true);
    });

    test('Update a product', async ({ productApiContext }) => {
        test.skip(!id, 'Create a product test must run before Update a product');

        const recordUrl = `collections/products/records/${id}?project_id=${process.env.PROJECT_ID}`;

        const preUpdateResponse = await productApiContext.get(recordUrl);
        expect(preUpdateResponse.status()).toBe(200);
        expect((await preUpdateResponse.json()).data.id).toBe(id);

        const response = await productApiContext.put(recordUrl, {
            data: {
                data: {
                    price: 188.89,
                },
            },
        });

        const responseBody = await response.json();
        console.log('UPDATED BODY:', responseBody);
        expect(response.status()).toBe(200);
        expect(responseBody.data.id).toBe(id);

        const confirmationResponse = await productApiContext.get(recordUrl);
        expect(confirmationResponse.status()).toBe(200);
        const confirmationBody = await confirmationResponse.json();
        expect(confirmationBody.data.data.price).toBe(188.89);
    });

    test('Delete a product', async ({ productApiContext }) => {
        test.skip(!id, 'Create a product test must run before Delete a product');

        const recordUrl = `collections/products/records/${id}?project_id=${process.env.PROJECT_ID}`;

        const preDeleteResponse = await productApiContext.get(recordUrl);
        expect(preDeleteResponse.status()).toBe(200);

        const deleteResponse = await productApiContext.delete(recordUrl);
        expect(deleteResponse.status()).toBe(204);

        const postDeleteResponse = await productApiContext.get(recordUrl);
        expect([404, 410]).toContain(postDeleteResponse.status());

        if (postDeleteResponse.status() === 404) {
            const errorBody = await postDeleteResponse.json();
            expect(errorBody).toHaveProperty('message');
        }
    });
});