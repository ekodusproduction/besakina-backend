import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    type: { type: String },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    furnishing: { type: String },
    construction_status: { type: String },
    listed_by: { type: String },
    super_builtup_area: { type: Number },
    carpet_area: { type: Number },
    maintenance: { type: Number },
    total_rooms: { type: Number },
    floor_no: { type: Number },
    total_floors: { type: Number },
    car_parking: { type: Number, default: 1 },
    price: { type: String },
    category: { type: String },
    description: { type: String },
    street: { type: String },
    house_no: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    images: [{ type: String }],
    video: { type: String },
    map_location: { type: String },
    latitude: { type: Number, precision: 10, scale: 8 },
    longitude: { type: Number, precision: 11, scale: 8 },
    seen_by: { type: Number, default: 0 },
    verified: { type: Boolean, default: true },
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    collection: 'advertisement',
    discriminatorKey: 'discriminatorKey',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

propertySchema.index({ title: 'text', type: 'text', city: 'text', state: 'text', landmark: 'text', category: 'text', price: 'text', pincode: 'text' });
propertySchema.index({ is_active: 1, created_at: -1 });

const Property = mongoose.model('Property', propertySchema);

export default Property;
