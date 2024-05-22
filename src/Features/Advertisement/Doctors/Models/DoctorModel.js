import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expertise: { type: String },
    name: { type: String },
    total_experience: { type: Number },
    title: { type: String },
    description: { type: String },
    price_per_visit: { type: String },
    street: { type: String },
    locality: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    images: { type: String },
    video: { type: String },
    map_location: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    verified: { type: Boolean, default: true },
    is_active: { type: Boolean, default: true },
    seen_by: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    collection: 'advertisement',
    discriminatorKey: 'type'
}); 

doctorSchema.index({ title: 'text', expertise: 'text', description: 'text', street: 'text', city: 'text', locality: 'text', pincode: 'text' });
doctorSchema.index({ is_active: 1, created_at: -1 });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
