import { test as base, expect } from './test.fixture.js';
import { generateSessionToken } from '../tests/API_tests/authAPIclient.js';
import { BaseAPIclient } from '../tests/API_tests/BaseAPIclient.js';

const test = base.extend({
    apiContext: async ({}, use) => {
        const sessionToken = await generateSessionToken();
        const apiClient = new BaseAPIclient();
        const apiContext = await apiClient.createApiContext(sessionToken);

        await use(apiContext);
        await apiClient.dispose();
    }
});

export { test, expect };
