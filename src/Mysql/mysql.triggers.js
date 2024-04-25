import pool from "./mysql.database.js";

export const planUpdateTrigger = async function () {
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
        const [rows, fields] = await pool.raw(addTriggerSQL);
        console.log('Plan trigger added successfully:');
        return
    } catch (error) {
        console.log(error);
    }
}

export const dropPlanUpdateTrigger = async function () {
    try {
        const dropTriggerSQL = `
            DROP TRIGGER IF EXISTS update_plan_date_trigger;
        `;
        const [rows, fields] = await pool.raw(dropTriggerSQL);
        console.log('Plan trigger dropped successfully:');
        return
    } catch (error) {
        console.log(error);
    }
}