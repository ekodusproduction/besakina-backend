import { addDoctors } from "./doctors.seeder.js";
import { addEducation } from "./education.seeder.js";
import { addHospitality } from "./hospitality.seeder.js";
import { addHospitals } from "./hospitals.seeder.js";
import { addPlans } from "./plan.seeder.js";
import { addProperties } from "./property.seeder.js";
import { addVehicles } from "./vehicles.seeder.js";
export const seeder = async () => {
    try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBsYW5faWQiOm51bGwsImlhdCI6MTcxMjgxNTgyMywiZXhwIjoxNzEyOTAyMjIzfQ.P1FwtOTMnh0opjjWEV1X5dgeteStUfkP_rbOlwnURAg'
        await addPlans(token);
        await addProperties(token);
        await addVehicles(token)
        await addDoctors(token)
        await addEducation(token)
        await addHospitality(token)
        await addHospitals(token)
        console.log("Seeder completed successfully.");
    } catch (error) {
        console.error("Error in seeder:", error);
    }
}

// Call seeder function
seeder();