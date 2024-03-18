import pool from "./mysql.database.js";
import { dropCategoryTable } from "../Features/Categories/category.table.js";
import { dropDoctorsTable } from "../Features/Advertisement/Doctors/doctor.table.js";
import { dropEducationTable } from "../Features/Advertisement/Education/education.table.js";
import { dropPlanTable } from "../Features/Plans/plans.table.js";
import { dropPropertyTable } from "../Features/Advertisement/Property/property.table.js";
import { dropHospitalityTable } from "../Features/Advertisement/Hospitality/hospitality.table.js";
import { dropHospitalsTable } from "../Features/Advertisement/Hospitals/hospitals.table.js";
import { dropOrderTable } from "../Features/Orders/order.table.js";
import { dropUserTable } from "../Features/Users/users.table.js";
async function dropTables() {
    try {
        // Drop tables in reverse order of their dependencies
        await dropOrderTable();
        await dropCategoryTable();
        await dropDoctorsTable();
        await dropEducationTable();
        await dropHospitalsTable();
        await dropHospitalityTable();
        await dropPropertyTable();
        await dropVehiclesTable();
        await dropPlanTable();  // Drop 'plans' table last
        await dropUserTable();
    } catch (error) {
        console.error('Error dropping tables:', error);
    } finally {
        // Ensure the connection is always released, even if an error occurs
        pool.end();
    }
}

// Call the function to drop the tables
dropTables();
