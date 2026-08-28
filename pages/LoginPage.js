import { BasePage } from './BasePage.js';

class LoginPage extends BasePage {
  constructor(page, logger) {
    super(page, logger);

    this.usernameInput = page.getByPlaceholder('email@example.com');
    this.passwordInput = page.getByPlaceholder('enter your passsword');
    this.loginButton = page.getByRole('button', { name: 'login' });
    this.loginSuccessMessage = page.locator('[aria-label="Login Successfully"]');
    this.homeMenu = page.getByRole('button', { name: 'HOME' });
  }

  async open() {
    await this.goto('./', 'Login page opened');
  }

  async login(username, password) {
    await this.fill(this.usernameInput, username, 'Username entered');
    await this.fill(this.passwordInput, password, 'Password entered');
    await this.click(this.loginButton, 'Login button clicked');
  }
}

export { LoginPage };
