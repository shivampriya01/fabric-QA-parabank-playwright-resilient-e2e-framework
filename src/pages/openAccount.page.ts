import { BasePage } from '../core/base.page';

export class OpenAccountPage extends BasePage {
  private accountTypeSelect = this.page.locator('#type');
  private fromAccountIdSelect = this.page.locator('#fromAccountId');
  private openAccountBtn = this.page.getByRole('button', { name: 'Open New Account' });
  private newAccountId = this.page.locator('#newAccountId');

  async openAccount(type: 'CHECKING' | 'SAVINGS'): Promise<string> {
    await this.page.waitForTimeout(1000); // UI stability wait for dynamic dropdown
    await this.accountTypeSelect.selectOption(type);
    await this.click(this.openAccountBtn, 'Open Account Button');
    const id = await this.getText(this.newAccountId);
    return id;
  }
}