import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
  },
  // Payment status (e.g., 'succeeded', 'failed', 'pending')
  status: {
    type: String,
    required: true,
  },
  details: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
