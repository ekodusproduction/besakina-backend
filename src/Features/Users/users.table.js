
import pool from "../../Mysql/mysql.database.js"

export const createUserTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        plan_id BIGINT UNSIGNED,
        
        firstName VARCHAR(25),
        lastName VARCHAR(25),
        mobile BIGINT UNSIGNED NOT NULL UNIQUE,
        otp INT,
        email VARCHAR(255),
        gst_number VARCHAR(50),
        aadhar_number VARCHAR(50),
        pan_number VARCHAR(50),

        gst_file TEXT,
        aadhar_file TEXT,
        pan_file TEXT,

        profile_pic VARCHAR(255),
        plan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        contacts_quota INT, 

        state VARCHAR(255),
        city VARCHAR(255),
        address VARCHAR(255),
        pincode VARCHAR(255),
        about VARCHAR(255),

        FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

        // Execute the query
        const [results, fields] = await connection.query(createTableQuery);

        console.log('User Table created successfully:');

        // Release the connection back to the pool
        connection.release();

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropUserTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS users
      `;

        // Execute the query
        const [results, fields] = await connection.query(dropTableQuery);

        console.log('User Table dropped successfully:');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}
