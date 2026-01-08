const router = require("express").Router();
const mongoose = require("mongoose");
const Job = require("../models/Job");
const auth = require("../middleware/auth.middleware"); // JWT middleware

// ======================================================
// PUBLIC ROUTES (CLIENT SIDE)
// ======================================================

// GET /api/jobs?q=&page=&limit=
router.get("/", async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (q) {
      const re = new RegExp(q, "i");
      filter.$or = [
        { title: re },
        { organization: re },
        { location: re },
        { category: re },
      ];
    }

    const jobs = await Job.find(filter)
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Job.countDocuments(filter);

    res.json({
      data: jobs,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    res.json(job);
  } catch (err) {
    next(err);
  }
});

// ======================================================
// ADMIN ROUTES (PROTECTED)
// ======================================================

// POST /api/jobs
router.post("/", auth, async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

// PUT /api/jobs/:id
router.put("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    const updated = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      // ensure mongoose updates `updatedAt` when using findByIdAndUpdate
      timestamps: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Job not found" });
    }

    console.log(`Job ${updated._id} updated`);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    const removed = await Job.findByIdAndDelete(id);
    if (!removed) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
