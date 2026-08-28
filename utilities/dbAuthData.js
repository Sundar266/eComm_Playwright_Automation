const dbAuthData = {
  user: process.env.DB_USER || 'dummy_username',
  password: process.env.DB_PASSWORD || 'dummy_password',
  connectString: process.env.DB_CONNECT_STRING || 'localhost:1521/XEPDB1'
};

export { dbAuthData };
