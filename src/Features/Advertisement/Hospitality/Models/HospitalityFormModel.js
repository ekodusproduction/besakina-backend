import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const hospitalityDataSchema = new mongoose.Schema({
    fieldname: { type: String },
    value: { type: String },
    label: { type: String }
});

const HospitalityFormData = mongoose.model('HospitalityFormData', hospitalityDataSchema);

export default HospitalityFormData;
