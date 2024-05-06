
import pool from
    "../../../Mysql/mysql.database.js";

export const createVehicleTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS vehicles (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            plan_id BIGINT UNSIGNED ,        
            user_id BIGINT UNSIGNED,

            type VARCHAR(250),
            brand text,
            registration_year VARCHAR(255),
            kilometer_driven VARCHAR(255),
            title VARCHAR(255),
            description TEXT,
            price VARCHAR(255),
            category VARCHAR(255),
            
            street VARCHAR(50),
            locality VARCHAR(255),
            city VARCHAR(20),
            state VARCHAR(25),
            pincode VARCHAR(255),

            images LONGTEXT,
            video TEXT,
            map_location TEXT,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),

            verified BOOLEAN DEFAULT 1,
            is_active BOOLEAN DEFAULT 1,
            seen_by INT DEFAULT 0,
            
            fuel VARCHAR(255),
            second_hand BOOLEAN,
            model VARCHAR(255),
            transmission VARCHAR(255),
            variant VARCHAR(255),
            color VARCHAR(255),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );`;

        // Execute the query
        await connection.query(createTableQuery);

        console.log('Vehicle Table created successfully:');

        // Release the connection back to the connection.query

    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }
}

export const dropVehicleTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS vehicles
      `;

        // Execute the query
        await connection.query(dropTableQuery);

        console.log('Vehicle Table dropped successfully:');

        // Release the connection back to the connection.query
    } catch (error) {
        console.error('Error dropping table:', error);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }

}

export const indexVehiclesTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        ALTER TABLE vehicles ADD FULLTEXT INDEX vehicles_idx_fulltext (title,brand, type, city,  kilometer_driven, registration_year, fuel, category, price, second_hand,model, variant, transmission);
        ALTER TABLE vehicles ADD INDEX vehicles_idx_is_active_created_at (is_active, created_at);
        ALTER TABLE vehicles ADD INDEX vehicles_idx_created_at (created_at);`;

        // Execute the query
        const fulltext = `ALTER TABLE vehicles ADD FULLTEXT INDEX vehicles_idx_fulltext (title,brand, type, city,  kilometer_driven, registration_year, locality, category, price, pincode,model, variant, transmission);`
        // Execute the query
        await connection.query(fulltext);
        console.log("vehicles fulltext index created")

        const compound = `ALTER TABLE vehicles ADD INDEX vehicles_idx_is_active_created_at (is_active, created_at);`
        await connection.query(compound);
        console.log('vehicles compound index created:');

        const created_at_index = `ALTER TABLE vehicles ADD INDEX vehicles_idx_created_at (created_at);`
        await connection.query(created_at_index);
        console.log('vehicles index created:');

        // Release the connection back to the connection.query
    } catch (error) {
        console.error('Error creating index:', error);
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the connection.query
        }
    }

}