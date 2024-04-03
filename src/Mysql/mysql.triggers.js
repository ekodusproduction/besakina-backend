import pool from "./mysql.database.js";

export const planUpdateTrigger = async function () {
    const connection = await pool.getConnection();
    try {
        const addTriggerSQL = `
        CREATE TRIGGER update_plan_date_trigger 
        AFTER UPDATE ON users
        FOR EACH ROW
        BEGIN
            IF NEW.plan_id <> OLD.plan_id THEN
                UPDATE users 
                SET plan_date = CURRENT_TIMESTAMP 
                WHERE id = NEW.id;
            END IF;
        END
      `;
        const [rows, fields] = await connection.query(addTriggerSQL);
        console.log('Plan trigger added successfully:');
    } catch (error) {
        console.log(error);
    } finally {
        connection.release();
    }
}

export const dropPlanUpdateTrigger = async function () {
    const connection = await pool.getConnection();
    try {
        const dropTriggerSQL = `
            DROP TRIGGER IF EXISTS update_plan_date_trigger;
        `;
        const [rows, fields] = await connection.query(dropTriggerSQL);
        console.log('Plan trigger dropped successfully:');
    } catch (error) {
        console.log(error);
    } finally {
        connection.release();
    }
}