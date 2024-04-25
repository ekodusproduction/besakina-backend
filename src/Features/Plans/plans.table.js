
import pool from "../../Mysql/mysql.database.js"

export const createPlanTable = async function () {
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
        const [results, fields] = await pool.raw(createTableQuery);

        console.log('Plan Table created successfully:');

        // Release the connection back to the pool
        return
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropPlanTable = async function () {
    try {
        // Define your DROP TABLE query
        const dropTableQuery = `
            DROP TABLE IF EXISTS plans
        `;
        // Execute the query
        const [results, fields] = await pool.raw(dropTableQuery);

        console.log('Plan Table dropped successfully:');
        return
    } catch (error) {
        console.error('Error dropping table:', error);
    }
};
