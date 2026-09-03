// import { test, expect } from '../../fixtures/api.fixture.js';
// import Ajv from 'ajv';
// import addFormats from 'ajv-formats';
// import productCreateResponseSchema from '../../testData/product-create-response.schema.json' with { type: 'json' };

// const ajv = new Ajv({ allErrors: true });
// addFormats(ajv);
// const validateProductCreateResponse = ajv.compile(productCreateResponseSchema);

// test.describe('ReqRes product API Tests', () => {

//     let id = null;

//     test.step('Create a product', async ({ productApiContext }) => {
//             const response = await productApiContext.post(`products/records/${process.env.PROJECT_ID}`, 
//                    {
//                         "data": {
//                             "name": "MM Gloves",
//                             "price": 159.99,
//                             "category": "Sports",
//                             "in_stock": true
//                        }
//                     });
        
//             const responseBody = await response.json();
        
//             expect(response.status()).toBe(201);
//             expect(
//                 validateProductCreateResponse(responseBody),
//                 JSON.stringify(validateProductCreateResponse.errors, null, 2)
//             ).toBe(true);
//         });

//     test.step('Update a product', async ({ productApiContext }) => {
//             const response = await productApiContext.post(`products/records/351/${process.env.PROJECT_ID}`, 
//            {
//                 "data": {
//                     "price": 170.99
//                }
//             });

//              console.log(await response.json());
//              id = (await response.json()).id;        
//              expect(response.status()).toBe(201);

//             //Validate the record that has been updated
//             const confirmation_response = await productApiContext.get(`products/records/${id}/${process.env.PROJECT_ID}`);
//             expect(confirmation_response.status()).toBe(200);
//             expect((await confirmation_response.json()).data.price).toBe(170.99);   
//     });

//     test.step('Delete a product', async ({ productApiContext }) => {
//          const response = await productApiContext.delete(`products/records/${id}/${process.env.PROJECT_ID}`);

//          expect(response.status()).toBe(204);
//     });
// });    