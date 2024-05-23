import pool from "../../../Mysql/mysql.database.js"

export const createUserWishListTable = async function () {
    let connection = await pool.getConnection();

    try {

        const createTableQuery = `CREATE TABLE IF NOT EXISTS userswishlist (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user BIGINT UNSIGNED,
            adv_id BIGINT UNSIGNED,
            adv_type VARCHAR(255),
            FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        await connection.query(createTableQuery);

        console.log('userswishlist Table created successfully:');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

export const dropUserWishListTable = async function () {
    let connection = await pool.getConnection();
    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS userswishlist
      `;

        // Execute the query
        await connection.query(dropTableQuery);

        console.log('userswishlist Table dropped successfully:');

        // Release the connection back to the connection.query
    } catch (error) {
        console.error('Error dropping table:', error);
    } finally {
        connection.release(); // Release the connection back to the connection.query

    }
}
