const router = require('express').Router();
const jwt = require('jsonwebtoken');
const {
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

// ===============================
// POST /api/auth/login
// ===============================
router.post('/login', login);

// ===============================
// POST /api/auth/forgot-password
// ===============================
router.post('/forgot-password', forgotPassword);

// ===============================
// POST /api/auth/reset-password
// ===============================
router.post('/reset-password', resetPassword);

// ===============================
// GET /api/auth/verify
// ===============================
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      valid: true,
      user: payload,
    });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
