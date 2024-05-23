import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

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
});

educationSchema.index({ title: 'text', domain: 'text', institution_name: 'text', type: 'text', description: 'text', city: 'text', locality: 'text', pincode: 'text' });
educationSchema.index({ is_active: 1, created_at: -1 });

// educationSchema.pre('save', function (next) {
//     // Set the discriminator key to the model name
//     this.__t = this.constructor.modelName;
//     console.log("constructor", this.constructor)
//     console.log("this", this.__t)
//     next();
// });

const Education = Base.discriminator('Education', educationSchema);

export default Education;
