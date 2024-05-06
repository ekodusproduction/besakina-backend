import pool from "../../../Mysql/mysql.database.js"

export const createUserTable = async function () {
    let connection = await pool.getConnection();

    try {

        const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255),
            mobile BIGINT UNSIGNED NOT NULL UNIQUE,
            alternate_mobile BIGINT UNSIGNED UNIQUE,
            otp INT,
            email VARCHAR(255),
       
            doc_number VARCHAR(255),
            doc_type VARCHAR(255),
            doc_file VARCHAR(255),
            doc_file_back VARCHAR(255),

            profile_pic VARCHAR(255),
            plan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            contacts_quota INT , 
            state VARCHAR(255),
            city VARCHAR(255),
            locality VARCHAR(255),
            pincode VARCHAR(255),
            about VARCHAR(255),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`;

        await connection.query(createTableQuery);

        console.log('User Table created successfully:');

    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        if (connection) {
            connection.release(); 
        }
    }
}

export const dropUserTable = async function () {
    let connection = await pool.getConnection();
    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS users
      `;

        // Execute the query
        await connection.query(dropTableQuery);

        console.log('User Table dropped successfully:');

        // Release the connection back to the connection.query
    } catch (error) {
        console.error('Error dropping table:', error);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }
}
