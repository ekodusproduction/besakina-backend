import pool from "./mysql.database.js";
import { dropCategoryTable } from "../Features/Categories/category.table.js";
import { dropPlanTable } from "../Features/Plans/plans.table.js";
import { dropOrderTable } from "../Features/Orders/order.table.js";
import { dropUserTable } from "../Features/Users/users.table.js";

import { dropDoctorsTable } from "../Features/Advertisement/Doctors/doctor.table.js";
import { dropEducationTable } from "../Features/Advertisement/Education/education.table.js";
import { dropPropertyTable } from "../Features/Advertisement/Property/property.table.js";
import { dropHospitalityTable } from "../Features/Advertisement/Hospitality/hospitality.table.js";
import { dropHospitalsTable } from "../Features/Advertisement/Hospitals/hospitals.table.js";
import { dropVehicleTable } from "../Features/Advertisement/Vehicles/vehicles.table.js"

async function dropTables() {
    try {
        // Drop tables in reverse order of their dependencies
        await dropOrderTable();
        // await dropCategoryTable();

        await dropDoctorsTable();
        await dropEducationTable();
        await dropHospitalsTable();
        await dropHospitalityTable();
        await dropPropertyTable();
        await dropVehicleTable();

        await dropUserTable();
        await dropPlanTable();
        await dropDatabase()
    } catch (error) {
        console.error('Error dropping tables:', error);
    } finally {
        // Ensure the connection is always released, even if an error occurs
        pool.end();
    }
}

async function dropDatabase() {
    try {
        const query = "DROP DATABASE IF EXISTS besakina";
        await pool.query(query);
        console.log("Database 'besakina' dropped successfully");
    } catch (error) {
        console.error("Error dropping database 'besakina':", error);
    }
}
// Call the function to drop the tables
dropTables();
