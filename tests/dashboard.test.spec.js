import { test, expect } from '../fixtures/test.fixture.js';
import { DashboardPage } from '../pages/DashboardPage.js';

const seededRecordIds = [];

test.describe('Dashboard Tests', () => {
  test.beforeEach(async ({ dbClient, logger }) => {
    if (process.env.DB_ENABLED !== 'true') {
      logger.debug('Database seeding is disabled, check your config file');
      return;
    }

    const result = await dbClient.execute(
      'SELECT * FROM ABCTABLE WHERE ID = :dir AND TYPE = :type',
      {
        name: 'Playwright dashboard test data',
        id: { dir: 3003, type: 2010 }
      },
      { autoCommit: true }
    );

    seededRecordIds.push(result.rows.map((row) => row.ID));
    logger.info('Test data seeded');
  });


  test('dashboard is displayed after login', async ({ page, logger, actionValidation }) => {
    const dashboardPage = new DashboardPage(page, logger);
    await dashboardPage.open();

    await actionValidation.validate([
      { type: 'url', expected: /dashboard\/dash/ },
      { type: 'locator', locator: dashboardPage.homeMenu },
      { type: 'locator', locator: dashboardPage.productsHeading }
    ]);

    await expect(dashboardPage.homeMenu).toBeVisible();
  });

  test.afterEach(async ({ dbClient, logger }) => {
    if (process.env.DB_ENABLED !== 'true' || seededRecordIds.length === 0) {
      return;
    }

    await dbClient.execute(
       'DELETE FROM ABCTABLE WHERE ID IN (:ids)',
        { ids: seededRecordIds },
        { autoCommit: true }
    );
    logger.info('Test data deleted');
  });
});
