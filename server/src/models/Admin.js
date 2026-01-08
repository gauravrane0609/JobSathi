const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

/**
 * ✅ Correct pre-save hook for Node 22 + latest Mongoose
 * - NO next()
 * - async only
 */
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('Admin', AdminSchema);
