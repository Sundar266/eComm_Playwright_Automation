import { request } from '@playwright/test';

export class BaseAPIclient {
    
    constructor({ baseURL = process.env.API_TEST_BASE_URL } = {}) {
        this.baseURL = baseURL;
        this.apiContext = null;
    }

    async createApiContext(sessionToken) {
        if (!sessionToken) {
            throw new Error('A session token is required to create the API context');
        }

        this.apiContext = await request.newContext({
            baseURL: this.baseURL,
            extraHTTPHeaders: {
                'x-api-key': process.env.API_TEST_API_KEY,
                'Authorization': `Bearer ${sessionToken}`,
                'Content-Type': 'application/json'
            }
        });

        return this.apiContext;
    }

    async dispose() {
        await this.apiContext?.dispose();
    }
}
