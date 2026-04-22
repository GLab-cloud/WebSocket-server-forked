import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { matches } from "./db/schema.js";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const allMatches = await db.select().from(matches);
console.log("Total matches in database:", allMatches.length);

await pool.end();