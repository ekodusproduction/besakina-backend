import pool from "./mysql.database.js";
import { createUserTable } from "../Features/Users/users.table.js";
import { createOrderTable } from "../Features/Orders/order.table.js";
import { createPlanTable } from "../Features/Plans/plans.table.js";
import { createCategoryTable } from "../Features/Categories/category.table.js";

import { createPropertyTable } from "../Features/Advertisement/Property/property.table.js";
import { createEducationTable } from "../Features/Advertisement/Education/education.table.js";
import { createVehicleTable } from "../Features/Advertisement/Vehicles/vehicles.table.js";
import { createHospitalsTable } from "../Features/Advertisement/Hospitals/hospitals.table.js";
import { createHospitalityTable } from "../Features/Advertisement/Hospitality/hospitality.table.js";
import { createDoctorsTable } from "../Features/Advertisement/Doctors/doctor.table.js";

// triggers
import { planUpdateTrigger } from "./mysql.triggers.js";

async function createTables() {
    try {
        await createPlanTable();
        await createUserTable();
        // await createCategoryTable();
        await createPropertyTable();
        await createEducationTable();
        await createHospitalsTable();
        await createHospitalityTable();
        await createVehicleTable();
        await createDoctorsTable();
        // await createOrderTable();

        await createTriggers();
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        // Ensure the connection is always released, even if an error occurs
        pool.end();
    }
}

async function createTriggers() {
    try {
        await planUpdateTrigger()
        console.log('added triggers succesfully');
    } catch (error) {
        console.error("Error creating database 'besakina':", error);
    }
}

// Call the function to create the tables

createTables()
