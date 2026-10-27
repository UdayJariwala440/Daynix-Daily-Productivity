import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing from the environment variables.");
}

export const pool = new Pool({
  connectionString: databaseUrl,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});