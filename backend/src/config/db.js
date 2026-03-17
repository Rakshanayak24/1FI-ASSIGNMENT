const { Pool } = require("pg");

// Use Render DATABASE_URL if available, otherwise fallback to local Docker config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,

  // Required for Render PostgreSQL
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,

  // Local fallback (for docker-compose)
  user: process.env.DATABASE_URL ? undefined : "admin",
  password: process.env.DATABASE_URL ? undefined : "admin123",
  host: process.env.DATABASE_URL ? undefined : "db",
  port: process.env.DATABASE_URL ? undefined : 5432,
  database: process.env.DATABASE_URL ? undefined : "orderdb",
});

module.exports = pool;
