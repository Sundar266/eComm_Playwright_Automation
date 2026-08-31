---
applyTo: "**/*.{js,ts}"
description: "Use when editing Playwright tests, page objects, fixtures, utilities, or config files in this repository."
---

# Playwright framework standards

## Scope

Apply these instructions when working in `tests/`, `pages/`, `fixtures/`, `utilities/`, `auth-setup/`, and `playwright.config.js`.

## Required patterns

- Keep tests scenario-based and business-readable.
- Use page objects for page-specific interactions and assertions.
- Extend the shared Playwright fixture in `fixtures/test.fixture.js` instead of creating local ad hoc fixtures.
- Use the repo logger for actionable messages when an action or validation is important.
- Reuse `ActionValidation` for actions that combine multiple expectations.

## Test design rules

- Validate real user outcomes, not implementation details.
- Prefer robust selector strategies such as role-based locators and meaningful text selectors over CSS-heavy selectors when possible.
- Use `test.describe()` blocks with relevant tags for regression grouping.
- Keep test names descriptive and aligned with user behavior.

## Page object rules

- Add reusable browser actions to `BasePage` when they are shared by multiple page objects.
- Keep page object methods specific and deterministic.
- Do not mix test assertions into page objects unless the assertion is directly part of the page behavior.
- Pass dependencies like `page` and `logger` via constructor injection.

## Environment rules

- Respect the environment loading in `playwright.config.js`.
- Do not hardcode credentials or URLs in tests unless they are clearly test-specific fixtures.
- Use `config.yml` and environment variables for environment configuration outside of explicit test data.

## Validation rules

- For action validation, confirm both visible state and the expected page outcome when relevant.
- After a UI change, update selectors or locators in the page objects before adding new tests.
- For flaky issues, prefer deterministic waits and explicit assertions over artificial sleeps.

## Execution checklist

Before finalizing changes, verify:

1. The affected test still targets the correct browser project.
2. The page object remains centralized and reusable.
3. The new code follows ESM and repo naming patterns.
4. The test is executed by the appropriate Playwright command and passes.
