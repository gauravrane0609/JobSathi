const Syllabus = require("../models/Syllabus");
const cloudinary = require("../config/cloudinary");

exports.createSyllabus = async (req, res) => {
  const {
    title,
    organization,
    category,
    examName,
    description,
    status,
    syllabusPdfUrl,
  } = req.body;

  let finalPdf = syllabusPdfUrl;
  if (req.file) {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "jobsathi/syllabus",
    });
    finalPdf = upload.secure_url;
  }

  const syl = await Syllabus.create({
    title,
    organization,
    category,
    examName,
    syllabusPdfUrl: finalPdf,
    description,
    status,
  });

  res.json(syl);
};

exports.updateSyllabus = async (req, res) => {
  const syl = await Syllabus.findById(req.params.id);
  if (!syl) return res.status(404).json({ message: "Not found" });

  const {
    title,
    organization,
    category,
    examName,
    description,
    status,
    syllabusPdfUrl,
  } = req.body;

  if (req.file) {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "jobsathi/syllabus",
    });
    syl.syllabusPdfUrl = upload.secure_url;
  } else if (syllabusPdfUrl) {
    syl.syllabusPdfUrl = syllabusPdfUrl;
  }

  syl.title = title ?? syl.title;
  syl.organization = organization ?? syl.organization;
  syl.category = category ?? syl.category;
  syl.examName = examName ?? syl.examName;
  syl.description = description ?? syl.description;
  syl.status = status ?? syl.status;

  await syl.save();
  res.json(syl);
};

exports.deleteSyllabus = async (req, res) => {
  const syl = await Syllabus.findByIdAndDelete(req.params.id);
  res.json({ success: !!syl });
};

exports.getPublishedSyllabus = async (req, res) => {
  const items = await Syllabus.find({ status: "Published" }).sort({
    createdAt: -1,
  });
  res.json(items);
};

exports.getAllSyllabus = async (req, res) => {
  const items = await Syllabus.find().sort({ createdAt: -1 });
  res.json(items);
};
