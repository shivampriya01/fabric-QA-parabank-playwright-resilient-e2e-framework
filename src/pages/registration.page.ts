import { BasePage } from '../core/base.page';
import { UserData, generateUser } from '../utils/data.generator';
import { logger } from '../utils/logger';

export class RegistrationPage extends BasePage {
  // Selectors using ParaBank's specific name/id attributes for Registration Page
  private readonly firstNameInput = this.page.locator('input[id="customer.firstName"]');
  private readonly lastNameInput = this.page.locator('input[id="customer.lastName"]');
  private readonly addressInput = this.page.locator('input[id="customer.address.street"]');
  private readonly cityInput = this.page.locator('input[id="customer.address.city"]');
  private readonly stateInput = this.page.locator('input[id="customer.address.state"]');
  private readonly zipInput = this.page.locator('input[id="customer.address.zipCode"]');
  private readonly phoneInput = this.page.locator('input[id="customer.phoneNumber"]');
  private readonly ssnInput = this.page.locator('input[id="customer.ssn"]');
  private readonly usernameInput = this.page.locator('input[id="customer.username"]');
  private readonly passwordInput = this.page.locator('input[id="customer.password"]');
  private readonly confirmPassInput = this.page.locator('input[id="repeatedPassword"]');
  private readonly registerBtn = this.page.getByRole('button', { name: 'Register' });
  
  // Validation for Error Locator
  private readonly usernameError = this.page.locator('span[id="customer.username.errors"]');

  // Self-healing registration -> Detects collisions, clears state, and regenerates data automatically.
  async registerResiliently(maxRetries = 3): Promise<UserData> { //can change retries, currently set to 3
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const user = generateUser(); // New UUID generated here
      logger.info(`Registration Attempt ${attempt}/${maxRetries} for: ${user.username}`);

      // Step 1: Fill the form
      await this.fillForm(user);
      await this.click(this.registerBtn, 'Register Button');
    
      // Step 2: Error Detection & Recovery
      const errorVisible = await this.usernameError.isVisible({ timeout: 2000 });
      logger.info (`If error or warning message present: '${errorVisible}'`)
      if (errorVisible) {
        const message = await this.usernameError.textContent();
        if (message?.includes('already exists')) {
          logger.warn(`Collision detected for '${user.username}'. Clearing form and retrying...`);
          await this.clearForm();
          logger.info(`Cleared the form successfully`);
          continue; // Start next iteration with fresh data
        }
      }

      // Step 3: Success Path
      logger.info(`Successfully registered unique user: ${user.username}`);
      return user; 
    }

    throw new Error(`CRITICAL: Failed to create a unique user after ${maxRetries} attempts. Check environment data density.`);
  }

  private async fillForm(user: UserData) {
    await this.fill(this.firstNameInput, user.firstName, 'First Name');
    await this.fill(this.lastNameInput, user.lastName, 'Last Name');
    await this.fill(this.addressInput, user.address, 'Street');
    await this.fill(this.cityInput, user.city, 'City');
    await this.fill(this.stateInput, user.state, 'State');
    await this.fill(this.zipInput, user.zip, 'Zip');
    await this.fill(this.phoneInput, user.phoneNumber, 'Phone');
    await this.fill(this.ssnInput, user.ssn, 'SSN');
    await this.fill(this.usernameInput, user.username, 'Username');
    await this.fill(this.passwordInput, user.password, 'Password');
    await this.fill(this.confirmPassInput, user.password, 'Confirm Password');
  }

  private async clearForm() {
    //Using a loop to ensure all inputs are cleared rather than simple page reload
    const inputs = this.page.locator('#customerForm input.input');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      await inputs.nth(i).fill('');
    }
  }
}