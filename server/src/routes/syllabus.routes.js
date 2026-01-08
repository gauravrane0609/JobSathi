const router = require("express").Router();
const multer = require("multer");
const auth = require("../middleware/auth.middleware");
const {
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
  getPublishedSyllabus,
  getAllSyllabus,
} = require("../controllers/syllabus.controller");

const upload = multer({ dest: "uploads/" });

// CLIENT
router.get("/", getPublishedSyllabus);

// ADMIN
router.get("/admin", auth, getAllSyllabus);
router.post("/", auth, upload.single("file"), createSyllabus);
router.put("/:id", auth, upload.single("file"), updateSyllabus);
router.delete("/:id", auth, deleteSyllabus);

module.exports = router;
