class BasePage {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
  }

  async click(locator, message = 'Element clicked') {
    await locator.click();
    this.logger.info(message);
  }

  async fill(locator, value, message = 'Field filled') {
    await locator.fill(value);
    this.logger.info(message);
  }

  async goto(url, message = `Navigated to ${url}`) {
    await this.page.goto(url);
    this.logger.info(message);
  }

  async getText(locator, message = 'Text retrieved') {
    const text = await locator.innerText();
    this.logger.info(message);
    return text;
  }
}

export { BasePage };
