const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    qualification: String,
    organization: String,
    description: String,
    location: String,
    lastDate: Date,
    link: String,
    applyLink: String,
    active: { type: Boolean, default: true },
    // server/src/models/Job.js
  lastDate: {
  type: Date,
  required: true
},

  reminderSent: {
  type: Boolean,
  default: false
},

logo: {
    type: String, // image URL
    default: ''
  }

  },
  { timestamps: true },
  
);

module.exports = mongoose.model("Job", JobSchema);
