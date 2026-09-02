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

        conole.log(sessionToken);
        this.apiContext = await request.newContext({
            baseURL: this.baseURL,
            extraHTTPHeaders: {
                'Authorization': `Bearer ${sessionToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(this.apiContext.json());
        return this.apiContext;
    }

    async dispose() {
        await this.apiContext?.dispose();
    }
}
