import { test, expect } from '../../fixtures/api.fixture.js';

test('test GET request with an authenticated API context', async ({ apiContext }) => {

    const response = await apiContext.get('users');

    console.log('STATUS:', response.status());
    console.log('URL:', response.url());
    console.log('BODY:', await response.text());

    expect(response.status()).toBe(200);
});