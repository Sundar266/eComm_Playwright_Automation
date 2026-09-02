export class TokenVault {

    constructor() {
        this.sessionToken = null;
    }

    async getToken() {
        return this.sessionToken;
    }

    async setToken(token) {
        if (!token) {
            throw new Error('A session token is required');
        }

        this.sessionToken = token;
    }
}

export const tokenVault = new TokenVault();