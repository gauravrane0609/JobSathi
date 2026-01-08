const mongoose = require("mongoose");

const AdmitCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    organization: String,
    category: {
      type: String,
      enum: ["Railway", "Bank", "Police", "State", "Central"],
    },
    examName: String,
    admitCardDate: Date,
    downloadLink: String,
    instructions: String,
    status: { type: String, enum: ["Published", "Draft"], default: "Draft" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdmitCard", AdmitCardSchema);
