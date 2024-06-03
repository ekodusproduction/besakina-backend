import mongoose from 'mongoose';

const propertyDataSchema = new mongoose.Schema({
    fieldname: {
        type: String,
        enum: ['type'],
        required: true
    },
    value: { type: String },
    label: { type: String }
});

const PropertyFormData = mongoose.model('PropertyFormData', propertyDataSchema);

export default PropertyFormData;
