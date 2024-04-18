
import pool from "../../Mysql/mysql.database.js"

export const createPlanTable = async function () {
    const connection = await pool.getConnection();
    // SEARCH priority low = 1, medium = 2, high = 3
    try {

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS plans (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        
        type VARCHAR(20),
        no_of_ads INT,
        price INT,
        validity INT,
        verification_badge BOOLEAN,
        search_priority INT,
        membership_badge VARCHAR(255),
        contact_limit INT,
        no_images INT,
        business_profile BOOLEAN,
        images_business_profile INT,
        offer_price INT, 
        
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`;

        // Execute the query
        const [results, fields] = await connection.query(createTableQuery);

        console.log('Plan Table created successfully:');

        // Release the connection back to the pool

    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        connection.release();
    }
}

export const dropPlanTable = async function () {
    let connection;
    try {
        connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
            DROP TABLE IF EXISTS plans
        `;

        // Execute the query
        const [results, fields] = await connection.query(dropTableQuery);

        console.log('Plan Table dropped successfully:');
    } catch (error) {
        console.error('Error dropping table:', error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
