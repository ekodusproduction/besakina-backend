import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price_registration: { type: Number },
    price_per_visit: { type: Number },
    images: [{ type: String }],
    video: { type: String },
    map_location: { type: String },
    latitude: { type: Number, precision: 10, scale: 8 },
    longitude: { type: Number, precision: 11, scale: 8 },
    category: { type: String },
    verified: { type: Boolean, default: true },
    is_active: { type: Boolean, default: true },
    street: { type: String },
    locality: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    seen_by: { type: Number, default: 0 },
    
}, {
    collection: 'advertisement',
    discriminatorKey: 'type',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
hospitalSchema.index({ title: 'text', name: 'text', type: 'text', description: 'text', city: 'text', state: 'text', locality: 'text', category: 'text', pincode: 'text' });
hospitalSchema.index({ is_active: 1, created_at: -1 });

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;
