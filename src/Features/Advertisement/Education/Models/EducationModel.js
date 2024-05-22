import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    domain: { type: String, required: true },
    institution_name: { type: String, required: true },
    course_duration: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String },
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

educationSchema.index({ title: 'text', domain: 'text', institution_name: 'text', type: 'text', description: 'text', city: 'text', locality: 'text', pincode: 'text' });
educationSchema.index({ is_active: 1, created_at: -1 });

const Education = mongoose.model('Education', educationSchema);

export default Education;
