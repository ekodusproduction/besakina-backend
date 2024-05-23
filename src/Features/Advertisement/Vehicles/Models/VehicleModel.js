import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const vehicleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String },
    brand: { type: String },
    registration_year: { type: String },
    kilometer_driven: { type: String },
    title: { type: String },
    description: { type: String },
    price: { type: String },
    category: { type: String },
    street: { type: String },
    locality: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },

    fuel: { type: String },
    second_hand: { type: Boolean },
    model: { type: String },
    transmission: { type: String },
    variant: { type: String },
    color: { type: String },
});

vehicleSchema.index({ title: 'text', brand: 'text', type: 'text', city: 'text', kilometer_driven: 'text', registration_year: 'text', fuel: 'text', category: 'text', price: 'text', second_hand: 'text', model: 'text', variant: 'text', transmission: 'text' });
vehicleSchema.index({ is_active: 1, created_at: -1 });

// vehicleSchema.pre('save', function (next) {
//     // Set the discriminator key to the model name
//     this.__t = this.constructor.modelName;
//     console.log("constructor", this.constructor)
//     console.log("this", this.__t)
//     next();
// });

const Vehicle = Base.discriminator('Vehicle', vehicleSchema);

export default Vehicle;
