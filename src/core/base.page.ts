import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/logger';

export abstract class BasePage {
  constructor(protected page: Page) {

  }

  protected async click(locator: Locator, description: string) {
    await expect(locator).toBeVisible();
    await locator.click();
    logger.info(`Clicked: ${description}`);
  }

  protected async fill(locator: Locator, value: string, description: string) {
    await expect(locator).toBeVisible();
    await locator.fill(value);
    logger.info(`Filled ${description} with: ${value}`);
  }

  protected async getText(locator: Locator): Promise<string> {
    await expect(locator).toBeVisible();
    return (await locator.textContent())?.trim() || '';
  }

}
