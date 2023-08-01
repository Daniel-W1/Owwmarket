import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    shopid: { type: mongoose.Schema.ObjectId, ref: "Shop", required: "ShopID is required" },
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
    productimages: [{ data: Buffer, contentType: String }],
    category: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
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
    location: Object,
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", ProductSchema);

const ProductAuctionSchema = new mongoose.Schema({
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
      biddingAt: {
        type: Date,
        defualt: Date.now()
      }
    }
  ]
});

// Set up the discriminator for Google users
const ProductAuction = Product.discriminator("ProductAuction", ProductAuctionSchema);

export {Product, ProductAuction};