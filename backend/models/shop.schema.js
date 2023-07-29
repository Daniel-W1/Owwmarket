import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        data: Buffer,
        contentType: String
    },
    owner: {type: mongoose.Schema.ObjectId, ref: 'User'}
}
, {timestamps: true}
);

const Shop = mongoose.model('Shop', ShopSchema);
export default Shop;