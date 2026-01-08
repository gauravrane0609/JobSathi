const cron = require('node-cron');
const Job = require('../models/Job');
const Subscriber = require('../models/Subscriber');
const sendMail = require('../utils/sendMail');

cron.schedule('0 9 * * *', async () => {
  console.log('📧 Daily job mail started');

  const today = new Date();
  today.setHours(0,0,0,0);

  const jobs = await Job.find({ createdAt: { $gte: today } });

  if (!jobs.length) return;

  const subs = await Subscriber.find();

  for (const sub of subs) {
    await sendMail({
      to: sub.email,
      subject: '🆕 New Government Jobs Today | JobSathi',
      html: dailyJobsTemplate(jobs)
    });
  }
});

//Email Template (Jobsathi Branding)
function dailyJobsTemplate(jobs) {
  return `
  <div style="font-family:Arial">
    <h2 style="color:#0d47a1">JobSathi.com</h2>
    <p>Latest government jobs updated today:</p>

    ${jobs.map(j => `
      <div style="margin-bottom:12px">
        <b>${j.title}</b> (${j.category})<br/>
        Last Date: ${new Date(j.lastDate).toDateString()}<br/>
        <a href="${j.applyLink}">Apply Now</a>
      </div>
    `).join('')}

    <hr/>
    <small>
      You are receiving this email because you subscribed on JobSathi.com  
      <br/>© JobSathi
    </small>
  </div>`;
}
