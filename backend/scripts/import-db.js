import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

// Parse DATABASE_URL
const url = new URL(process.env.DATABASE_URL);

const connection = await mysql.createConnection({
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.replace("/", ""),
    port: Number(url.port) || 3306,
});

console.log("✅ Connected to database");

// contoh insert
await connection.execute(`
  INSERT INTO users (name, email)
  VALUES ('Admin', 'admin@example.com')
`);

await connection.end();
console.log("✅ Import finished");
