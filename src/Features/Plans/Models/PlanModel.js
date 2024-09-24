import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    type: { type: String, required: true },
    no_of_ads: { type: String, required: true },
    price: { type: String, required: true },
    validity: { type: Number, required: true },
    extra_offer_validity: { type: Number, required: true },
    verification_badge: { type: String, required: true },
    search_priority: { type: String, required: true },
    membership_badge: { type: String, required: true },
    contact_limit: { type: String, required: true },
    no_images: { type: String, required: true },
    business_profile: { type: Boolean, required: true },
    images_business_profile: { type: String, required: true },
    offer_price: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

planSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

planSchema.pre('save', function (next) {
    for (let key in this.toObject()) {
        if (this[key] === "null" || this[key] === "") {
            this[key] = null;
        }
    }
    next();
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
