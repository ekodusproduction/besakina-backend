import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const educationDataSchema = new mongoose.Schema({
    fieldname: { type: String },
    value: { type: String },
    label: { type: String }
});

const EducationData = mongoose.model('EducationFormData', educationDataSchema);

export default EducationData;
