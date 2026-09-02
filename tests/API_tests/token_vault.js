export class TokenVault {

    constructor() {
        this.sessionToken = null;
    }

    getToken() {
        return this.sessionToken;
    }

    setToken(token) {
        if (!token) {
            throw new Error('A session token is required');
        }

        this.sessionToken = token;
    }

    clearToken() {
        this.sessionToken = null;
    }
}

export const tokenVault = new TokenVault();