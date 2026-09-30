const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "student_course_system",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  }
};

const dropExistingTables = async (connection) => {
  try {
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");

    const [tables] = await connection.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = ?",
      [process.env.DB_NAME],
    );

    for (const table of tables) {
      await connection.query(
        `DROP TABLE IF EXISTS ${table.TABLE_NAME || table.table_name}`,
      );
    }

    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Existing tables dropped successfully");
  } catch (error) {
    console.error("Error dropping tables:", error.message);
    throw error;
  }
};

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Check if tables already exist
    const [tables] = await connection.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'students'",
      [process.env.DB_NAME],
    );

    const tablesExist = tables[0].count > 0;

    if (tablesExist) {
      console.log("Database tables already exist");

      // Check if courses table has data
      const [courseCount] = await connection.query(
        "SELECT COUNT(*) as count FROM courses",
      );

      if (courseCount[0].count === 0) {
        console.log("Courses table is empty, seeding data...");
        await seedCourses(connection);
      } else {
        console.log(`Database has ${courseCount[0].count} courses`);
      }

      connection.release();
      return;
    }

    // Only drop and recreate if tables don't exist
    await dropExistingTables(connection);

    await connection.query(`
      CREATE TABLE students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.query(`
      CREATE TABLE courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        instructor VARCHAR(255),
        credits INT DEFAULT 3,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_title (title)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.query(`
      CREATE TABLE enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        course_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_enrollment_student 
          FOREIGN KEY (student_id) REFERENCES students(id) 
          ON DELETE CASCADE 
          ON UPDATE CASCADE,
        CONSTRAINT fk_enrollment_course 
          FOREIGN KEY (course_id) REFERENCES courses(id) 
          ON DELETE CASCADE 
          ON UPDATE CASCADE,
        CONSTRAINT unique_enrollment UNIQUE (student_id, course_id),
        INDEX idx_student (student_id),
        INDEX idx_course (course_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log("Database schema created successfully");

    await seedCourses(connection);

    connection.release();
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    throw error;
  }
};

const seedCourses = async (connection) => {
  const sampleCourses = [
    {
      title: "Programming Fundamentals",
      description:
        "Learn the basics of programming concepts, logic building, and problem-solving techniques.",
      instructor: "Mr Faheem Muhammad",
      credits: 3,
    },
    {
      title: "Object-Oriented Programming (OOP)",
      description:
        "Master object-oriented programming concepts including classes, objects, inheritance, and polymorphism.",
      instructor: "Prof Dr Tamleek Ali Tanveer",
      credits: 4,
    },
    {
      title: "Data Structures",
      description:
        "Study essential data structures like arrays, linked lists, stacks, queues, trees, and graphs.",
      instructor: "Mr Haroon Zafar",
      credits: 4,
    },
    {
      title: "Analysis of Algorithms",
      description:
        "Learn algorithm design techniques, complexity analysis, and optimization strategies.",
      instructor: "DR Muhammad Imran Khalil",
      credits: 3,
    },
    {
      title: "Database Systems",
      description:
        "Comprehensive course on database design, SQL, normalization, and transaction management.",
      instructor: "Mr Abdur Rehman Shah",
      credits: 3,
    },
    {
      title: "Operating Systems",
      description:
        "Understand OS concepts including process management, memory management, and file systems.",
      instructor: "Mr Shoaib Ullah",
      credits: 4,
    },
    {
      title: "Computer Networks",
      description:
        "Explore network protocols, architectures, and communication technologies.",
      instructor: "Mr Ahsan",
      credits: 3,
    },
    {
      title: "Digital Logic Design",
      description:
        "Learn digital circuits, logic gates, combinational and sequential circuit design.",
      instructor: "Mr Umar Farooq",
      credits: 3,
    },
    {
      title: "Computer Organization & Assembly Language",
      description:
        "Study computer architecture, assembly language programming, and hardware-software interaction.",
      instructor: "Mr Abdul Samad",
      credits: 4,
    },
    {
      title: "Artificial Intelligence",
      description:
        "Explore AI concepts, search algorithms, knowledge representation, and machine learning basics.",
      instructor: "Prof Dr Tamleek Ali Tanveer",
      credits: 4,
    },
    {
      title: "Information Security",
      description:
        "Learn security principles, cryptography, network security, and secure coding practices.",
      instructor: "DR Muhammad Imran Khalil",
      credits: 3,
    },
  ];

  for (const course of sampleCourses) {
    await connection.query(
      "INSERT INTO courses (title, description, instructor, credits) VALUES (?, ?, ?, ?)",
      [course.title, course.description, course.instructor, course.credits],
    );
  }

  console.log("Sample courses seeded successfully");
};

module.exports = { pool, testConnection, initializeDatabase };
