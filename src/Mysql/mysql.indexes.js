import { indexDoctorsTable } from "../Features/Advertisement/Doctors/doctor.table.js";
import { indexEducationTable } from "../Features/Advertisement/Education/education.table.js";
import { indexHospitalityTable } from "../Features/Advertisement/Hospitality/hospitality.table.js";
import { indexHospitalsTable } from "../Features/Advertisement/Hospitals/hospitals.table.js";
import { indexPropertyTable } from "../Features/Advertisement/Property/property.table.js";
import { indexVehiclesTable } from "../Features/Advertisement/Vehicles/vehicles.table.js";

export const addIndexes = async () => {
    try {
        await indexDoctorsTable()
        await indexEducationTable()
        await indexHospitalityTable()
        await indexHospitalsTable()
        await indexPropertyTable()
        await indexVehiclesTable()
    } catch(error){
        console.log(error)
    }
}