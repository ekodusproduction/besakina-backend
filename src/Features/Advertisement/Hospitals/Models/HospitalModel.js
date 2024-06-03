import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const hospitalSchema = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: false, default: null },
    price_registration: { type: Number, default: null },
    price_per_visit: { type: Number, default: null },
    category: { type: String, default: null },
});

hospitalSchema.index({ title: 'text', name: 'text', type: 'text', description: 'text', city: 'text', state: 'text', locality: 'text', category: 'text', pincode: 'text' });
hospitalSchema.index({ is_active: 1, created_at: -1 });

const Hospital = Base.discriminator('Hospital', hospitalSchema);

export default Hospital;
