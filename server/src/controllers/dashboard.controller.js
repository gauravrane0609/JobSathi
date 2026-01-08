const Job = require('../models/Job');
const Category = require('../models/Category');
const Subscriber = require('../models/Subscriber');
const Banner = require('../models/Banner');

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalJobs,
      totalCategories,
      totalSubscribers,
      activeBanners,
    ] = await Promise.all([
      Job.countDocuments(),
      Category.countDocuments(),
      Subscriber.countDocuments(),
      Banner.countDocuments({ active: true }),
    ]);

    res.json({
      totalJobs,
      totalCategories,
      totalSubscribers,
      activeBanners,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard stats' });
  }
};
