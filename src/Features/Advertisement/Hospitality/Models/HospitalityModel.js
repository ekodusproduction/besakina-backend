import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const hospitalitySchema = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, default: null },
});

hospitalitySchema.index({ title: 'text', name: 'text', type: 'text', description: 'text', city: 'text', state: 'text', locality: 'text', category: 'text', pincode: 'text' });
hospitalitySchema.index({ is_active: 1, created_at: -1 });

// hospitalitySchema.pre('save', function (next) {
//     // Set the discriminator key to the model name
//     this.__t = this.constructor.modelName;
//     console.log("constructor", this.constructor)
//     console.log("this", this.__t)
//     next();
// });


const Hospitality = Base.discriminator('Hospitality', hospitalitySchema);

export default Hospitality;
