const router = require('express').Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth.middleware');

// PUBLIC (Client)
router.get('/', async (req, res) => {
  const categories = await Category.find({ active: true }).sort({ name: 1 });
  res.json(categories);
});

// ADMIN – all categories
router.get('/all', auth, async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
});

// CREATE
router.post('/', auth, async (req, res) => {
  const category = await Category.create(req.body);
  res.json(category);
});

// UPDATE (name / active)
router.put('/:id', auth, async (req, res) => {
  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

module.exports = router;
