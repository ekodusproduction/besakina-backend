import pool from
    "../../../Mysql/mysql.database.js";

export const createDoctorsTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your CREATE TABLE query
        const createTableQuery = `CREATE TABLE IF NOT EXISTS doctors (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
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

            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );`;

        // Execute the query
        await connection.query(createTableQuery);


        // Release the connection back to the connection.query

    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        connection.release();
    }
}

export const dropDoctorsTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS doctors
      `;

        // Execute the query
        await connection.query(dropTableQuery);

        console.log('Doctors Table dropped successfully:');

        // Release the connection back to the connection.query
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    finally {
        connection.release();
    }
}
export const indexDoctorsTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your DROP TABLE query

        const fulltext = `ALTER TABLE doctors ADD FULLTEXT INDEX doctors_idx_fulltext (title, expertise, description,  street, city, locality, pincode);`
        // Execute the query
        await connection.query(fulltext);
        console.log("doctors fulltext index created")

        const compound = `ALTER TABLE doctors ADD INDEX compound (is_active, created_at);`
        await connection.query(compound);
        console.log('doctors compound index created:');

        const created_at_index = `ALTER TABLE doctors ADD INDEX (created_at);`
        await connection.query(created_at_index);
        console.log('doctors index created:');

        // Release the connection back to the connection.query
    } catch (error) {
        console.error('Error creating index:', error);
    }
    finally {
        connection.release();
    }
}