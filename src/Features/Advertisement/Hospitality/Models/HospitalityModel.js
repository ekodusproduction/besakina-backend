import mongoose from 'mongoose';

const hospitalitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    price: { type: String },
    street: { type: String },
    locality: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    images: [{ type: String }],
    video: { type: String },
    map_location: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    verified: { type: Boolean, default: true },
    is_active: { type: Boolean, default: true },
    seen_by: { type: Number, default: 0 },

}, {
    collection: 'advertisement',
    discriminatorKey: 'discriminatorKey',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

hospitalitySchema.index({ title: 'text', name: 'text', type: 'text', description: 'text', city: 'text', state: 'text', locality: 'text', category: 'text', pincode: 'text' });
hospitalitySchema.index({ is_active: 1, created_at: -1 });

const Hospitality = mongoose.model('Hospitality', hospitalitySchema);

export default Hospitality;
