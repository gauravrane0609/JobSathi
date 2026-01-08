const express = require("express");
const cors = require("cors");
require("dotenv").config();
  require("../src/cron/dailyJobs");
  const subscribeRoutes = require("./routes/subscribe.routes");
const adminRoutes = require("../src/routes/adminRoutes");
require("../src/cron/dailyJobs");

// ================= DB CONNECTION =================
require("./config/db");

// ================= APP INIT =================
const app = express();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "*", // later restrict to frontend domains
    credentials: true,
  })
);

app.use(express.json());

// // testMail.js
const { sendMail } = require("../utils/mailer");

sendMail({
  to: "YOUR_EMAIL@gmail.com",
  subject: "Brevo Test",
  html: "<h1>Brevo SMTP works 🎉</h1>",
})
.then(() => console.log("OK"))
.catch(console.error);


// ================= ROUTES =================
// ✅ ROUTES
app.use("/api/subscribe", require("./routes/subscribe.routes"));
app.use("/api/jobs", require("../src/routes/job.routes"));

// ✅ START CRON
require("./cron/dailyJobs");

app.use("/api/admin", adminRoutes);
app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/jobs", require("./routes/job.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/subscribe", require("./routes/subscribe.routes"));
app.use("/api/banners", require("./routes/banner.routes"));
app.use("/api/results", require("./routes/result.routes"));
app.use("/api/admit-cards", require("./routes/admitCard.routes"));
app.use("/api/syllabus", require("./routes/syllabus.routes"));

// ================= HEALTH CHECK =================
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// ================= ERROR HANDLER =================
const { errorHandler } = require("./middleware/errorHandler");
app.use(errorHandler);

// ================= EXPORT =================
module.exports = app;
