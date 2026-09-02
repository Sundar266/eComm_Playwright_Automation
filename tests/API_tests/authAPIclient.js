import { request, expect } from '@playwright/test';

export class authAPIclient{

    constructor(tokenVault){
        this.vault = tokenVault;
        this.apiRequest = null;
    }

    async login(){
        this.apiRequest = await request.newContext({
                            baseURL: process.env.API_TEST_BASE_URL
                        });

        // Login first and get the token
        const response  = await this.apiRequest.post('app-users/login',{
                            headers:{
                                 'Content-Type': 'application/json',
                                 'x-api-key': process.env.API_TEST_KEY   
                            },
                            data:{
                                   'email': process.env.API_TEST_EMAIL,
                                   'project_id':process.env.API_TEST_PROJECT_ID
                            }
                        });

        console.log('LOGIN STATUS:', response.status());
        console.log('LOGIN BODY:', await response.text());
        console.log('RETRY-AFTER:', response.headers()['retry-after']);
        expect((await response).status()).toBe(200);
        
        const responseBody = await response.json();
        return responseBody.token;
    }

    async generateSessionToken(){
        const token =  await this.login();
        //Verify the token received
        const response = await this.apiRequest.post('app-users/verify',{
                                headers:{
                                        'Content-Type': 'application/json'
                                        },
                                data: {
                                       token 
                                      }
                });
        expect(response.status()).toBe(200);
        //Now after verification retrieve the session token
        const res_body = await response.json();
        const session_token =   res_body.session_token;  
        
        this.vault.setToken(session_token);

        return this.vault.getToken();
    }

    async dispose(){
        await this.apiRequest?.dispose();
    }

}