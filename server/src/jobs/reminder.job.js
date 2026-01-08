const cron = require('node-cron');
const Job = require('../models/Job');
const Subscriber = require('../models/Subscriber');
const sendMail = require('../../utils/sendMail'); // nodemailer util

cron.schedule('0 9 * * *', async () => {
  console.log('🔔 Running job reminder cron');

  const today = new Date();
  const reminderDate = new Date();
  reminderDate.setDate(today.getDate() + 3); // 🔔 3 days before

  const jobs = await Job.find({
    lastDate: {
      $gte: today,
      $lte: reminderDate,
    },
    reminderSent: false,
  });

  if (!jobs.length) return;

  const subscribers = await Subscriber.find();

  for (const job of jobs) {
    for (const sub of subscribers) {
      await sendMail({
        to: sub.email,
        subject: `⏰ Reminder: ${job.title} closes soon`,
        html: `
          <h3>${job.title}</h3>
          <p>Last Date: <strong>${job.lastDate.toDateString()}</strong></p>
          <a href="${process.env.CLIENT_URL}/jobs/${job._id}">
            View Job
          </a>
        `,
      });
    }

    job.reminderSent = true;
    await job.save();
  }
});
