const mongoose = require("mongoose");
const crypto = require("crypto");

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  unsubToken: {
    type: String
    // default: () => crypto.randomBytes(20).toString("hex"),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subscriber", SubscriberSchema);
