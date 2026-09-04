import { test, expect } from '../../fixtures/api.fixture.js';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import collectionsResponseSchema from '../../testData/collections-response.schema.json' with { type: 'json' };

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateCollectionsResponse = ajv.compile(collectionsResponseSchema);

test('Test collections api', async ({ apiContext }) => {
    const startTime = Date.now();
    const response = await apiContext.get(`collections?project_id=${process.env.PROJECT_ID}`);
    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(5000);

    const responseBody = await response.json();
    console.log('STATUS:', response.status());
    console.log('RESPONSE TIME (ms):', responseTime);
    console.log('BODY:', responseBody);

    expect(responseBody).toHaveProperty('data');
    expect(Array.isArray(responseBody.data)).toBeTruthy();
    expect(responseBody.data.length).toBeGreaterThan(0);

    const isValid = validateCollectionsResponse(responseBody);
    expect(isValid, JSON.stringify(validateCollectionsResponse.errors, null, 2)).toBe(true);

    const collectionNames = responseBody.data.map((collection) => collection.name);
    expect(collectionNames).toContain('Products');

    responseBody.data.forEach((collection) => {
        expect(collection).toHaveProperty('id');
        expect(collection).toHaveProperty('project_id');
        expect(collection).toHaveProperty('user_id');
        expect(collection).toHaveProperty('name');
        expect(collection).toHaveProperty('slug');
        expect(collection).toHaveProperty('visibility');
        expect(collection).toHaveProperty('created_at');
        expect(collection).toHaveProperty('updated_at');
        expect(collection.project_id).toBe(Number(process.env.PROJECT_ID || process.env.API_TEST_PROJECT_ID));
    });
});