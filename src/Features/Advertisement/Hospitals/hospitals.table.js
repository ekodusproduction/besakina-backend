
import pool from "../../../Mysql/mysql.database.js";

export const createHospitalsTable = async function () {
    try {
        const connection = await pool.getConnection();

        // video VARCHAR(255),
        // map_location text,
        // latitude DECIMAL(10, 8) ,
        // longitude DECIMAL(11, 8),

        // Define your CREATE TABLE query
        const createTableQuery = `CREATE TABLE IF NOT EXISTS hospitals (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            plan_id BIGINT UNSIGNED ,        
            user_id BIGINT UNSIGNED NOT NULL,
            
            type VARCHAR(50) NOT NULL,
            name VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price_registration INT,
            price_per_visit INT,

            images LONGTEXT,
            video TEXT,
            map_location TEXT,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            category VARCHAR(255),
            
            verified BOOLEAN DEFAULT 1,
            is_active BOOLEAN DEFAULT 1,

            street VARCHAR(50),
            locality VARCHAR(255),
            city VARCHAR(20),
            state VARCHAR(25),
            pincode VARCHAR(255),

            seen_by INT DEFAULT 0,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );`;

        // Execute the query
        const [results, fields] = await connection.query(createTableQuery);

        console.log('Hospitals Table created successfully:');

        // Release the connection back to the pool
        connection.release();

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropHospitalsTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS hospitals
      `;

        // Execute the query
        const [results, fields] = await connection.query(dropTableQuery);

        console.log('Hospitals Table dropped successfully:');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}

export const indexHospitalsTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
        ALTER TABLE \`hospitals\` ADD FULLTEXT INDEX \`hospitals_idx_fulltext\` (title, name, type, description, street, city, state, locality, category, pincode);
        ALTER TABLE \`hospitals\` ADD INDEX \`hospitals_idx_is_active_created_at\` (\`is_active\`, \`created_at\`);
        ALTER TABLE \`hospitals\` ADD INDEX \`hospitals_idx_created_at\` (\`created_at\`);
    `;

        // Execute the query
        const [results, fields] = await connection.query(dropTableQuery);

        console.log('Property Table dropped successfully:');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error creating index:', error);
    }
    return
}