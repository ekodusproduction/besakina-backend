import pool from "../../Mysql/mysql.database.js"

export const createOrderTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your CREATE TABLE query
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS orders (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        plan_id BIGINT UNSIGNED NOT NULL,
        user_id BIGINT UNSIGNED NOT NULL,

        payment BIGINT UNSIGNED,
        payment_status BOOL,
        payment_no BIGINT,
        
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );`;

        // Execute the query
        await pool(createTableQuery);

        console.log('Order Table created successfully:');

        // Release the connection back to the pool

    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
}

export const dropOrderTable = async function () {
    let connection = await pool.getConnection();

    try {

        // Define your DROP TABLE query
        const dropTableQuery = `
        DROP TABLE IF EXISTS orders
      `;

        // Execute the query
        await pool(dropTableQuery);

        console.log('Order Table dropped successfully:');

        // Release the connection back to the pool
    } catch (error) {
        console.error('Error dropping table:', error);
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }

}
