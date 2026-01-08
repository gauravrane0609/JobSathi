const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");
const { sendMail } = require("../../utils/mailer");
const { welcomeTemplate } = require("../emails/templates");

// SUBSCRIBE
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    let subscriber = await Subscriber.findOne({ email });

    if (subscriber && subscriber.active) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    if (!subscriber) {
      subscriber = await Subscriber.create({ email });
    } else {
      subscriber.active = true;
      await subscriber.save();
    }

    // 🔐 EMAIL SHOULD NOT BREAK SUBSCRIPTION
    try {
      await sendMail({
        to: email,
        subject: "Welcome to JobSathi 🎉",
        html: welcomeTemplate(email, subscriber.unsubToken),
      });
    } catch (mailErr) {
      console.error("⚠️ Email failed but subscription saved:", mailErr.message);
    }

    // ✅ ALWAYS RESPOND SUCCESS
    return res.status(200).json({
      success: true,
      message: "Subscribed successfully",
    });

  } catch (err) {
    console.error("Subscribe API error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ADMIN LIST
router.get("/admin", async (_, res) => {
  const list = await Subscriber.find().sort({ createdAt: -1 });
  res.json(list);
});

// UNSUBSCRIBE
router.get("/unsubscribe/:token", async (req, res) => {
  await Subscriber.findOneAndUpdate(
    { unsubToken: req.params.token },
    { active: false }
  );
  res.send("You are unsubscribed successfully 👍");
});


module.exports = router;
