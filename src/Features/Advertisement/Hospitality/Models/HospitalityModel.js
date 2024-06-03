import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const hospitalitySchema = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: false, default: null },
    category: { type: String, default: null },
});

hospitalitySchema.index({ title: 'text', name: 'text', type: 'text', description: 'text', city: 'text', state: 'text', locality: 'text', category: 'text', pincode: 'text' });
hospitalitySchema.index({ is_active: 1, created_at: -1 });


const Hospitality = Base.discriminator('Hospitality', hospitalitySchema);

export default Hospitality;
