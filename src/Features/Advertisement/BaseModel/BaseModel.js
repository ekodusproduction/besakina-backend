import mongoose from 'mongoose';

const baseOptions = {
    discriminatorKey: 'advType',
    collection: 'advertisement',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};
const priceValidator = {
    validator: function (v) {
        return v === null || /^\d+(\.\d{1,2})?$/.test(v);
    },
    message: props => `${props.value} is not a valid price! Price should be a number with up to two decimal places.`
};

const baseSchema = new mongoose.Schema({
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
    locality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, default: null, validate: priceValidator },
}, baseOptions);

baseSchema.index({ "advType": 1 })
baseSchema.index({ "user": 1 })

baseSchema.pre('save', function (next) {
    for (let key in this.toObject()) {
        if (this[key] === "null" || this[key] === "") {
            this[key] = null;
        }
    }
    next();
});
const Base = mongoose.model('Base', baseSchema);

export default Base;
