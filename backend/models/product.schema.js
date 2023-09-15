import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.ObjectId, ref: "User", required: "Owner is required"},
    shopId: { type: mongoose.Schema.ObjectId, ref: "Shop", required: "ShopID is required" },
    productname: {
      type: String,
      required: "Name is required",
    },
    productdescription: {
      type: String,
      required: "Description is required",
    },
    slug: {
      type: String,
      required: "Slug already exists",
      trim: true,
      unique: true
    },
    category: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      required: function () {
        return !this.auction;
      },
    },
    auction: {
      type: Boolean,
      default: false,
    },
    intialItemCount: {
      type: Number,
      required: true
    },
    itemsLeft: {
      type: Number,
      required: true
    },
    location: String,
    productImages : [{ data: Buffer, contentType: String }],
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", ProductSchema);

const ProductAuctionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.ObjectId, ref: "Product", required: "ProductID is required" },
  startedprice: {
    type: Number,
    default: 0
  },
  bids: [
    {
      userid: { type: mongoose.Schema.ObjectId, ref: "User" },
      bid: {
        type: Number,
        required: "You should give a price!"
      },
    }
  ]
}, { timestamps: true }
);

// Set up the discriminator for Google users
const ProductAuction = Product.discriminator("ProductAuction", ProductAuctionSchema);

export {Product, ProductAuction};
