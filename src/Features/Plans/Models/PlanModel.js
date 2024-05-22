import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    type: { type: String, required: true },
    no_of_ads: { type: Number, required: true },
    price: { type: Number, required: true },
    validity: { type: Number, required: true },
    verification_badge: { type: Boolean, required: true },
    search_priority: { type: Number, required: true },
    membership_badge: { type: String, required: true },
    contact_limit: { type: Number, required: true },
    no_images: { type: Number, required: true },
    business_profile: { type: Boolean, required: true },
    images_business_profile: { type: Number, required: true },
    offer_price: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

planSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
