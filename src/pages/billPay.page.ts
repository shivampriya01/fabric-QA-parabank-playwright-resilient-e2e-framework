import { BasePage } from '../core/base.page';
import { Locator, expect } from '@playwright/test';

export class BillPayPage extends BasePage {
  private readonly payeeNameLocator =  this.page.locator('input[name="payee\\.name"]');;
  private readonly payeeAddressStreetLocator = this.page.locator('input[name="payee\\.address\\.street"]');
  private payeeAddressCityLocator = this.page.locator('input[name="payee\\.address\\.city"]');
  private payeeAddressStateLocator = this.page.locator('input[name="payee\\.address\\.state"]');
  private payeeAddressZipCodeLocator = this.page.locator('input[name="payee\\.address\\.zipCode"]');
  private payeePhoneNumberLocator = this.page.locator('input[name="payee\\.phoneNumber"]');
  private payeeAccountNumberLocator = this.page.locator('input[name="payee\\.accountNumber"]');
  private verifyAccountLocator = this.page.locator('input[name="verifyAccount"]');
  private billPayamountLocator = this.page.locator('input[name="amount"]');
  private fromAcctDrpDown = this.page.locator('select[name="fromAccountId"]'); 
  private sendPaymentButtonLocator = this.page.getByRole('button', { name: 'Send Payment' });
  private billpayResultLocator = this.page.locator('#billpayResult');

  async fillBillPaymentForm(payeeName: string, payeeAddressStreet: string, payeeAddressCity: string, payeeAddressState: string, payeeAddressZipCode: string, payeePhoneNumber: string, payeeAccountNumber: string, verifyAccount: string, amount: string, fromAccountID: string) {
    await this.payeeNameLocator.click();
    await this.payeeNameLocator.fill(payeeName);
    await this.payeeAddressStreetLocator.click();
    await this.payeeAddressStreetLocator.fill(payeeAddressStreet);
    await this.payeeAddressCityLocator.click();
    await this.payeeAddressCityLocator.fill(payeeAddressCity);
    await this.payeeAddressStateLocator.click();
    await this.payeeAddressStateLocator.fill(payeeAddressState);
    await this.payeeAddressZipCodeLocator.click();
    await this.payeeAddressZipCodeLocator.fill(payeeAddressZipCode);
    await this.payeePhoneNumberLocator.click();
    await this.payeePhoneNumberLocator.fill(payeePhoneNumber);
    await this.payeeAccountNumberLocator.click();
    await this.payeeAccountNumberLocator.fill(payeeAccountNumber);
    await this.verifyAccountLocator.click();
    await this.verifyAccountLocator.fill(verifyAccount);
    await this.billPayamountLocator.click();
    await this.billPayamountLocator.fill(amount);
    await this.fromAcctDrpDown.selectOption(fromAccountID);
  } 

  async sendPayment() {
    await this.sendPaymentButtonLocator.click();
  }

  async verifyBillPayment() {
    await expect(this.billpayResultLocator).toBeVisible();
    await expect(this.billpayResultLocator).toContainText('Bill Payment Complete');
  }
}