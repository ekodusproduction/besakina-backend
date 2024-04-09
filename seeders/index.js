import { addPlans } from "./plan.seeder.js";
import { addProperties } from "./property.seeder.js";
export const seeder = async () => {
    try {

        // await addPlans();
        await addProperties();
        console.log("Seeder completed successfully.");
    } catch (error) {
        console.error("Error in seeder:", error);
    }
}

// Call seeder function
seeder();