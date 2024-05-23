
import pool from
    "../../../Mysql/mysql.database.js";

export const createEducationTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your CREATE TABLE query
        const createTableQuery = `CREATE TABLE IF NOT EXISTS education (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user BIGINT UNSIGNED NOT NULL,

            type VARCHAR(255) NOT NULL,
            domain VARCHAR(255) NOT NULL,
            institution_name VARCHAR(255) NOT NULL,
            course_duration VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price VARCHAR(255) NULL,


            street VARCHAR(255),
            locality VARCHAR(255),
            city VARCHAR(50),
            state VARCHAR(50),
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

            FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
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

export const dropEducationTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS education
      `;

        // Execute the query
        await connection.query(dropTableQuery);

        console.log('Education Table dropped successfully:');

        // Release the connection back to the connection.query
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    finally {
        connection.release();
    }
}

export const indexEducationTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your DROP TABLE query
        const fulltext = `ALTER TABLE education ADD FULLTEXT INDEX education_idx_fulltext (title, domain, institution_name, type, description,  city, locality,  pincode);`
        // Execute the query
        await connection.query(fulltext);
        console.log("education fulltext index created")

        const compound = `ALTER TABLE education ADD INDEX compound (is_active, created_at)`
        await connection.query(compound);
        console.log('education compound index created:');

        const created_at_index = `ALTER TABLE education ADD INDEX (created_at);`
        await connection.query(created_at_index);
        console.log('education index created:');
        // Execute the query

        console.log('Property Table indexed successfully:');

        // Release the connection back to the connection.query
    } catch (error) {
        console.error('Error creating index:', error);
    }
    finally {
        connection.release();
    }
}