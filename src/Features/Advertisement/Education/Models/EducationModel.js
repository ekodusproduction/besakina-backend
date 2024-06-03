import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const educationSchema = new mongoose.Schema({
    type: { type: String, required: true },
    domain: [{
        type: String, required: true, validate: {
            validator: function (arr) {
                return arr.length > 0;
            },
            message: 'Domain cannot be empty'
        }
    }],
    institution_name: { type: String, required: true },
    course_duration: { type: String, required: true },
    price: { type: String, default: null },
});

educationSchema.index({ title: 'text', domain: 'text', institution_name: 'text', type: 'text', description: 'text', city: 'text', locality: 'text', pincode: 'text' });
educationSchema.index({ is_active: 1, created_at: -1 });

const Education = Base.discriminator('Education', educationSchema);

export default Education;
