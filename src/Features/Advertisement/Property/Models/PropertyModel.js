import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const propertySchema = new mongoose.Schema({
    type: { type: String, default: null },
    bedrooms: { type: Number, default: null },
    bathrooms: { type: Number, default: null },
    furnishing: { type: String, default: null },
    construction_status: { type: String, default: null },
    listed_by: { type: String, default: null },
    super_builtup_area: { type: Number, default: null },
    carpet_area: { type: Number, default: null },
    maintenance: { type: Number, default: null },
    total_rooms: { type: Number, default: null },
    floor_no: { type: Number, default: null },
    total_floors: { type: Number, default: null },
    car_parking: { type: Number, default: 0 },
    category: { type: String, default: null },
    house_no: { type: String, default: null }
});

propertySchema.index({ title: 'text', type: 'text', city: 'text', state: 'text', landmark: 'text', category: 'text', price: 'text', pincode: 'text' });
propertySchema.index({ is_active: 1, created_at: -1 });

const Property = Base.discriminator('Property', propertySchema);

export default Property;
