const { body, param, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

const enrollValidation = [
  body("courseId")
    .notEmpty()
    .withMessage("Course ID is required")
    .isInt({ min: 1 })
    .withMessage("Course ID must be a valid positive integer"),

  validate,
];

const dropCourseValidation = [
  param("id")
    .notEmpty()
    .withMessage("Course ID is required")
    .isInt({ min: 1 })
    .withMessage("Course ID must be a valid positive integer"),

  validate,
];

const createCourseValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Course title is required")
    .isLength({ min: 3, max: 255 })
    .withMessage("Title must be between 3 and 255 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description must not exceed 5000 characters"),

  body("instructor")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Instructor name must not exceed 255 characters"),

  body("credits")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Credits must be between 1 and 10"),

  validate,
];

module.exports = {
  enrollValidation,
  dropCourseValidation,
  createCourseValidation,
};
