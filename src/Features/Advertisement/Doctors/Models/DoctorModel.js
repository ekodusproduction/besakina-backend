import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const doctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expertise: { type: String, required: true },
    name: { type: String, required: true },
    total_experience: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price_per_visit: { type: String },
    street: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
});

doctorSchema.index({ title: 'text', expertise: 'text', description: 'text', street: 'text', city: 'text', locality: 'text', pincode: 'text' });
doctorSchema.index({ is_active: 1, created_at: -1 });

// doctorSchema.pre('save', function (next) {
//     // Set the discriminator key to the model name
//     this.__t = this.constructor.modelName;
//     console.log("constructor", this.constructor)
//     console.log("this", this.__t)
//     next();
// });

const Doctor = Base.discriminator('Doctor', doctorSchema);
export default Doctor;
