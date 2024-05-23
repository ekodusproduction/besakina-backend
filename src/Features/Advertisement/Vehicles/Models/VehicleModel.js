import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String },
    brand: { type: String },
    registration_year: { type: String },
    kilometer_driven: { type: String },
    title: { type: String },
    description: { type: String },
    price: { type: String },
    category: { type: String },
    street: { type: String },
    locality: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    images: [{ type: String }],
    video: { type: String },
    map_location: { type: String },
    latitude: { type: Number, precision: 10, scale: 8 },
    longitude: { type: Number, precision: 11, scale: 8 },
    verified: { type: Boolean, default: true },
    is_active: { type: Boolean, default: true },
    seen_by: { type: Number, default: 0 },
    fuel: { type: String },
    second_hand: { type: Boolean },
    model: { type: String },
    transmission: { type: String },
    variant: { type: String },
    color: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    collection: 'advertisement',
    discriminatorKey: 'discriminatorKey',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

vehicleSchema.index({ title: 'text', brand: 'text', type: 'text', city: 'text', kilometer_driven: 'text', registration_year: 'text', fuel: 'text', category: 'text', price: 'text', second_hand: 'text', model: 'text', variant: 'text', transmission: 'text' });
vehicleSchema.index({ is_active: 1, created_at: -1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
