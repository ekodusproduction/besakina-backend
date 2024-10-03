import mongoose from 'mongoose';
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
    name: { type: String, required: true, },
    description: { type: String, required: true },
    category: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

businessSchema.index({ "category": 1 })
businessSchema.index({ "user": 1 })

businessSchema.pre('save', function (next) {
    for (let key in this.toObject()) {
        if (this[key] === "null" || this[key] === "") {
            this[key] = null;
        }
    }
    next();
});

businessSchema.index({
    street: 'text',
    locality: 'text',
    city: 'text',
    state: 'text',
    pincode: 'text',
    name: 'text',
    description: 'text',
    category: 'text'
});

const Business = mongoose.model('Business', businessSchema);

export default Business;