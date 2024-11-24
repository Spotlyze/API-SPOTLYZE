const db = require("../db/database");

//SKINCARE
const findSkincareByName = async (name) => {
  try {
    const [rows] = await db.query("SELECT * FROM skincare WHERE name = ?", [
      name,
    ]);
    return rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};

const createSkincare = async (name, ingredients, price, explanation) => {
  try {
    const [result] = await db.query(
      "INSERT INTO skincare (name, ingredients, price, explanation) VALUES (?, ?, ?, ?)",
      [name, ingredients, price, explanation]
    );
    return result.insertId; // Kembalikan ID user yang baru dibuat
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create skincare");
  }
};

const getAllSkincare = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM skincare");
    return rows;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to retrieve users");
  }
};

const updateSkincareById = async (id, updateData) => {
  try {
    // Buat query update dengan parameter
    const [result] = await db.query(
      "UPDATE skincare SET ? WHERE skincare_id = ?",
      [updateData, id]
    );
    return result; // Kembalikan hasil query
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};

const deleteSkincareById = async (id) => {
  try {
    // Buat query delete dengan parameter
    const [result] = await db.query(
      "DELETE FROM skincare WHERE skincare_id = ?",
      [id]
    );
    return result; // Kembalikan hasil query
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};

//FAVORITE
const findSkincareFavoriteById= async (user_id, skincare_id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM skincare_favorite WHERE user_id = ? AND skincare_id = ?",
      [user_id, skincare_id]
    );
    return rows[0];
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};

const createFavorite = async (user_id, skincare_id) => {
  const date = new Date().toISOString().split("T")[0];
  try {
    const [result] = await db.query(
      "INSERT INTO skincare_favorite (user_id, skincare_id, date) VALUES (?, ?, ?)",
      [user_id, skincare_id, date]
    );
    return result.insertId;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create favorite");
  }
};

const getAllFavorite = async (id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM skincare_favorite WHERE user_id = ?",
      [id]
    );
    return rows;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to retrieve users");
  }
};

module.exports = {
  findSkincareByName,
  createSkincare,
  createFavorite,
  findSkincareFavoriteById,
  getAllSkincare,
  updateSkincareById,
  deleteSkincareById,
  getAllFavorite,
};
