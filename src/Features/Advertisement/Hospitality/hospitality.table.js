
import pool from "../../../Mysql/mysql.database.js";

export const createHospitalityTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your CREATE TABLE query
        const createTableQuery = `CREATE TABLE IF NOT EXISTS hospitality (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            plan_id BIGINT UNSIGNED ,        
            user_id BIGINT UNSIGNED NOT NULL,

            type VARCHAR(50) NOT NULL,
            name VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
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

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );`;

        // Execute the query
        await pool(createTableQuery);

        console.log('Hospitality Table created successfully:');

        // Release the connection back to the pool

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropHospitalityTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS hospitality
      `;

        // Execute the query
        await pool(dropTableQuery);

        console.log('Hospitality Table dropped successfully:');

        // Release the connection back to the pool
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}

export const indexHospitalityTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        ALTER TABLE hospitality ADD FULLTEXT INDEX hospitality_idx_fulltext (title, name, type, description, city, state, locality, category, pincode);
        ALTER TABLE hospitality ADD INDEX hospitality_idx_is_active_created_at (is_active, created_at);
        ALTER TABLE hospitality ADD INDEX hospitality_idx_created_at (created_at);
    `;

        // Execute the query
        const fulltext = `ALTER TABLE hospitality ADD FULLTEXT INDEX hospitality_idx_fulltext (title, name, type, description, city, state, locality, category, pincode);`
        // Execute the query
        await pool(fulltext);
        console.log("hospitality fulltext index created")

        const compound = `ALTER TABLE hospitality ADD INDEX hospitality_idx_is_active_created_at (is_active, created_at);`
        await pool(compound);
        console.log('hospitality compound index created:');

        const created_at_index = `ALTER TABLE hospitality ADD INDEX hospitality_idx_created_at (created_at);`
        await pool(created_at_index);
        console.log('hospitality index created:');

        // Release the connection back to the pool
    } catch (error) {
        console.error('Error creating index:', error);
    }
    return
}