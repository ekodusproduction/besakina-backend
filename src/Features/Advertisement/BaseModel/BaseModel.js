import mongoose from 'mongoose';

const baseOptions = {
    discriminatorKey: 'advType',
    collection: 'advertisement',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};

const baseSchema = new mongoose.Schema({
    images: [{ type: String }],
    video: { type: String },
    map_location: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    verified: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    seen_by: { type: Number, default: 0 },
}, baseOptions);

baseSchema.index({ "advType": 1 })
baseSchema.index({ "user": 1 })

const Base = mongoose.model('Base', baseSchema);

export default Base;
