import mongoose from 'mongoose';

const baseOptions = {
    discriminatorKey: 'advType',
    collection: '',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};

const businessSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: [{ type: String, required: true }],
    video: { type: String },
    map_location: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    verified: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    seen_by: { type: Number, default: 0 },
    street: { type: String, required: true },
    locality: { type: String, required: false, default: null },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    title: { type: String, required: false, default: null },
    description: { type: String, required: true },
}, baseOptions);

baseSchema.index({ "category": 1 })
baseSchema.index({ "user": 1 })

businessSchema.pre('save', function (next) {
    for (let key in this.toObject()) {
        if (this[key] === "null" || this[key] === "") {
            this[key] = null;
        }
    }
    next();
});

const Business = mongoose.model('Business', businessSchema);

export default Base;