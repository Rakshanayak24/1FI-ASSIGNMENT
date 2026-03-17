const { Pool } = require("pg");

let pool;

if (process.env.DATABASE_URL) {
  // ✅ Render / Production DB
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // ✅ Local Docker DB
  pool = new Pool({
    user: "admin",
    password: "admin123",
    host: "db",
    port: 5432,
    database: "orderdb",
  });
}

module.exports = pool;
