
import pool from "../../../Mysql/mysql.database.js";

export const createUserPlansTable = async function () {
    let connection = await pool.getConnection();
    try {
        const createTableQuery = `CREATE TABLE IF NOT EXISTS userselectedplans (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            plan_id BIGINT UNSIGNED,
            user BIGINT UNSIGNED,
            FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`;
        await connection.query(createTableQuery);
        console.log('userselectedplans Table created successfully:');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

export const dropUserPlanTable = async function () {
    let connection = await pool.getConnection();
    try {
        const dropTableQuery = `
        DROP TABLE IF EXISTS userselectedplans
      `;
        await connection.query(dropTableQuery);
        console.log('Userselectedplans Table dropped successfully:');
    } catch (error) {
        console.error('Error dropping table:', error);
    } finally {
        connection.release();
    }
}
