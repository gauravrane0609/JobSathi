const mongoose = require("mongoose");

const SyllabusSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    organization: String,
    category: {
      type: String,
      enum: ["Railway", "Bank", "Police", "State", "Central"],
    },
    examName: String,
    syllabusPdfUrl: String,
    description: String,
    status: { type: String, enum: ["Published", "Draft"], default: "Draft" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Syllabus", SyllabusSchema);
