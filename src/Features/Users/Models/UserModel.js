import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: { type: String },
    mobile: { type: String, required: true, unique: true },
    alternate_mobile: { type: Number, unique: true },
    otp: { type: String },
    email: { type: String },
    doc_number: { type: String },
    doc_type: { type: String },
    doc_file: { type: String },
    doc_file_back: { type: String },
    profile_pic: { type: String },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    plan_date: { type: Date, default: Date.now },
    contacts_quota: { type: Number },
    state: { type: String },
    city: { type: String },
    locality: { type: String },
    pincode: { type: String },
    about: { type: String },
    verified: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;
