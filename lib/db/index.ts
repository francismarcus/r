import { config } from "dotenv";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

config({ path: ".env" });
if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set in lib/db/index.ts");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export * from "./schema";
