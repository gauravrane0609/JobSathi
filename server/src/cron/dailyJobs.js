const cron = require("node-cron");
const Job = require("../models/Job");
const Subscriber = require("../models/Subscriber");
const { sendMail } = require("../../utils/mailer");
const { dailyDigestTemplate } = require("../emails/templates");

cron.schedule("0 8 * * *", async () => {
  const jobs = await Job.find({
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  if (!jobs.length) return;

  const users = await Subscriber.find({ active: true });

  for (const u of users) {
    await sendMail({
      to: u.email,
      subject: "Today's Government Job Alerts",
      html: dailyDigestTemplate(jobs, u.unsubToken),
    });
  }

  console.log("📧 Daily job digest sent");
});

exports.dailyDigestTemplate = (jobs, token) => `
<div style="font-family:Arial;max-width:650px;margin:auto">
  <h2 style="color:#0d47a1">Today's Government Jobs</h2>

  ${jobs.map(j => `
    <div style="padding:12px;border-bottom:1px solid #eee">
      <b>${j.title}</b><br/>
      📍 ${j.location || "India"}<br/>
      ⏰ Last Date: ${new Date(j.lastDate).toDateString()}
    </div>
  `).join("")}

  <p style="font-size:12px;margin-top:20px">
    <a href="${process.env.BASE_URL}/unsubscribe/${token}" style="color:#999">
      Unsubscribe
    </a>
  </p>
</div>
`;

