import mongoose from 'mongoose';

const educationDataSchema = new mongoose.Schema({
    fieldname: {
        type: String,
        enum: ['type', "domain"],
        required: true
    },
    value: { type: String },
    label: { type: String }
});

const EducationFormData = mongoose.model('EducationFormData', educationDataSchema);

export default EducationFormData;
