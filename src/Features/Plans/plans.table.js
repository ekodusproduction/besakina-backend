import pool from "../../Mysql/mysql.database.js"

export const createPlanTable = async function () {
    let connection = await pool.getConnection();
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

        await pool(createTableQuery);

        console.log('Plan Table created successfully:');

        return
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
}

export const dropPlanTable = async function () {
    let connection = await pool.getConnection();

    try {
        console.log(pool)
        // Define your DROP TABLE query
        const dropTableQuery = `
            DROP TABLE IF EXISTS plans
        `;
        // Execute the query
        await pool(dropTableQuery);

        console.log('Plan Table dropped successfully:');
        return
    } catch (error) {
        console.error('Error dropping table:', error);
    }finally {
        if (connection) {
          connection.release(); // Release the connection back to the pool
        }
      }
};
