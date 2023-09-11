import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.ObjectId, ref: "User" },
    planName: {
      type: String,
      default: "Free",
    }, // Name of the subscription plan ["Free", "Premuim", "Gold"]
    duration: {
        type: Number,
        default: 30
    },
    startDate: {
      type: Date,
      default: new Date(),
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("subscription", SubscriptionSchema);
export default Subscription;
