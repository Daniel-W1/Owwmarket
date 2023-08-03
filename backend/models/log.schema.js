import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to user document
    name: String
  },
  resource: String, // Optional, to indicate the affected resource ("user", "product")
  action: String, //  indicate the action ("userupdated","productupdated")
  resourceid: { type: mongoose.Schema.Types.ObjectId, required: false }, // Reference to affected resource document
  description: String,
  details: mongoose.Schema.Types.Mixed, // Flexible field to store additional details
},
{ timestamps: true });

const Log = mongoose.model('Log', logSchema);

export default Log;
