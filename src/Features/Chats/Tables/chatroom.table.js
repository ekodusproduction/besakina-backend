
import pool from "../../../Mysql/mysql.database.js";

export const createChatRoomTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS chat_room (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id_1 BIGINT UNSIGNED NOT NULL,
        FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
        user_id_2 BIGINT UNSIGNED NOT NULL,  -- Corrected column name,
        FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE
        );
    `;

        // Execute the query
        const [results, fields] = await connection.query(createTableQuery);

        console.log('Chat room Table created successfully:');

        // Release the connection back to the pool
        connection.release();

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropChatRoomTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS chat_room
      `;

        // Execute the query
        const [results, fields] = await connection.query(dropTableQuery);

        console.log('chat room Table dropped successfully:');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}
