const Job = require("../models/Job");
import Subscriber from "../models/Subscriber.js";
import { sendMail } from "../utils/mailer.js";
import { newJobTemplate } from "../emails/templates.js";

exports.createJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.json(job);
  const subscribers = await Subscriber.find({ active: true });

for (let user of subscribers) {
  await sendMail({
    to: user.email,
    subject: `New Job Posted: ${job.title}`,
    html: newJobTemplate(job, user.unsubToken),
  });
}
};

exports.getJobs = async (req, res) => {
  // return jobs ordered by most-recently-updated first (fallback to createdAt)
  const jobs = await Job.find().sort({ updatedAt: -1, createdAt: -1 });
  res.json(jobs);
};

exports.updateJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    // ensure updatedAt is touched on update
    timestamps: true,
  });

  if (job) console.log(`Job ${job._id} updated (controller)`);
  res.json(job);
};

exports.deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
