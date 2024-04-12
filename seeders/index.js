import { addDoctors } from "./doctors.seeder.js";
import { addEducation } from "./education.seeder.js";
import { addHospitality } from "./hospitality.seeder.js";
import { addHospitals } from "./hospitals.seeder.js";
import { addPlans } from "./plan.seeder.js";
import { addProperties } from "./property.seeder.js";
import { addVehicles } from "./vehicles.seeder.js";
export const seeder = async () => {
    try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBsYW5faWQiOm51bGwsImlhdCI6MTcxMjkxNDQxOCwiZXhwIjoxNzEzMDAwODE4fQ.88IwYCh0KsbobN_zExG3tQiBhDibxeK8u0HVpUF5G-8'
        const baseUrl = '167.71.235.196'
        // await addPlans(token, baseUrl);
        await addProperties(token, baseUrl);
        await addVehicles(token, baseUrl)
        await addDoctors(token, baseUrl)
        await addEducation(token, baseUrl)
        await addHospitality(token, baseUrl)
        await addHospitals(token, baseUrl)
        console.log("Seeder completed successfully.");
    } catch (error) {
        console.error("Error in seeder:", error);
    }
}

// Call seeder function
seeder();