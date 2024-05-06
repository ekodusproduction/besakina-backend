import pool from "./mysql.database.js";

export const planUpdateTrigger = async function () {
    let connection = await pool.getConnection()
    try {
        const addTriggerSQL = `
        CREATE TRIGGER update_plan_date_trigger 
        AFTER UPDATE ON userselectedplans
        FOR EACH ROW
        BEGIN
            IF NEW.plan_id <> OLD.plan_id THEN
                UPDATE userselectedplans 
                SET plan_date = CURRENT_TIMESTAMP 
                WHERE id = NEW.id;
            END IF;
        END
      `;
        await connection.query(addTriggerSQL);
        console.log('Plan trigger added successfully:');
        return
    } catch (error) {
        console.log(error);
    }
    finally {
        connection.release()
    }
}

export const dropPlanUpdateTrigger = async function () {
    let connection = await pool.getConnection()

    try {
        const dropTriggerSQL = `
            DROP TRIGGER IF EXISTS update_plan_date_trigger;
        `;
        await connection.query(dropTriggerSQL);
        console.log('Plan trigger dropped successfully:');
        return
    } catch (error) {
        console.log(error);
    } finally {
        connection.release()
    }
}