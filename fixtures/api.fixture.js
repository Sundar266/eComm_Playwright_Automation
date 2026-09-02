import { test as base, expect } from './test.fixture.js';
import { authAPIclient } from '../tests/API_tests/authAPIclient.js';
import { BaseAPIclient } from '../tests/API_tests/BaseAPIclient.js';

const test = base.extend({
    apiContext: async ({}, use) => {
        const authClient = new authAPIclient();
        const sessionToken = await authClient.generateSessionToken();
        const apiClient = new BaseAPIclient();
        try{
            const apiContext = await apiClient.createApiContext(sessionToken);
            await use(apiContext);
        }
        finally {
            await apiClient.dispose();
        }
    }
});

export { test, expect };
