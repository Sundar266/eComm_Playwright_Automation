class Logger {
  constructor(testName) {
    this.testName = testName;
  }

  info(message) {
    this.#write('INFO', message);
  }

  warn(message) {
    this.#write('WARN', message);
  }

  error(message) {
    this.#write('ERROR', message);
  }

  debug(message) {
    this.#write('DEBUG', message);
  }

  #write(level, message) {
    const timestamp = this.#timestamp();
    const formattedMessage = message instanceof Error ? message.message : String(message);

    console.log(`[${timestamp}][${level}][${this.testName}]['${formattedMessage}']`);
  }

  #timestamp() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');

    return [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate())
    ].join('-') + `-${pad(now.getHours())}-${pad(now.getMinutes())}`;
  }
}

export { Logger };
