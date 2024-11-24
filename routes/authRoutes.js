const express = require("express");
const { login, register } = require("../controllers/authController");
const {
  addSkincare,
  getAllSkincareHandler,
  addSkincareFavorite,
  updateSkincareHandler,
  deleteSkincareHandler,
  getAllFavoriteHandler,
} = require("../controllers/skincareController");
const {
  addHistory,
  getAllHistoryHandler,
  getByID,
} = require("../controllers/historyController");
const {
  getProfile,
  updateUserHandler,
  deleteUserHandler,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authToken");

const router = express.Router();

// Route untuk login
router.post("/login", login);

router.post("/register", register);

router.get("/profile/:id", authenticateToken, getProfile);

router.put("/profile/:id", authenticateToken, updateUserHandler);

router.delete("/profile/:id", authenticateToken, deleteUserHandler);

router.post("/skincare", authenticateToken, addSkincare);

router.get("/skincare", authenticateToken, getAllSkincareHandler);

router.put("/skincare/:id", authenticateToken, updateSkincareHandler);

router.delete("/skincare/:id", authenticateToken, deleteSkincareHandler);

router.post("/favorite", authenticateToken, addSkincareFavorite);

router.get("/favorite/:id", authenticateToken, getAllFavoriteHandler);

router.post("/history", authenticateToken, addHistory);

router.get("/history", authenticateToken, getAllHistoryHandler);

router.get("/history/:id", authenticateToken, getByID);

module.exports = router;
