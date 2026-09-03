import { test, expect } from '../../fixtures/api.fixture.js';

test('ReqRes collections', async ({ apiContext }) => {

    const response = await apiContext.get(`collections?project_id=49042`);

    console.log('STATUS:', response.status());
    console.log('URL:', response.url());
    console.log('BODY:', await response.text());

    expect(response.status()).toBe(200);
});


test.only('Get records using session token', async ({ apiContext }) => {
    const response = await apiContext.get(`products`);

    console.log('STATUS:', response.status());
    console.log('URL:', response.url());
    console.log('BODY:', await response.text());

    expect(response.status()).toBe(200);
});