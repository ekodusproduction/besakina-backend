import mongoose from 'mongoose';
import Base from '../../BaseModel/BaseModel.js';

const propertySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    type: { type: String },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    furnishing: { type: String },
    construction_status: { type: String },
    listed_by: { type: String },
    super_builtup_area: { type: Number },
    carpet_area: { type: Number },
    maintenance: { type: Number },
    total_rooms: { type: Number },
    floor_no: { type: Number },
    total_floors: { type: Number },
    car_parking: { type: Number, default: 1 },
    price: { type: String },
    category: { type: String },
    description: { type: String },
    street: { type: String },
    house_no: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },

});

propertySchema.index({ title: 'text', type: 'text', city: 'text', state: 'text', landmark: 'text', category: 'text', price: 'text', pincode: 'text' });
propertySchema.index({ is_active: 1, created_at: -1 });

// propertySchema.pre('save', function (next) {
//     // Set the discriminator key to the model name
//     this.__t = this.constructor.modelName;
//     console.log("constructor", this.constructor)
//     console.log("this", this.__t)
//     next();
// });


const Property = Base.discriminator('Property', propertySchema);

export default Property;
