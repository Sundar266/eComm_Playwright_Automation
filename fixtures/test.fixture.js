import { test as base, expect } from '@playwright/test';
import { Logger } from '../utilities/logger.js';
import { ActionValidation } from '../utilities/action.validation.js';
import { DbClient } from '../utilities/dbClient.js';
import { dbAuthData } from '../utilities/dbAuthData.js';

const test = base.extend({
  logger: async ({}, use, testInfo) => {
    const logger = new Logger(testInfo.title);
    await use(logger);
  },
  actionValidation: async ({ page, logger }, use) => {
    await use(new ActionValidation(page, logger));
  },
  dbClient: async ({}, use) => {
    const dbClient = new DbClient(dbAuthData);

    await use(dbClient);
    await dbClient.close();
  }
});

export { test, expect };