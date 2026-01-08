const cron = require("node-cron");
const Job = require("../models/Job");
const Subscriber = require("../models/Subscriber");
const { sendMail } = require("../utils/mailer");

cron.schedule("0 9 * * *", async () => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);

  const jobs = await Job.find({
    lastDate: {
      $gte: new Date(targetDate.setHours(0,0,0,0)),
      $lte: new Date(targetDate.setHours(23,59,59,999)),
    },
  });

  const subs = await Subscriber.find({ active: true });

  for (const job of jobs) {
    for (const s of subs) {
      await sendMail({
        to: s.email,
        subject: `⏰ Closing Soon: ${job.title}`,
        html: ` 
          <h3>${job.title}</h3>
          <p>Last Date: <b>${new Date(job.lastDate).toDateString()}</b></p>
          <a href="${process.env.BASE_URL}/jobs/${job._id}">
            Apply Now
          </a>
        `,
      });
    }
  }
});
