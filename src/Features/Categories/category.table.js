
import pool from "../../Mysql/mysql.database.js"

export const createCategoryTable = async function () {
    try {

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS category (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50),
        category VARCHAR(20)
        );`;

        // Execute the query
        const [results, fields] = await pool.raw(createTableQuery);

        console.log('Category Table created successfully:');

        // Release the connection back to the pool

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropCategoryTable = async function () {
    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS category
      `;

        // Execute the query
        const [results, fields] = await pool.raw(dropTableQuery);

        console.log('Category Table dropped successfully:');

        // Release the connection back to the pool
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}
