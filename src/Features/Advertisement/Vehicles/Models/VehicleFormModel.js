import mongoose from 'mongoose';

const VehicleDataSchema = new mongoose.Schema({
    fieldname: {
        type: String,
        enum: ['type', "brand", "fuel"],
        required: true
    }, value: { type: String },
    label: { type: String }
});

const VehicleFormData = mongoose.model('VehicleFormData', VehicleDataSchema);

export default VehicleFormData;
