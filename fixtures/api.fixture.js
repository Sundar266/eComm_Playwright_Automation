import { test as base, expect } from './test.fixture.js';
import { BaseAPIclient } from '../tests/API_tests/BaseAPIclient.js';

const test = base.extend({
    apiContext: async ({}, use) => {
        const apiClient = new BaseAPIclient();
        try {
            const apiContext = await apiClient.createApiContext();
            await use(apiContext);
        } finally {
            await apiClient.dispose();
        }
    }
});

export { test, expect };