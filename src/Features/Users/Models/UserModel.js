import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: { type: String, default: null },
    mobile: { type: String, required: true, unique: true },
    alternate_mobile: { type: Number, default: null },
    otp: { type: String, default: null },
    email: { type: String, default: null },
    doc_number: { type: String, default: null },
    doc_type: { type: String, default: null },
    doc_file: { type: String, default: null },
    doc_file_back: { type: String, default: null },
    profile_pic: { type: String, default: null },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', default: null },
    plan_date: { type: Date, default: Date.now },
    contacts_quota: { type: Number, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    locality: { type: String, default: null },
    pincode: { type: String, default: null },
    about: { type: String, default: null },
    verified: { type: Boolean, default: false },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Base'
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Custom validator for unique elements in the wishlist array
userSchema.path('wishlist').validate(function (value) {
    const uniqueValues = new Set(value.map(v => v.toString()));
    return uniqueValues.size === value.length;
}, 'Wishlist must contain unique items.');

userSchema.pre('save', function (next) {
    for (let key in this.toObject()) {
        if (this[key] === "null" || this[key] === "") {
            this[key] = null;
        }
    }

    // Ensure unique items in wishlist
    const uniqueWishlist = [...new Set(this.wishlist.map(item => item.toString()))];
    this.wishlist = uniqueWishlist;

    next();
});

const User = mongoose.model('User', userSchema);

export default User;
