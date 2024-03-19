
import pool from "../../../Mysql/mysql.database.js";

export const createVehicleTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS vehicles (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            plan_id BIGINT UNSIGNED NOT NULL,        
            user_id BIGINT UNSIGNED NOT NULL,

            vehicle_type VARCHAR(20) NOT NULL,
            brand VARCHAR(20) NOT NULL,
            registration_year INT NOT NULL,
            kilometer_driven INT NOT NULL,
            ad_title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            photos JSON,

            video VARCHAR(255),
            map_location text,
            latitude DECIMAL(11, 10) NOT NULL,
            longitude DECIMAL(11, 10) NOT NULL,


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
