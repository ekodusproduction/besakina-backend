
import pool from "../../../Mysql/mysql.database.js";

export const createEducationTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your CREATE TABLE query
        const createTableQuery = `CREATE TABLE IF NOT EXISTS education (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            plan_id BIGINT UNSIGNED,        
            user_id BIGINT UNSIGNED NOT NULL,

            type VARCHAR(255) NOT NULL,
            domain VARCHAR(255) NOT NULL,
            institution_name VARCHAR(255) NOT NULL,
            course_duration VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price VARCHAR(255) NULL,


            street VARCHAR(50),
            locality VARCHAR(255),
            city VARCHAR(50),
            state VARCHAR(25),
            pincode VARCHAR(255),

            images LONGTEXT,
            video TEXT,
            map_location TEXT,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            
            verified BOOLEAN DEFAULT 1,
            is_active BOOLEAN DEFAULT 1,
            seen_by INT,


            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            FULLTEXT(title,domain,institution_name, type, description, street, city, locality, price, pincode),

            FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );`;

        // Execute the query
        const [results, fields] = await connection.query(createTableQuery);

        console.log('Education Table created successfully:');

        // Release the connection back to the pool
        connection.release();

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropEducationTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS education
      `;

        // Execute the query
        const [results, fields] = await connection.query(dropTableQuery);

        console.log('Education Table dropped successfully:');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}
