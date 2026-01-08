import crypto from "crypto";
import Subscriber from "../models/Subscriber.js";
import { sendMail } from "../utils/mailer.js";
import { welcomeTemplate } from "../emails/templates.js";


exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Subscriber.findOne({ email });

    // ✅ Already subscribed (NOT an error)
    if (existing) {
      return res.status(200).json({
        message: "You are already subscribed to JobSathi 🎉",
      });
    }

    const unsubToken = crypto.randomBytes(24).toString("hex");

    const subscriber = await Subscriber.create({
      email,
      unsubToken,
      active: true,
    });

    // Send welcome email (safe try/catch)
    try {
      await sendJobAlert(
        email,
        "Welcome to JobSathi 🎉",
        welcomeTemplate(email, unsubToken)
      );
    } catch (err) {
      console.error("Mail error:", err.message);
    }

    return res.status(200).json({
      message: "Subscription successful 🎯",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
