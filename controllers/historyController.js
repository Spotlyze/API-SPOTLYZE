const {
  findHistoryById,
  createHistory,
  getAllHistory,
} = require("../models/historyModel");

const { bucket } = require("../models/bucketStorage");

const addHistory = async (req, res) => {
  const { user_id, result, recommendation } = req.body;

  if (!user_id || !result || !recommendation) {
    return res.status(400).json({
      message: "User_id, resultAnalyze, and recommendation are required",
    });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  try {
    const folderName = "history-picture"; // Tentukan folder
    const fileName = `${folderName}/${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.png`;
    const blob = bucket.file(fileName);
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
    });

    blobStream.on("error", (err) => {
      console.error("Blob stream error:", err);
      return res
        .status(500)
        .json({ message: "Failed to upload file!", error: err.message });
    });

    blobStream.on("finish", () => {});

    blobStream.end(req.file.buffer);

    const historyId = await createHistory(
      user_id,
      result,
      recommendation,
      publicUrl
    );

    res.status(201).json({ message: "History added successfully", historyId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllHistoryHandler = async (req, res) => {
  try {
    const history = await getAllHistory();
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

const getByID = async (req, res) => {
  try {
    id = req.params.id;
    const history = await findHistoryById(id);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

module.exports = { getAllHistoryHandler, addHistory, getByID };
