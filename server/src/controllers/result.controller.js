const Result = require("../models/Result");
const cloudinary = require("../config/cloudinary");

exports.createResult = async (req, res) => {
  const {
    title,
    organization,
    category,
    examName,
    resultDate,
    officialLink,
    status,
    pdfUrl,
  } = req.body;

  let finalPdf = pdfUrl;
  if (req.file) {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "jobsathi/results",
    });
    finalPdf = upload.secure_url;
  }

  const result = await Result.create({
    title,
    organization,
    category,
    examName,
    resultDate,
    pdfUrl: finalPdf,
    officialLink,
    status,
  });

  res.json(result);
};

exports.updateResult = async (req, res) => {
  const result = await Result.findById(req.params.id);
  if (!result) return res.status(404).json({ message: "Not found" });

  const {
    title,
    organization,
    category,
    examName,
    resultDate,
    officialLink,
    status,
    pdfUrl,
  } = req.body;

  if (req.file) {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "jobsathi/results",
    });
    result.pdfUrl = upload.secure_url;
  } else if (pdfUrl) {
    result.pdfUrl = pdfUrl;
  }

  result.title = title ?? result.title;
  result.organization = organization ?? result.organization;
  result.category = category ?? result.category;
  result.examName = examName ?? result.examName;
  result.resultDate = resultDate ?? result.resultDate;
  result.officialLink = officialLink ?? result.officialLink;
  result.status = status ?? result.status;

  await result.save();
  res.json(result);
};

exports.deleteResult = async (req, res) => {
  const result = await Result.findByIdAndDelete(req.params.id);
  res.json({ success: !!result });
};

exports.getPublishedResults = async (req, res) => {
  const results = await Result.find({ status: "Published" }).sort({
    createdAt: -1,
  });
  res.json(results);
};

exports.getAllResults = async (req, res) => {
  const results = await Result.find().sort({ createdAt: -1 });
  res.json(results);
};
