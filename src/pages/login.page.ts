import { BasePage } from '../core/base.page';

export class LoginPage extends BasePage {
  // Locators: Using 'name' attributes considering thier stability in ParaBank legacy forms
  private readonly usernameInput = this.page.locator('input[name="username"]');
  private readonly passwordInput = this.page.locator('input[name="password"]');
  
  // Locator: Using 'getByRole' for the button is an accessibility-first best practice
  private readonly loginButton = this.page.getByRole('button', { name: 'Log In' });

  /**
  * Performs the login action using the BasePage wrappers for logging.
  @param username - The unique username
  @param password - The password
   */
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username, 'Login Username');
    await this.fill(this.passwordInput, password, 'Login Password');
    await this.click(this.loginButton, 'Log In Button');
  }
}
