
import pool from "../../../Mysql/mysql.database.js";

export const createPropertyTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS property (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user BIGINT UNSIGNED,

            title VARCHAR(255),
            type VARCHAR(250),
            bedrooms INT,
            bathrooms INT,
            furnishing VARCHAR(20),
            construction_status VARCHAR(255),
            listed_by VARCHAR(20),
            super_builtup_area INT,
            carpet_area INT,
            maintenance INT,
            total_rooms INT,
            
            floor_no INT,
            total_floors INT,
            car_parking INT DEFAULT 1,
            price VARCHAR(255),
            category VARCHAR(255),
            description TEXT,
            
            street VARCHAR(255),
            house_no VARCHAR(255),
            landmark VARCHAR(255),
            city VARCHAR(50),
            state VARCHAR(50),
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

            
            FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
        );`
        // Execute the query
        await connection.query(createTableQuery);
        console.log('Property Table created successfully:');
        // Release the connection back to the connection.query

    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        connection.release();
    }
}

export const dropPropertyTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS property
      `;

        // Execute the query
        await connection.query(dropTableQuery);

        console.log('Property Table dropped successfully:');

        // Release the connection back to the connection.query
    } catch (error) {
        console.error('Error dropping table:', error);
    } finally {
        connection.release();
    }

}
export const indexPropertyTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        ALTER TABLE property ADD FULLTEXT INDEX property_idx_fulltext (title,type, city, state, landmark, category, price, pincode)
        ALTER TABLE property ADD INDEX property_idx_is_active_created_at (is_active, created_at);
        ALTER TABLE property ADD INDEX property_idx_created_at (created_at);`;

        // Execute the query
        const fulltext = `ALTER TABLE property ADD FULLTEXT INDEX property_idx_fulltext (title,type, city,street, state, landmark, category, price, pincode);`
        // Execute the query
        await connection.query(fulltext);
        console.log("property fulltext index created")

        const compound = `ALTER TABLE property ADD INDEX property_idx_is_active_created_at (is_active, created_at);`
        await connection.query(compound);
        console.log('property compound index created:');

        const created_at_index = `ALTER TABLE property ADD INDEX property_idx_created_at (created_at);`
        await connection.query(created_at_index);
        console.log('property index created:');

        // Release the connection back to the connection.query
    } catch (error) {
        console.error('Error creating index:', error);
    } finally {
        connection.release();
    }

}
