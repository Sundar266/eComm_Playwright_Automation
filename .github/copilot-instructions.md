---
applyTo: "**/*.{js,ts,json,yml,yaml,md}"
description: "Repository-wide instructions for Playwright automation work in the eCommerce framework."
---

# Copilot instructions for the Playwright E-commerce framework

## Project context

This repository is a Playwright-based end-to-end automation suite for a web application. The codebase follows a page-object model with common test fixtures and utilities, and it is structured for browser automation, cross-browser validation, and environment-aware configuration.

## Core conventions

- Use ES modules (`import`/`export`) and keep JavaScript files consistent with the repo's existing style.
- Prefer the Playwright fixtures from `fixtures/test.fixture.js` when adding new tests.
- Keep page logic in `pages/` and automate user actions through page objects rather than raw page calls inside test specs.
- Keep reusable logic in `utilities/` and keep tests focused on scenarios and assertions.
- Store static data in `testData/` and use immutable JSON objects when data is loaded.
- Use `process.env` values supplied by `config.yml`, `qa.env`, and the Playwright config as the source of environment details.

## Test architecture

- `playwright.config.js` is the source of truth for browser projects, setup dependencies, retries, reporters, and environment loading.
- `auth-setup/auth.setup.js` handles authentication state generation for browser projects.
- Browser projects are configured with `setup`, `LoginPageTests`, `windows-chrome`, `firefox`, and `bussiness-tests`.
- `test.describe()` blocks should include regression tags when relevant, such as `@Regression`.

## Coding standards

- Reuse `BasePage` helpers for common interactions when appropriate.
- Prefer explicit, readable assertions with Playwright `expect`.
- Log meaningful operational progress with the injected `logger` fixture.
- Use `actionValidation` for multi-step UI validation patterns when a page action requires URL and element checks together.
- Avoid flaky timing logic; prefer Playwright waits and locators over fixed delays.
- Keep selectors stable, targeted, and aligned with the page object structure.

## MCP and browser workflow

- Use the configured Playwright MCP server for browser-driven validation when a task needs a live UI check or browser interaction trace.
- Treat the MCP server as a tool for exploration, verification, and debugging rather than a replacement for stable page-object automation.
- When a test is failing or behaving unexpectedly, validate the actual browser state before rewriting logic.

## Commands

- Run the full suite: `npm test`
- Run auth setup: `npm run auth:setup`
- Run a single browser project: `npx playwright test --project=windows-chrome`
- Generate allure report: `npm run allure:generate`

## Safety and quality

- Do not introduce hidden global state or mutate shared data in ways that cross tests.
- Prefer small, specific code changes over broad refactors.
- When fixing a failing test, identify the root cause in the locator, page object, or environment assumptions before patching.
- Keep changes consistent with the existing project structure and naming patterns.

## Preferred output for automation work

When creating new automation flows, provide:

1. Scope and intent of the scenario.
2. Test data assumptions.
3. Page objects and fixtures affected.
4. Validation criteria.
5. Execution command to run the relevant Playwright project.
