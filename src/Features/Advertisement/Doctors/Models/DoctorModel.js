import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const doctorSchema = new mongoose.Schema({
    expertise: { type: String, required: true },
    name: { type: String, required: true },
    total_experience: { type: String, required: true },
    price_per_visit: { type: String, default: null },
});

doctorSchema.index({ expertise: 'text', name: "text", is_active: 1 });
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
