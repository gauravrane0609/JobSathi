exports.welcomeTemplate = (email, token, lang = "en") => {
  const unsubscribeUrl = `${process.env.BASE_URL}/unsubscribe/${token}`;

  const content = {
    en: {
      title: "Welcome to JobSathi 🎉",
      body: `
        <p>Thank you for subscribing to <b>JobSathi</b>.</p>
        <p>You will now receive <b>daily government job alerts</b>,
        last-date reminders and important updates.</p>
      `,
    },
    hi: {
      title: "JobSathi में आपका स्वागत है 🎉",
      body: `
        <p><b>JobSathi</b> को सब्सक्राइब करने के लिए धन्यवाद।</p>
        <p>अब आपको <b>सरकारी नौकरियों के दैनिक अलर्ट</b>
        और अंतिम तिथि की जानकारी मिलेगी।</p>
      `,
    },
    mr: {
      title: "JobSathi मध्ये तुमचे स्वागत आहे 🎉",
      body: `
        <p><b>JobSathi</b> ला सबस्क्राइब केल्याबद्दल धन्यवाद.</p>
        <p>आता तुम्हाला <b>दररोज सरकारी नोकरी सूचना</b>
        आणि अंतिम तारीख रिमाइंडर मिळतील.</p>
      `,
    },
  };

  const t = content[lang] || content.en;

  return `
<div style="
  font-family: Arial, Helvetica, sans-serif;
  background:#f5f7fb;
  padding:20px;
">

  <div style="
    max-width:600px;
    margin:auto;
    background:#ffffff;
    border-radius:10px;
    border:1px solid #e5e7eb;
  ">

    <!-- Header -->
    <div style="
      padding:14px 20px;
      border-bottom:1px solid #e5e7eb;
      display:flex;
      align-items:center;
      gap:8px;
    ">
      <!-- small icon (optional) -->
      <span style="
        width:8px;
        height:8px;
        background:#0d47a1;
        border-radius:50%;
        display:inline-block;
      "></span>

      <h3 style="
        margin:0;
        font-size:16px;
        color:#0d47a1;
      ">
        Government Job Alert
      </h3>
    </div>

    <!-- Body -->
    <div style="padding:20px">

      <h4 style="margin-top:0;color:#111">
        ${t.title}
      </h4>

      <ul style="
        padding-left:18px;
        margin:12px 0;
        font-size:14px;
        color:#333;
        line-height:1.6;
      ">
        ${t.body}
      </ul>

      <!-- CTA -->
      <div style="margin-top:16px">
        <a href="${process.env.BASE_URL}"
           style="
            display:inline-block;
            background:#0d47a1;
            color:#ffffff;
            padding:8px 16px;
            border-radius:6px;
            font-size:13px;
            text-decoration:none;
            font-weight:600;
           ">
           View Job Details
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="
      padding:14px 20px;
      border-top:1px solid #e5e7eb;
      font-size:11px;
      color:#777;
      text-align:center;
    ">
      <p style="margin:0 0 6px">
        You received this email because you subscribed to job alerts.
      </p>

      <a href="${unsubscribeUrl}"
         style="
          color:#777;
          text-decoration:underline;
         ">
        Unsubscribe
      </a>
    </div>

  </div>
</div>
`
;
};
