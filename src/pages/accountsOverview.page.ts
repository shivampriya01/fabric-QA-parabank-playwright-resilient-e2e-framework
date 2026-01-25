import { BasePage } from '../core/base.page';
import { expect } from '@playwright/test';
import { logger } from '../utils/logger';

export class AccountsOverviewPage extends BasePage {

  private readonly accountTable = this.page.locator('#accountTable');
  private readonly tableRows = this.page.locator('#accountTable tbody tr');

  async verifyAccountVisible(account: string) {
    logger.info(`Verifying visibility of Account: ${account}`);
    await expect(this.page.getByText(account)).toBeVisible();
  }
  
  //Row-level validation for the specific row for an account ID and verifies its balance columns.
  async validateAccountBalance(accountId: string, expectedBalance: string) {
    logger.info(`Validating balance for Account: ${accountId}`);

    const row = this.tableRows.filter({ has: this.page.getByRole('link', { name: accountId }) });
    
    // Ensure the row exists before proceeding
    await expect(row).toBeVisible({ timeout: 5000 });

    // ParaBank Table Structure: 
    // Col 1: Account | Col 2: Balance | Col 3: Available Amount
    const balCell = row.locator('td').nth(1);
    const avlAmtCell = row.locator('td').nth(2);

    const actualBalance = await balCell.textContent();
    const actualAvailable = await avlAmtCell.textContent();

    // Assertions with descriptive error messages
    expect(actualBalance?.trim(), `Balance mismatch for ${accountId}`).toBe(expectedBalance);
    expect(actualAvailable?.trim(), `Available amount mismatch for ${accountId}`).toBe(expectedBalance);
    
    logger.info(`Verified: Account ${accountId} has balance ${expectedBalance}`);
  }
}