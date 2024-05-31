import mongoose from 'mongoose';

const ExpertiseSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
});

const DoctorExpertise = mongoose.model('DoctorExpertise', ExpertiseSchema);

export default DoctorExpertise;
