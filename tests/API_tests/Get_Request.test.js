import { test, expect } from '../../fixtures/api.fixture.js';

test.only('Test GET request with an authenticated API context', async ({ apiContext }) => {

    const response = await apiContext.get('collections/products/records');

    console.log('STATUS:', response.status());
    console.log('URL:', response.url());
    console.log('BODY:', await response.json());

    expect(response.status()).toBe(200);
});