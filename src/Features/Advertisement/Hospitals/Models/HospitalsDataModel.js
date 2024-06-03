import mongoose from 'mongoose';

const hospitalsDataSchema = new mongoose.Schema({
    fieldname: {
        type: String,
        enum: ['type'],
        required: true
    },
    value: { type: String },
    label: { type: String }
});

const HospitalsFormData = mongoose.model('HospitalsFormData', hospitalsDataSchema);

export default HospitalsFormData;
