const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendMail({ to, subject, html }) {
  try {
    const response = await tranEmailApi.sendTransacEmail({
      sender: {
        name: "JobSathi",
        email: process.env.MAIL_FROM || "jaygajanan@gmail.com",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log("✅ Email sent:", response.messageId);
    return response;
  } catch (error) {
    console.error("❌ Brevo API email failed:", error.message);
    throw error;
  }
}

module.exports = { sendMail };
