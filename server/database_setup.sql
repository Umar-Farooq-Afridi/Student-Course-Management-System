-- ============================================
-- Student Course Management System Database
-- ============================================
-- Create database
CREATE DATABASE IF NOT EXISTS student_course_system;
USE student_course_system;
-- ============================================
-- Students Table
-- ============================================
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- Courses Table
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor VARCHAR(255),
  credits INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_title (title)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- Enrollments Table
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (student_id, course_id),
  INDEX idx_student (student_id),
  INDEX idx_course (course_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ============================================
-- Sample Courses Data
-- ============================================
INSERT INTO courses (title, description, instructor, credits)
VALUES (
    'Introduction to Web Development',
    'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
    'Dr. Sarah Johnson',
    3
  ),
  (
    'Data Structures and Algorithms',
    'Master essential data structures and algorithms for efficient programming.',
    'Prof. Michael Chen',
    4
  ),
  (
    'Database Management Systems',
    'Comprehensive course on relational databases, SQL, and database design.',
    'Dr. Emily Rodriguez',
    3
  ),
  (
    'Mobile App Development',
    'Build native mobile applications for iOS and Android platforms.',
    'Prof. David Kim',
    4
  ),
  (
    'Machine Learning Fundamentals',
    'Introduction to machine learning algorithms and practical applications.',
    'Dr. Alex Turner',
    4
  ),
  (
    'Cloud Computing with AWS',
    'Learn cloud architecture and services using Amazon Web Services.',
    'Prof. Jennifer Lee',
    3
  ),
  (
    'Cybersecurity Essentials',
    'Understand security principles and protect systems from cyber threats.',
    'Dr. Robert Martinez',
    3
  ),
  (
    'UI/UX Design Principles',
    'Create user-centered designs and enhance user experience.',
    'Prof. Lisa Anderson',
    3
  ),
  (
    'Software Engineering',
    'Learn software development lifecycle, testing, and project management.',
    'Dr. James Wilson',
    4
  ),
  (
    'Artificial Intelligence',
    'Explore AI concepts, neural networks, and deep learning techniques.',
    'Prof. Maria Garcia',
    4
  );
-- ============================================
-- Verify Setup
-- ============================================
SELECT 'Database setup completed successfully!' as message;
SELECT COUNT(*) as total_courses
FROM courses;