
import pool from "../../../Mysql/mysql.database.js";

export const createHospitalityTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your CREATE TABLE query
        const createTableQuery = `CREATE TABLE IF NOT EXISTS hospitality (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            plan_id BIGINT UNSIGNED ,        
            user_id BIGINT UNSIGNED ,

            type VARCHAR(50) NOT NULL,
            name VARCHAR(255) NOT NULL,
            full_address VARCHAR(255) NOT NULL,
            ad_title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price INT,
            images LONGTEXT, 
            
            street VARCHAR(50),
            locality VARCHAR(255),
            city VARCHAR(20),
            state VARCHAR(25),
            pincode INT,

            latitude DECIMAL(10, 8) ,
            longitude DECIMAL(11, 8) ,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );`;

        // Execute the query
        const [results, fields] = await connection.query(createTableQuery);

        console.log('Hospitality Table created successfully:');

        // Release the connection back to the pool
        connection.release();

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropHospitalityTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS hospitality
      `;

        // Execute the query
        const [results, fields] = await connection.query(dropTableQuery);

        console.log('Hospitality Table dropped successfully:');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}
