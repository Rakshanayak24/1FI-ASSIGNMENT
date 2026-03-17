const express = require("express");
const cors = require("cors");

const customersRouter = require("./routes/customers");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");

// 🔥 DB connection
const pool = require("./config/db"); // make sure this path is correct

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 🔥 TEMP: DB INIT ROUTE (IMPORTANT)
app.get("/api/init", async (req, res) => {
  try {
    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT,
        price NUMERIC,
        inventory_count INT
      );
    `);

    // Insert sample data
    await pool.query(`
      INSERT INTO products (name, price, inventory_count)
      VALUES 
      ('Laptop', 50000, 10),
      ('Phone', 20000, 15)
      ON CONFLICT DO NOTHING;
    `);

    res.json({ message: "Database initialized successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Routes
app.use("/api/customers", customersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// ❌ Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal server error"
  });
});

// 🔥 IMPORTANT for Railway
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
