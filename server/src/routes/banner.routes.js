const router = require('express').Router();
const multer = require('multer');
const auth = require('../middleware/auth.middleware');
const {
  uploadBanner,
  getActiveBanners,
  getAllBanners,
  toggleBanner,
} = require('../controllers/banner.controller');

const upload = multer({ dest: 'uploads/' });

// CLIENT
router.get('/', getActiveBanners);

// ADMIN
router.get('/all', auth, getAllBanners);
router.post('/', auth, upload.single('image'), uploadBanner);
router.put('/:id/toggle', auth, toggleBanner);

module.exports = router;
