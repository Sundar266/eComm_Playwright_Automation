import { expect } from '@playwright/test';

class ActionValidation {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
    this.results = [];
  }

  async validate(validations) {
    const validationList = Array.isArray(validations) ? validations : [validations];

    this.results = await Promise.all(validationList.map((validation) => this.#runValidation(validation)));

    if (!this.results.some((result) => result.passed)) {
      const failures = this.results
        .map((result) => result.error)
        .filter(Boolean) // This says if the error is not false, null, "", 0 or undefined, then only add it to the failures array
        .join('; ');

      this.logger.error(`All validations failed: ${failures}`);
      throw new Error(`All validations failed: ${failures}`);
    }

    this.logger.info(`${this.results.filter((result) => result.passed).length} validation(s) passed`);
    return this.results;
  }

  async actionWithRetry(action, validations = []) {
    const maxRetries = 1;
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        await action(); // This is to execute the action that you want to perform, like clicking a button or filling a form.
                        // Pass it as a arrow function like this: async () => { await page.click('button#submit'); }    
        const results = await this.validate(validations);

        if (attempt > 0) {
          this.logger.info(`Action succeeded after retry ${attempt}/${maxRetries}`);
        }

        return results;
      } catch (error) {
        lastError = error;

        if (attempt < maxRetries) {
          this.logger.warn(`Action failed; retrying ${attempt + 1}/${maxRetries}: ${error.message}`);
        }
      }
    }

    this.logger.error(`Action failed after ${maxRetries} retry: ${lastError.message}`);
    throw lastError; // This will throw the last error encountered after all retries have been exhausted.
                    // Because return results will be executed successfully before this is reached
  }

  async #runValidation(validation) {
    try {
      switch (validation.type) {
        case 'text':
          await expect(validation.locator).toContainText(validation.expected);
          break;
        case 'url':
          await expect(this.page).toHaveURL(validation.expected);
          break;
        case 'locator':
          await expect(validation.locator).toBeVisible();
          break;
        default:
          throw new Error(`Unsupported validation type: ${validation.type}`);
      }

      return { validation, passed: true };
    } catch (error) {
      return { validation, passed: false, error: error.message };
    }
  }
}

export { ActionValidation };