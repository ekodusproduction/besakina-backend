import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expertise: { type: String, required: true },
    name: { type: String, required: true },
    total_experience: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price_per_visit: { type: String },
    street: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    images: [{ type: String }],
    video: { type: String },
    map_location: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    verified: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    seen_by: { type: Number, default: 0 },
}, {
    collection: 'advertisement',
    discriminatorKey: 'type',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

doctorSchema.index({ title: 'text', expertise: 'text', description: 'text', street: 'text', city: 'text', locality: 'text', pincode: 'text' });
doctorSchema.index({ is_active: 1, created_at: -1 });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
