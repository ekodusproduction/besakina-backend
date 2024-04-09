import { addPlans } from "./plan.seeder.js";

export const seeder = async () => {
    try {

        await addPlans();
    
        console.log("Seeder completed successfully.");
    } catch (error) {
        console.error("Error in seeder:", error);
    }
}

// Call seeder function
seeder();