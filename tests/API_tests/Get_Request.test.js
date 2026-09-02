import { test, expect } from '../../fixtures/api.fixture.js';

test('test GET request with an authenticated API context', async ({ apiContext }) => {

    const response = await apiContext.get('users');
    console.log(await response.json());
    expect(response.status()).toBe(200);
});
