# Sign Out Scenarios

## Objective
Validate the user sign-out flow for the Rahul Shetty Academy e-commerce application and confirm the authenticated session is terminated correctly.

## Prerequisites
- Application under test is available at: https://rahulshettyacademy.com/client/#/auth/login
- A valid user account is available and credentials are loaded through the existing Playwright environment setup (`config.yml` / `qa.env`)
- The test environment supports the current Playwright architecture with browser projects and auth flow defined in `playwright.config.js`
- The user is already authenticated and the dashboard is loaded with the `Sign Out` action visible
- Browser storage/session state should be valid before executing logout validation

## Scenario Index

### S1 - Successful sign out from dashboard returns user to login screen
- Tag: E2E / @Regression
- Priority: High
- Pre-requisites:
  - User is logged in successfully
  - Dashboard page is visible
  - The `Sign Out` button is displayed in the top navigation area
- Steps:
  1. Navigate to the application login page
  2. Log in with valid credentials
  3. Wait for the dashboard to load
  4. Click the `Sign Out` button
- Expected result:
  - The application redirects to the login page
  - The login form is visible again
  - The URL contains the login route (`#/auth/login`)
  - The authenticated dashboard is no longer accessible without re-login

### S2 - Sign out clears the active session and prevents stale dashboard access
- Tag: @Regression
- Priority: Medium
- Pre-requisites:
  - A valid user session exists
  - The user has already reached the dashboard after login
- Steps:
  1. Log in with valid credentials
  2. Open the dashboard
  3. Click `Sign Out`
  4. Attempt to navigate back to a dashboard route or reload the authenticated page
- Expected result:
  - The user remains on the login page after sign-out
  - The dashboard or protected routes are not accessible without a fresh login
  - No stale session state is retained for protected pages

## Notes for Framework Alignment
- These scenarios follow the current Playwright structure by validating core user journeys at the browser level, using the same login/auth assumptions already used in the project.
- The regression tag is aligned with the existing framework pattern (`test.describe(..., { tag: '@Regression' })`).
- The end-to-end flow mirrors the real user experience on the app’s dashboard and login transitions.

## Validation Command
- Run the relevant Playwright project for authenticated app flow after implementation:
  - `npx playwright test --project=windows-chrome`
