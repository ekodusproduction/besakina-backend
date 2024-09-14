import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    type: { type: String, required: true },
    images: { type: String, required: true },
});

bannerSchema.index({ type: 1 })
const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
