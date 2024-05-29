import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const vehicleSchema = new mongoose.Schema({
    type: { type: String, required: true },
    brand: { type: String, required: true },
    registration_year: { type: String, required: true },
    kilometer_driven: { type: String, required: true },
    category: { type: String, required: true },
    fuel: { type: String, required: true },
    second_hand: { type: Boolean, required: true },
    model: { type: String, required: true },
    transmission: { type: String, required: true },
    variant: { type: String, required: true },
    // color: { type: String, required: true }
});

vehicleSchema.index({ title: 'text', brand: 'text', type: 'text', city: 'text', kilometer_driven: 'text', registration_year: 'text', fuel: 'text', category: 'text', price: 'text', second_hand: 'text', model: 'text', variant: 'text', transmission: 'text' });
vehicleSchema.index({ is_active: 1, created_at: -1 });

const Vehicle = Base.discriminator('Vehicle', vehicleSchema);

export default Vehicle;
