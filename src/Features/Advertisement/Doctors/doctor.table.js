import pool from "../../../Mysql/mysql.database.js";

export const createDoctorsTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your CREATE TABLE query
        const createTableQuery = `CREATE TABLE IF NOT EXISTS doctors (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            plan_id BIGINT UNSIGNED,        
            user_id BIGINT UNSIGNED,
            
            expertise VARCHAR(50),
            name VARCHAR(255) ,
            total_experience INT ,
            title VARCHAR(255) ,
            description TEXT,

            price_per_visit VARCHAR(255),
            street VARCHAR(50),
            locality VARCHAR(255),
            city VARCHAR(20),
            state VARCHAR(25),
            pincode VARCHAR(255) ,

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
        const [results, fields] = await connection.query(createTableQuery);

        console.log('Doctor Table created successfully:');

        // Release the connection back to the pool
        connection.release();

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropDoctorsTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS doctors
      `;

        // Execute the query
        const [results, fields] = await connection.query(dropTableQuery);

        console.log('Doctors Table dropped successfully:');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}
export const indexDoctorsTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
        ALTER TABLE 'doctors' ADD FULLTEXT INDEX 'doctors_idx_fulltext' (title, expertise, description, price_per_visit, street, city, locality, pincode);
        ALTER TABLE 'doctors' ADD INDEX 'doctors_idx_is_active_created_at' ('is_active', 'created_at');
        ALTER TABLE 'doctors' ADD INDEX 'doctors_idx_created_at' ('created_at');
    `;

        // Execute the query
        const [results, fields] = await connection.query(dropTableQuery);

        console.log('Property Table indexed successfully:');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error creating index:', error);
    }
    return
}