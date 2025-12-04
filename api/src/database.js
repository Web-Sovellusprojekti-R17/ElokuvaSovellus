import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

const connectionString =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

export default pool;
// search_pathin asetus ei ole tarpeen jos käytät public-schemaa
/*
pool.on("connect", (client) => {
  client.query("SET search_path TO libschema, public;").catch((err) => {
    console.error("Virhe search_pathin asettamisessa:", err);
  });
});
*/

