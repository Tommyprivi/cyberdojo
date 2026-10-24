import { Pool } from "@neondatabase/serverless";
const url = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: url });
const q = process.argv[2];
try { const r = await pool.query(q); console.log(JSON.stringify(r.rows)); } catch (e) { console.log("ERR", e.message); }
await pool.end();
