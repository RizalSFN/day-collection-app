import fs from "fs";
import mysql from "mysql2/promise";

const sql = fs.readFileSync("./scripts/import.sql", "utf8");

const connection = await mysql.createConnection(process.env.DATABASE_URL);
await connection.query(sql);
await connection.end();

console.log("Database imported");
