import pool from "./mysql.database.js";
const dropDatabaseIfExists = async () => {
    try {
        const connection = await pool.getConnection();
        await connection.query(`DROP DATABASE IF EXISTS \`${process.env.MYSQL_DATABASE}\`;`);
        console.log(`Database '${process.env.MYSQL_DATABASE}' dropped successfully or did not exist.`);
        connection.release();
    } catch (error) {
        console.error('Error dropping database:', error);
    } finally {
        pool.end();
    }
};

dropDatabaseIfExists();