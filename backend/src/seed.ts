import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

async function seed() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS scans (
      id SERIAL PRIMARY KEY,
      ip VARCHAR(15) NOT NULL,
      status VARCHAR(10) NOT NULL CHECK (status IN ('active','inactive')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  for (let i = 1; i <= 1000; i++) {
    const ip = `192.168.${Math.floor(i / 256)}.${i % 256}`;
    const status = i % 2 === 0 ? "active" : "inactive";
    const createdAt = new Date(Date.now() - i * 86400000);

    await pool.query(
      "INSERT INTO scans (ip, status, created_at) VALUES ($1, $2, $3)",
      [ip, status, createdAt]
    );
  }

  console.log("База заполнена 1000 записями!");
  await pool.end();
}

seed().catch(err => console.error(err));
