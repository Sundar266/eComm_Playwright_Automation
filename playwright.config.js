import dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';
import * as yaml from 'js-yaml';
import fs from 'fs/promises';

const env = process.env.ENV || 'QA';
const isCI = process.env.CI === 'true';

dotenv.config({ path: `${env}.env` });

const config = await fs.readFile('config.yml', 'utf8');
const yaml_data = yaml.load(config, { schema: yaml.DEFAULT_SCHEMA });

if(!isCI){
    process.env.USER_NAME = yaml_data[env].USER_NAME;
    process.env.PASSWORD = yaml_data[env].PASSWORD;
}

export default defineConfig({
  testDir: './tests',

  timeout: 30_000,
  globalTimeout: isCI ? 15 * 60 * 1_000 : undefined,
  expect: {
    timeout: 10_000
  },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  outputDir: 'test-results',
  preserveOutput: 'failures-only',

  use: {
    baseURL: process.env.BASE_URL || 'https://www.rahulshettyacademy.com',
    headless: process.env.HEADED !== 'true',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    viewport: null,
    launchOptions: {
      args: ['--start-maximized']
    }
  },

  projects: [
    {
      name: 'setup',
      testDir: './auth-setup',
      testMatch: /auth\.setup\.js/
    },
    {
      name: 'LoginPageTests',
      testDir: './tests/login',
      //Desktop Chrome supplies deviceScaleFactor, which Playwright rejects when that project sets 
      // viewport: null. hence, removing that device setting only for the login project, preserving 
      // host-sized maximization. viewport: null is repeated because the Login Page Tests project spreads this preset
      // That preset includes its own fixed viewport, typically, hence removing
      use: { ...devices['Desktop Chrome'], viewport: null, deviceScaleFactor: undefined }
    },
    {
      name: 'chrome',
      testDir: './tests',
      testIgnore: '**/login/**',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json'
      }
    }
  ],

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results', attachments: true }]
  ]
});