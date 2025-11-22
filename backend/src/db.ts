import dotenv from "dotenv";

import { Pool } from "pg";
dotenv.config();

if (!process.env.DB_PASSWORD || typeof process.env.DB_PASSWORD !== "string") {
  throw new Error("DB_PASSWORD must be defined as a string in .env");
}

export const pool = new Pool({
  user: process.env.DB_USER!,
  host: process.env.DB_HOST!,
  database: process.env.DB_NAME!,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});
