import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const hospitalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price_registration: { type: Number },
    price_per_visit: { type: Number },
    category: { type: String },
    street: { type: String },
    locality: { type: String },
    city: { type: String },
    state: { type: String }
});

// Indexes
hospitalSchema.index({ title: 'text', name: 'text', type: 'text', description: 'text', city: 'text', state: 'text', locality: 'text', category: 'text', pincode: 'text' });
hospitalSchema.index({ is_active: 1, created_at: -1 });

// hospitalSchema.pre('save', function (next) {
//     // Set the discriminator key to the model name
//     this.__t = this.constructor.modelName;
//     console.log("constructor", this.constructor)
//     console.log("this", this.__t)
//     next();
// });

const Hospital = Base.discriminator('Hospital', hospitalSchema);

export default Hospital;
