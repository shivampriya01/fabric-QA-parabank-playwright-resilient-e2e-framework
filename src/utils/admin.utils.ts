import { Page } from '@playwright/test';
import { logger } from './logger';

//Need to be used when we have to use it explicitly to clean the database afetr 3 retries
export class AdminUtils {
  static async resetDatabase(page: Page) {
    logger.warn('RESILIENCE TRIGGER: Hard resetting ParaBank Database via Admin Panel.');
    await page.goto('https://parabank.parasoft.com/parabank/admin.htm');
    // ParaBank admin has a button to 'Clean' or 'Initialize' the DB
    await page.getByRole('button', { name: 'Clean' }).click();
    await page.getByRole('button', { name: 'Initialize' }).click();
    logger.info('Database Environment restored to factory settings.');
  }
}