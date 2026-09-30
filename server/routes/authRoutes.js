const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");

const authenticate = require("../middleware/auth");
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
} = require("../validators/authValidators");

// Public routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

// Protected routes
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfileValidation, updateProfile);
router.put(
  "/change-password",
  authenticate,
  changePasswordValidation,
  changePassword,
);
router.delete("/account", authenticate, deleteAccount);

module.exports = router;
