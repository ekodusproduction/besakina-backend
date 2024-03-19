
import pool from "../../Mysql/mysql.database.js"

export const createPlanTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS plans (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        
        type VARCHAR(25),
        description text,
        price INT,
        validity INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

        // Execute the query
        const [results, fields] = await connection.query(createTableQuery);

        console.log('Plan Table created successfully:');

        // Release the connection back to the pool
        connection.release();

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropPlanTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS plans
      `;

        // Execute the query
        const [results, fields] = await connection.query(dropTableQuery);

        console.log('Plan Table dropped successfully:');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}
