
import pool from "../../../Mysql/mysql.database.js";

export const createChatTable = async function () {
    try {

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS chat (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        message VARCHAR(255),
        user_id BIGINT UNSIGNED NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        chat_room_id BIGINT UNSIGNED NOT NULL,
        FOREIGN KEY (chat_room_id) REFERENCES chat_room(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

        // Execute the query
        const [results, fields] = await pool.raw(createTableQuery);

        console.log('Chat Table created successfully:');

        // Release the connection back to the pool

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropChatTable = async function () {
    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS chat
      `;

        // Execute the query
        const [results, fields] = await pool.raw(dropTableQuery);

        console.log('Chat Table dropped successfully:');

        // Release the connection back to the pool
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}
