import mongoose from 'mongoose';

const BusinessDataSchema = new mongoose.Schema({
    fieldname: {
        type: String,
        required: true
    }, value: { type: String },
    label: { type: String }
});

const BusinessFormData = mongoose.model('BusinessFormData', BusinessDataSchema);

export default BusinessFormData;
