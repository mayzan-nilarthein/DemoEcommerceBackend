const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  sendOTP,
  verifyOTP,
} = require("../controllers/adminControllers");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;
