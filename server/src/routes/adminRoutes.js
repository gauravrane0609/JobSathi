const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

/**
 * GET all subscribers
 * /api/admin/subscribers
 */
router.get("/subscribers", async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json(subs);
  } catch (err) {
    console.error("Admin subscribers error", err);
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
});

/**
 * DELETE subscriber
 * /api/admin/subscribers/:id
 */
router.delete("/subscribers/:id", async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: "Subscriber removed" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
