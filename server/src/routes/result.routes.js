const router = require("express").Router();
const multer = require("multer");
const auth = require("../middleware/auth.middleware");
const {
  createResult,
  updateResult,
  deleteResult,
  getPublishedResults,
  getAllResults,
} = require("../controllers/result.controller");

const upload = multer({ dest: "uploads/" });

// CLIENT
router.get("/", getPublishedResults);

// ADMIN
router.get("/admin", auth, getAllResults);
router.post("/", auth, upload.single("file"), createResult);
router.put("/:id", auth, upload.single("file"), updateResult);
router.delete("/:id", auth, deleteResult);

module.exports = router;
