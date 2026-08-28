import oracledb from 'oracledb';

class DbClient {
  constructor(authData) {
    this.authData = authData;
    this.connection = null;
  }

  async connect() {
    if (!this.connection) {
      this.connection = await oracledb.getConnection(this.authData);
    }

    return this.connection;
  }

  async execute(sql, binds = [], options = {}) {
    const connection = await this.connect();
    return connection.execute(sql, binds, options);
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }
}

export { DbClient };
