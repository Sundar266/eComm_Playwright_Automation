import { request, expect } from '@playwright/test';
import { TokenVault } from './token_vault.js';

export async function generateSessionToken(vault = new TokenVault()) {
    const apiRequest = await request.newContext({
        baseURL: process.env.API_TEST_BASE_URL,
        extraHTTPHeaders: { 'x-api-key': process.env.API_TEST_KEY, 'Content-Type': 'application/json' }
    });

    try {
        const login = await apiRequest.post('app-users/login', {
            headers: { 'Content-Type': 'application/json' },
            data: {
                email: process.env.API_TEST_EMAIL,
                project_id: process.env.API_TEST_PROJECT_ID
            }
        });

        console.log('Login Response:', await login.json());
        expect(login.status()).toBe(200);
        expect(login.ok()).toBeTruthy();
        const { token } = await login.json();

        const verify = await apiRequest.post('app-users/verify', {
            headers: { 'Content-Type': 'application/json' },
            data: { token }
        });

        expect(verify.status()).toBe(200);
        expect(verify.ok()).toBeTruthy();
        const { session_token: sessionToken } = await verify.json();

        await vault.setToken(sessionToken);
        return vault.getToken();
    } finally {
        await apiRequest.dispose();
    }
}
