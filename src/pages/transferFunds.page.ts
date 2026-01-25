import { BasePage } from '../core/base.page';
import { expect } from '@playwright/test';
import { logger } from '../utils/logger';

export class TransferFundsPage extends BasePage {
  private amountInput = this.page.locator('#amount');
  private fromAcctDrpDown = this.page.locator('select[id="fromAccountId"]');
  private toAcctDrpDown = this.page.locator('select[id="toAccountId"]');
  private transferBtn = this.page.getByRole('button', { name: 'Transfer' });
  private successMsg = this.page.locator('#rightPanel #showResult h1');

    /**
   * Intelligent Fund Transfer - Dynamically selects a 'To' account that is distinct from the 'From' account.
   * @param amount The string value to transfer (e.g. "100")
   * @param fromAccountID The account ID captured in the previous step
   * @returns The 'targetAccountID' that was selected, for verification purposes.
   */
  async transferFunds(transferAmount: string, fromAccountID: string): Promise<string> {
    logger.info(`Initiating transfer of $${transferAmount} from ${fromAccountID}`);

    // Wait for dropdowns to populate
    await this.fromAcctDrpDown.waitFor({ state: 'visible' });

    // Select the Source Account
    await expect(async () => {
      await this.fromAcctDrpDown.selectOption(fromAccountID);
    }).toPass({ timeout: 5000 });

    // Dynamic 'To' Selection - Fetch all available options in the 'To' dropdown
    const options = await this.toAcctDrpDown.locator('option').allInnerTexts();
    
    // Find the first account that IS NOT the 'fromAccountID'
    const targetAccountID = options.find(acc => acc.trim() !== fromAccountID && acc.trim() !== "");
    
    if (!targetAccountID) {
      throw new Error(`Test Failure: No distinct 'To' account available. Options: ${options.join(', ')}`);
    }

    await this.toAcctDrpDown.selectOption(targetAccountID);
    logger.info(`Target account auto-selected: ${targetAccountID}`);

    // Execute Transfer
    await this.amountInput.fill(transferAmount);
    await this.click(this.transferBtn, 'Transfer');

    // Verification
    await expect(this.successMsg).toBeVisible({ timeout: 3000 });
    await expect(this.successMsg).toHaveText('Transfer Complete!');
    
    // Verify the specific transaction message details
    const TransacMsgText = this.page.locator('#showResult p').first();
    await expect(TransacMsgText).toBeVisible();
    const TransacMsgTextArray = TransacMsgText.allInnerTexts();
    const combinedTransacMsgText = (await TransacMsgTextArray).join(' ');
    logger.info(`Successful Transaction Message: ${combinedTransacMsgText}`);
    expect(combinedTransacMsgText).toContain(`$${transferAmount} has been transferred from account #${fromAccountID} to account #${targetAccountID}`);

    return targetAccountID;
  }
}