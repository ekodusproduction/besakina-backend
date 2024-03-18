
import pool from "../../Mysql/mysql.database.js"

export const createPropertyTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS property (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            plan_id INT UNSIGNED NOT NULL,        
            user_id INT UNSIGNED NOT NULL,

            title VARCHAR(255) NOT NULL,
            type VARCHAR(25) NOT NULL,
            bedrooms INT NOT NULL,
            bathrooms INT NOT NULL,
            furnishing VARCHAR(20) NOT NULL,
            construction_status VARCHAR(20) NOT NULL,
            listed_by VARCHAR(20) NOT NULL,
            super_builtup_area DECIMAL(10, 2),
            carpet_area DECIMAL(10, 2),
            maintenance INT NOT NULL,
            total_rooms INT NOT NULL,
            floor_no INT NOT NULL,
            car_parking INT NOT NULL DEFAULT 1,
            price BIGINT UNSIGNED NOT NULL,
            photos JSON, 
            category VARCHAR(25) NOT NULL,
            
            video VARCHAR(255),
            map_location VARCHAR(255) NOT NULL,
            latitude DECIMAL(16, 15) NOT NULL,
            longitude DECIMAL(16, 15) NOT NULL,
            
            is_active BOOLEAN DEFAULT 1,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );`;

        // Execute the query
        const [results, fields] = await connection.query(createTableQuery);

        console.log('Vehicle Table created successfully:');

        // Release the connection back to the pool
        connection.release();

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropPropertyTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS property
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
