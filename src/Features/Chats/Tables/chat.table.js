
import pool from "../../../Mysql/mysql.database";
export const createChatTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS chat (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        message VARCHAR(255),
        user_id BIGINT UNSIGNED NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        chat_room_id BIGINT UNSIGNED NOT NULL,
        FOREIGN KEY (chat_room_id) REFERENCES chat_room(id) ON DELETE CASCADE,
        )
    `;

        // Execute the query
        const [results, fields] = await connection.query(createTableQuery);

        console.log('Chat Table created successfully:');

        // Release the connection back to the pool
        connection.release();

    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export const dropChatTable = async function () {
    try {
        const connection = await pool.getConnection();

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS chat
      `;

        // Execute the query
        const [results, fields] = await connection.query(dropTableQuery);

        console.log('Chat Table dropped successfully:');

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error dropping table:', error);
    }
    return
}
