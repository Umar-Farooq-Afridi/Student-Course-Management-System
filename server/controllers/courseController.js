const { pool } = require("../config/database");

const getAllCourses = async (req, res, next) => {
  try {
    const [courses] = await pool.query(
      "SELECT * FROM courses ORDER BY created_at DESC",
    );

    res.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

const getEnrolledCourses = async (req, res, next) => {
  try {
    const [courses] = await pool.query(
      `
      SELECT 
        c.*,
        e.created_at as enrolled_at
      FROM courses c
      INNER JOIN enrollments e ON c.id = e.course_id
      WHERE e.student_id = ?
      ORDER BY e.created_at DESC
    `,
      [req.user.id],
    );

    res.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    const [courses] = await pool.query("SELECT * FROM courses WHERE id = ?", [
      courseId,
    ]);

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const [enrollments] = await pool.query(
      "SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?",
      [studentId, courseId],
    );

    if (enrollments.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    await pool.query(
      "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)",
      [studentId, courseId],
    );

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in course",
      course: courses[0],
    });
  } catch (error) {
    next(error);
  }
};

const dropCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user.id;

    const [enrollments] = await pool.query(
      "SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?",
      [studentId, courseId],
    );

    if (enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    await pool.query(
      "DELETE FROM enrollments WHERE student_id = ? AND course_id = ?",
      [studentId, courseId],
    );

    res.json({
      success: true,
      message: "Successfully dropped the course",
    });
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { title, description, instructor, credits } = req.body;

    const [result] = await pool.query(
      "INSERT INTO courses (title, description, instructor, credits) VALUES (?, ?, ?, ?)",
      [title, description || null, instructor || null, credits || 3],
    );

    const [courses] = await pool.query("SELECT * FROM courses WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: courses[0],
    });
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const [courses] = await pool.query("SELECT * FROM courses WHERE id = ?", [
      req.params.id,
    ]);

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      course: courses[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getEnrolledCourses,
  enrollInCourse,
  dropCourse,
  createCourse,
  getCourseById,
};
