const {
  findHistoryById,
  createHistory,
  getAllHistory,
} = require("../models/historyModel");

const addHistory = async (req, res) => {
  const { user_id, result, recommendation } = req.body;

  console.log(req.body);

  if (!user_id || !result || !recommendation) {
    return res.status(400).json({
      message: "User_id, resultAnalyze, and recommendation are required",
    });
  }

  try {
    const historyId = await createHistory(user_id, result, recommendation);

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
