const AdmitCard = require("../models/AdmitCard");
const cloudinary = require("../config/cloudinary");

exports.createAdmitCard = async (req, res) => {
  const {
    title,
    organization,
    category,
    examName,
    admitCardDate,
    downloadLink,
    instructions,
    status,
  } = req.body;

  let finalLink = downloadLink;
  if (req.file) {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "jobsathi/admit-cards",
    });
    finalLink = upload.secure_url;
  }

  const admit = await AdmitCard.create({
    title,
    organization,
    category,
    examName,
    admitCardDate,
    downloadLink: finalLink,
    instructions,
    status,
  });

  res.json(admit);
};

exports.updateAdmitCard = async (req, res) => {
  const admit = await AdmitCard.findById(req.params.id);
  if (!admit) return res.status(404).json({ message: "Not found" });

  const {
    title,
    organization,
    category,
    examName,
    admitCardDate,
    downloadLink,
    instructions,
    status,
  } = req.body;

  if (req.file) {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "jobsathi/admit-cards",
    });
    admit.downloadLink = upload.secure_url;
  } else if (downloadLink) {
    admit.downloadLink = downloadLink;
  }

  admit.title = title ?? admit.title;
  admit.organization = organization ?? admit.organization;
  admit.category = category ?? admit.category;
  admit.examName = examName ?? admit.examName;
  admit.admitCardDate = admitCardDate ?? admit.admitCardDate;
  admit.instructions = instructions ?? admit.instructions;
  admit.status = status ?? admit.status;

  await admit.save();
  res.json(admit);
};

exports.deleteAdmitCard = async (req, res) => {
  const admit = await AdmitCard.findByIdAndDelete(req.params.id);
  res.json({ success: !!admit });
};

exports.getPublishedAdmitCards = async (req, res) => {
  const items = await AdmitCard.find({ status: "Published" }).sort({
    createdAt: -1,
  });
  res.json(items);
};

exports.getAllAdmitCards = async (req, res) => {
  const items = await AdmitCard.find().sort({ createdAt: -1 });
  res.json(items);
};
