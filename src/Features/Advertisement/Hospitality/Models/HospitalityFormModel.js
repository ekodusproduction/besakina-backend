import mongoose from 'mongoose';

const hospitalityDataSchema = new mongoose.Schema({
    fieldname: {
        type: String,
        enum: ['type'],
        required: true
    },
    value: { type: String },
    label: { type: String }
});

const HospitalityFormData = mongoose.model('HospitalityFormData', hospitalityDataSchema);

export default HospitalityFormData;