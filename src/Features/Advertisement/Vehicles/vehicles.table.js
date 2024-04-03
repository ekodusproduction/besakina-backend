
import pool from "../../../Mysql/mysql.database.js";

export const createVehicleTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS vehicles (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            plan_id BIGINT UNSIGNED ,        
            user_id BIGINT UNSIGNED,

            type VARCHAR(50),
            brand VARCHAR(50),
            registration_year INT,
            kilometer_driven INT,
            title VARCHAR(255),
            description TEXT,
            price INT,

            street VARCHAR(50),
            locality VARCHAR(255),
            city VARCHAR(20),
            state VARCHAR(25),
            pincode INT ,

            images LONGTEXT,
            video TEXT,
            map_location TEXT,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),

            verified BOOLEAN DEFAULT 1,
            is_active BOOLEAN DEFAULT 1,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`;

        // Execute the query
        const [results, fields] = await connection.query(createTableQuery);

        console.log('Vehicle Table created successfully:');

        // Release the connection back to the pool
        connection.release();

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropVehicleTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS vehicles
      `;

        // Execute the query
        const [results, fields] = await connection.query(dropTableQuery);

        console.log('Vehicle Table dropped successfully:');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}
