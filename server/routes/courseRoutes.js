const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getEnrolledCourses,
  enrollInCourse,
  dropCourse,
  createCourse,
  getCourseById,
} = require("../controllers/courseController");
const authenticate = require("../middleware/auth");
const {
  enrollValidation,
  dropCourseValidation,
  createCourseValidation,
} = require("../validators/courseValidators");

// Public routes
router.get("/", getAllCourses);

// Protected routes
router.get("/my", authenticate, getEnrolledCourses);
router.get("/:id", getCourseById);
router.post("/enroll", authenticate, enrollValidation, enrollInCourse);
router.delete("/drop/:id", authenticate, dropCourseValidation, dropCourse);

// Admin/Instructor routes (currently open, would normally require role check)
router.post("/", authenticate, createCourseValidation, createCourse);

module.exports = router;
