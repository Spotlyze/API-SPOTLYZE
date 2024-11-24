const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtSecret, jwtExpiresIn } = require("../config");
const { findUserByName, createUser, findUserById, updateUser } = require("../models/userModel");


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
      { id: user.id, username: user.username },
      jwtSecret,
      {
        expiresIn: jwtExpiresIn,
      }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const register = async (req, res) => {
  const { name, email, password, address, date_of_birth } = req.body;

  console.log(req.body);

  if (!name || !password || !email || !address || !date_of_birth) {
    return res
      .status(400)
      .json({ message: "Name, email, password, address, and date of birth are required" });
  }

  try {
    const existingUser = await findUserByName(name);
    if (existingUser) {
      return res.status(409).json({ message: "Name is already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const userId = await createUser(name, email, hashedPassword, address, date_of_birth);

    res.status(201).json({ message: "User registered successfully", userId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = { login, register };
