const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
  getUserProfile,
  updateUserProfile,
  updatePassword,
} = require("../controllers/userController");
const router = express.Router();

router.get("/me", verifyToken, getUserProfile);
router.put("/me/update", verifyToken, updateUserProfile);
router.put("/me/password", verifyToken, updatePassword);

module.exports = router;
