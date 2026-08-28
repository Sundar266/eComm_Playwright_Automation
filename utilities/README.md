# Utilities

## Logger

Import the custom Playwright fixture in spec files:

```javascript
import { test, expect } from '../fixtures/test.fixture.js';

test('Login Test', async ({ page, logger }) => {
  await page.getByRole('button', { name: 'Login' }).click();
  logger.info('Login button clicked');
});
```

Example output:

```text
[2026-08-28-14-48][INFO][Login Test]['Login button clicked']
```

Available methods:

- `logger.info(message)` for normal test progress
- `logger.warn(message)` for recoverable or unexpected conditions
- `logger.error(message)` for failures or error details
- `logger.debug(message)` for diagnostic details

## Action validation

The `actionValidation` fixture accepts one validation object or an array of objects. The overall validation passes when at least one validation passes:

```javascript
import { test, expect } from '../fixtures/test.fixture.js';

test('Login Test', async ({ page, actionValidation }) => {
  await actionValidation.actionWithRetry(
    () => page.getByRole('button', { name: 'Login' }).click(),
    [
      { type: 'url', expected: /inventory\.html/ },
      { type: 'text', locator: page.getByText('Products'), expected: 'Products' },
      { type: 'locator', locator: page.getByRole('button', { name: 'Open Menu' }) }
    ]
  );
});
```

Supported validation types:

- `text`: checks `locator` with `expected` using `toContainText`
- `url`: checks the page URL with `expected` using `toHaveURL`
- `locator`: checks that `locator` is visible

`actionWithRetry` performs the action and validations once, then retries exactly once if either fails. Retry attempts and final failures are sent to the injected logger. Results are also available from `actionValidation.results` after validation.

## Base page

Page objects can extend `BasePage` to reuse browser actions and logging:

```javascript
import { LoginPage } from '../pages/LoginPage.js';

test('Login Test', async ({ page, logger }) => {
  const loginPage = new LoginPage(page, logger);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
});
```

`BasePage` provides `click(locator, message)`, `fill(locator, value, message)`, `goto(url, message)`, and `getText(locator, message)`.

## Database client

`dbClient` is injected by the Playwright fixture and closes automatically after each test:

```javascript
test.beforeEach(async ({ dbClient }) => {
  if (process.env.DB_ENABLED === 'true') {
    await dbClient.execute(
      'INSERT INTO AUTOMATION_TEST_DATA (NAME) VALUES (:name)',
      { name: 'dashboard test data' },
      { autoCommit: true }
    );
  }
});
```

Database settings are read from `utilities/dbAuthData.js`, which uses `DB_USER`, `DB_PASSWORD`, and `DB_CONNECT_STRING`. Set `DB_ENABLED=true` only after Oracle is available and the target table exists. The default is `false`, so browser tests do not attempt a database connection on this machine.
