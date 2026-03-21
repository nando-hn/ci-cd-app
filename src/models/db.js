const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'app_db',
  password: 'sistemas',
  port: 5432,
});

module.exports = pool;