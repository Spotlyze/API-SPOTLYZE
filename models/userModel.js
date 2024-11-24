const db = require("../db/database");

const findUserByName = async (name) => {
  try {
    const [rows] = await db.query("SELECT * FROM user WHERE name = ?", [
      name,
    ]);
    return rows[0]; // Mengembalikan user pertama (jika ada)
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};

const createUser = async (name, email, password, address, date_of_birth) => {
  try {
    const [result] = await db.query(
      "INSERT INTO user (name, email, password, address, date_of_birth) VALUES (?, ?, ?, ?, ?)",
      [name, email, password, address, date_of_birth]
    );
    return result.insertId; // Kembalikan ID user yang baru dibuat
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create user");
  }
};

const findUserById = async (user_id) => {
  try {
    const [rows] = await db.query("SELECT name, email, address, date_of_birth FROM user WHERE user_id = ?", [
      user_id,
    ]);
    return rows[0]; // Mengembalikan user pertama (jika ada)
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};

const updateUserById = async (id, updateData) => {
  try {
    // Buat query update dengan parameter
    const [result] = await db.query(
      "UPDATE user SET ? WHERE user_id = ?",
      [updateData, id]
    );
    return result; // Kembalikan hasil query
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};

const deleteUserById = async (id) => {
  try {
    // Buat query delete dengan parameter
    const [result] = await db.query(
      "DELETE FROM user WHERE user_id = ?",
      [id]
    );
    return result; // Kembalikan hasil query
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};


module.exports = { findUserByName, createUser, findUserById, updateUserById, deleteUserById };
