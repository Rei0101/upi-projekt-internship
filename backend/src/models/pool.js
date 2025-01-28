import pkg from "pg";
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

export const queryDatabase = async (queryText, params = []) => {
  try {
    const res = await pool.query(queryText, params);
    return res.rows;
  } catch (error) {
    throw error;
  }
};

// ovo samo služi za uredno gašenje baze kad smo gotovi sa njom
const shutdown = async () => {
  try {
    await pool.end(); // Close the pool gracefully
    console.log("PostgreSQL pool closed.");
  } catch (error) {
    console.error("Error while closing PostgreSQL pool:", error);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
