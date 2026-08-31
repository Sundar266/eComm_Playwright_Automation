import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';

const testDataPath = './testData/data.json';
const rawData = readFileSync(testDataPath);
const JSONData = JSON.parse(rawData);

async function debug() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Login
    await page.goto('https://rahulshettyacademy.com/client/');
    await page.fill('input[type="email"]', JSONData.loginCredentials.email);
    await page.fill('input[type="password"]', JSONData.loginCredentials.password);
    await page.click('input[value="Login"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
    
    console.log('✓ Logged in successfully');
    
    // Add products to cart
    await page.click('text="Cart"');
    await page.click('text="Checkout"');
    
    // Fill payment details
    const textInputs = page.locator('input[type="text"], input:not([type])');
    await textInputs.nth(0).fill('4542991234567890');
    await textInputs.nth(1).fill('212');
    await textInputs.nth(2).fill('Test User');
    await page.fill('input[placeholder="Select Country"]', 'India');
    await page.click('text="India"');
    
    // Click Place Order
    const buttons = await page.locator('button').all();
    for (let btn of buttons) {
        const text = await btn.innerText();
        if (text.toLowerCase().includes('place order')) {
            await btn.click();
            break;
        }
    }
    
    await page.waitForLoadState('networkidle');
    console.log('✓ Order placed');
    
    // Now debug the success page
    await page.waitForTimeout(1000);
    
    // Escape to close any modals
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // Get all buttons and links
    const allElements = await page.locator('button, a').all();
    console.log('\n=== ALL BUTTONS AND LINKS ===');
    for (let elem of allElements) {
        const text = await elem.textContent().catch(() => '');
        const tag = await elem.evaluate(el => el.tagName);
        const classList = await elem.evaluate(el => el.className);
        const visible = await elem.isVisible().catch(() => false);
        
        if (text.trim() && (text.toLowerCase().includes('download') || 
                             text.toLowerCase().includes('csv') ||
                             text.toLowerCase().includes('click') ||
                             visible)) {
            console.log(`${tag} | Text: "${text.trim()}" | Class: "${classList}" | Visible: ${visible}`);
        }
    }
    
    // Try to find by other means
    console.log('\n=== CHECKING FOR CSV/DOWNLOAD LINKS ===');
    const csvElements = await page.locator('[href*="csv"], [href*="download"]').all();
    for (let elem of csvElements) {
        const text = await elem.textContent();
        const href = await elem.getAttribute('href');
        console.log(`Found: ${text} -> ${href}`);
    }
    
    // Check page content
    const pageContent = await page.content();
    if (pageContent.includes('Click To Download')) {
        console.log('\n✓ "Click To Download" found in page HTML');
    }
    if (pageContent.includes('CSV')) {
        console.log('✓ "CSV" found in page HTML');
    }
    
    await browser.close();
}

debug().catch(console.error);
