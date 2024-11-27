const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtSecret, jwtExpiresIn } = require("../config");
const { findUserByName, createUser } = require("../models/userModel");
const { bucket } = require("../models/bucketStorage");

// Handler untuk login
const login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await findUserByName(name);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.user_id, username: user.username },
      jwtSecret,
      {
        expiresIn: jwtExpiresIn,
      }
    );

    const user_id = user.user_id;
    const user_name = user.name;

    res.json({ token, user_id, user_name });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const register = async (req, res) => {
  const { name, email, password, address, date_of_birth } = req.body;

  if (!name || !password || !email || !address || !date_of_birth) {
    return res.status(400).json({
      message: "Name, email, password, address, and date of birth are required",
    });
  }
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  try {
    const existingUser = await findUserByName(name);
    if (existingUser) {
      return res.status(409).json({ message: "Name is already exists" });
    }

    const folderName = "profile-picture"; // Tentukan folder
    const fileName = `${folderName}/${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.png`;
    const blob = bucket.file(fileName);
    const publicUrl = ``;
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

    blobStream.on("finish", () => {
      publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    });

    blobStream.end(req.file.buffer);

    const hashedPassword = bcrypt.hashSync(password, 8);

    const userId = await createUser(
      name,
      email,
      hashedPassword,
      address,
      date_of_birth,
      publicUrl
    );

    res.status(201).json({ message: "User registered successfully", userId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { login, register };
