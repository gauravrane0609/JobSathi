const nodemailer = require('nodemailer');

/**
 * Send email utility
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 */
async function sendMail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"JobSathi Alerts" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('📧 Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    throw err;
  }
}

module.exports = sendMail;
