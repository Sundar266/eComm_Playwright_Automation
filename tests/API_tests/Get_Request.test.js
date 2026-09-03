import { test, expect } from '../../fixtures/api.fixture.js';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import productCreateResponseSchema from '../../testData/product-create-response.schema.json' with { type: 'json' };

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateProductCreateResponse = ajv.compile(productCreateResponseSchema);

test('ReqRes collections', async ({ apiContext }) => {

    const response = await apiContext.get(`collections?project_id=${process.env.PROJECT_ID}`);

            console.log('STATUS:', response.status());
            console.log('URL:', response.url());
            console.log('BODY:', await response.text());

            expect(response.status()).toBe(200);
});


test('Get records list', async ({ productApiContext }) => {
    const response = await productApiContext.get(`collections/products/records?project_id=${process.env.PROJECT_ID}`);

            console.log('BODY:', await response.json());

            expect(response.status()).toBe(200);
});

test.only('Create a product', async ({ productApiContext }) => {
    const response = await productApiContext.post(`collections/products/records?project_id=${process.env.PROJECT_ID}`, 
               {
                "data": {
                    "name": "Javascript Book",
                    "price": 500.89,
                    "category": "Education",
                    "in_stock": false
                }
             });

            const responseBody = await response.json();
            console.log('BODY:', responseBody);
            expect(response.status()).toBe(201);
            const isValid = validateProductCreateResponse(responseBody);
            expect(
                isValid,
                JSON.stringify(validateProductCreateResponse.errors, null, 2)
            ).toBe(true);
});

test('Update a product', async ({ productApiContext }) => {
    const response = await productApiContext.put(`collections/products/records/73bd7b01-8aa3-48c9-9527-1df6a0ef4242?project_id=${process.env.PROJECT_ID}`, 
           {
                "data": {
                    "price": 588.89
               }
            });

            console.log(await response.json());     
            expect(response.status()).toBe(200);

        //Validate the record that has been updated
        const confirmation_response = await productApiContext.get(`collections/products/records/400?project_id=${process.env.PROJECT_ID}`);
        expect(confirmation_response.status()).toBe(200);
        expect((await confirmation_response.json()).price).toBe(588.89);
});

test('Delete a product', async ({ productApiContext }) => {
    const response = await productApiContext.delete(`collections/products/records/912/${process.env.PROJECT_ID}`);

         expect(response.status()).toBe(204);
});