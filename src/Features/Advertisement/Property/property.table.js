
import pool from "../../../Mysql/mysql.database.js";

export const createPropertyTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS property (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            plan_id BIGINT UNSIGNED,        
            user_id BIGINT UNSIGNED,

            title VARCHAR(255),
            type VARCHAR(50),
            bedrooms INT,
            bathrooms INT,
            furnishing VARCHAR(20),
            construction_status VARCHAR(20),
            listed_by VARCHAR(20),
            super_builtup_area INT,
            carpet_area INT,
            maintenance INT,
            total_rooms INT,
            
            floor_no INT,
            total_floors INT,
            car_parking INT DEFAULT 1,
            price VARCHAR(255),
            category VARCHAR(25),
            description TEXT,
            
            street VARCHAR(50),
            house_no VARCHAR(255),
            landmark VARCHAR(255),
            city VARCHAR(20),
            state VARCHAR(25),
            pincode VARCHAR(255),
            
            images LONGTEXT,
            video TEXT,
            map_location TEXT,
            
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            
            seen_by INT DEFAULT 0,

            verified BOOLEAN DEFAULT 1,
            is_active BOOLEAN DEFAULT 1,
            
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            FULLTEXT(title,type, city, state, landmark, category, price, pincode),
            
            FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );`

        // Execute the query
        const [results, fields] = await connection.query(createTableQuery);

        console.log('Property Table created successfully:');

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

        console.log('Property Table dropped successfully:');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}
