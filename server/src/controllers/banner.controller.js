const Banner = require('../models/Banner');
const cloudinary = require('../config/cloudinary');

exports.uploadBanner = async (req, res) => {
  const { title, link } = req.body;

  const upload = await cloudinary.uploader.upload(req.file.path, {
    folder: 'jobsathi/banners',
  });

  const banner = await Banner.create({
    title,
    link,
    imageUrl: upload.secure_url,
  });

  res.json(banner);
};

exports.getActiveBanners = async (req, res) => {
  const banners = await Banner.find({ active: true }).sort({ createdAt: -1 });
  res.json(banners);
};

exports.getAllBanners = async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 });
  res.json(banners);
};

exports.toggleBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  banner.active = !banner.active;
  await banner.save();
  res.json(banner);
};
