import pool from "../../Mysql/mysql.database.js"

export const createPlanTable = async function () {
    let connection = await pool.getConnection();
    try {

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS plans (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        
        type VARCHAR(255),
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

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`;

        await connection.query(createTableQuery);

        console.log('Plan Table created successfully:');

    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        connection.release(); // Release the connection back to the connection.query
    }
}

export const dropPlanTable = async function () {
    let connection = await pool.getConnection();

    try {
        // Define your DROP TABLE query
        const dropTableQuery = `
            DROP TABLE IF EXISTS plans
        `;
        // Execute the query
        await connection.query(dropTableQuery);

        console.log('Plan Table dropped successfully:');
        return
    } catch (error) {
        console.error('Error dropping table:', error);
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the connection.query
        }
    }
};
