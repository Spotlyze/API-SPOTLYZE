const db = require("../db/database");

const findHistoryByUser = async (id) => {
  try {
    console.log(id);
    const [rows] = await db.query(
      "SELECT * FROM analyze_history WHERE user_id = ?",
      [id]
    );
    return rows;
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};

const findHistoryById = async (id) => {
  try {
    console.log(id);
    const [rows] = await db.query(
      "SELECT * FROM analyze_history WHERE analyze_history_id = ?",
      [id]
    );
    return rows;
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};

const createHistory = async (user_id, resultAnalyze, recommendation, publicUrl) => {
  const date = new Date().toISOString().split("T")[0];
  try {
    const [result] = await db.query(
      "INSERT INTO analyze_history (user_id, results, recommendation, date, history_picture) VALUES (?, ?, ?, ?, ?)",
      [user_id, resultAnalyze, recommendation, date, publicUrl]
    );
    return result.insertId;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create favorite");
  }
};

const getAllHistory = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM analyze_history");
    return rows;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to retrieve history");
  }
};

module.exports = { findHistoryByUser, createHistory, getAllHistory, findHistoryById };
