import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MDB_HOST,
    port: process.env.MDB_PORT,
    user: process.env.MDB_USER,
    password: process.env.MDB_PASS,
    database: process.env.MDB_DATABASE || "besakina",
    connectionLimit: 100,
}).promise();

export default pool;
