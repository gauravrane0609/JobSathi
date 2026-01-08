const router = require("express").Router();
const multer = require("multer");
const auth = require("../middleware/auth.middleware");
const {
  createAdmitCard,
  updateAdmitCard,
  deleteAdmitCard,
  getPublishedAdmitCards,
  getAllAdmitCards,
} = require("../controllers/admitCard.controller");

const upload = multer({ dest: "uploads/" });

// CLIENT
router.get("/", getPublishedAdmitCards);

// ADMIN
router.get("/admin", auth, getAllAdmitCards);
router.post("/", auth, upload.single("file"), createAdmitCard);
router.put("/:id", auth, upload.single("file"), updateAdmitCard);
router.delete("/:id", auth, deleteAdmitCard);

module.exports = router;
