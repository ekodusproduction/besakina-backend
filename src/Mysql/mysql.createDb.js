import pool from "./mysql.database.js";
const createDatabaseIfNotExists = async () => {
    try {
        const connection = await pool.getConnection();
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\`;`);
        console.log(`Database '${process.env.MYSQL_DATABASE}' created successfully or already exists.`);
        connection.release();
    } catch (error) {
        console.error('Error creating database:', error);
    } finally {
        pool.end();
    }
};

createDatabaseIfNotExists();