import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    type: { type: String, required: 'Please send type of banner' },
    images: { type: String, required: 'Please send image of banner' },
    isActive:{type:Boolean, default:true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: 'Please send User Id' },
    subType : {type:String, default: 'mB', enum: ['mB', 'sB'],}
    // mB = main banner, sB = sub banner or side banner
},{timestamps:true});

bannerSchema.index({ type: 1 })
const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
