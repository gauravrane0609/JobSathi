const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    organization: String,
    category: {
      type: String,
      enum: ["Railway", "Bank", "Police", "State", "Central"],
    },
    examName: String,
    resultDate: Date,
    pdfUrl: String,
    officialLink: String,
    status: { type: String, enum: ["Published", "Draft"], default: "Draft" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", ResultSchema);
