const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const {
  pool,
  testConnection,
  initializeDatabase,
} = require("./config/database");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// contentSecurityPolicy disabled because the frontend HTML files use inline
// <script> tags (e.g. protectPage()); helmet's default CSP blocks those.
app.use(helmet({ contentSecurityPolicy: false }));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        process.env.CLIENT_URL,
      ].filter(Boolean);

      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed.includes("*")) {
          const pattern = new RegExp("^" + allowed.replace(/\*/g, ".*") + "$");
          return pattern.test(origin);
        }
        return allowed === origin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        if (process.env.NODE_ENV !== "production") {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: "Too many authentication attempts, please try again later.",
  skipSuccessfulRequests: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/courses", courseRoutes);

// Serve the frontend. "../client" assumes this file lives in server/ and
// the frontend lives in a sibling client/ folder (server/server.js, client/index.html).
// express.static automatically serves client/index.html for the "/" route.
app.use(express.static(path.join(__dirname, "../client")));

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error(
        "Failed to connect to database. Please check your configuration.",
      );
      process.exit(1);
    }

    await initializeDatabase();

    const server = app.listen(PORT, async () => {
      console.log("");
      console.log("═══════════════════════════════════════════════════");
      console.log("  Student Course Management System API");
      console.log("═══════════════════════════════════════════════════");
      console.log(`   Server running on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`   Frontend: http://localhost:${PORT}/login.html`);
      console.log(`   Health Check: http://localhost:${PORT}/health`);
      console.log("═══════════════════════════════════════════════════");
      console.log("");

      // Auto-open the login page in the default browser (dev convenience only)
      if (process.env.NODE_ENV !== "production") {
        try {
          const open = (await import("open")).default;
          await open(`http://localhost:${PORT}/login.html`);
        } catch (err) {
          console.log(
            "Could not auto-open the browser. Open this manually: " +
              `http://localhost:${PORT}/login.html`,
          );
        }
      }
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Closing server gracefully...`);
      server.close(() => {
        console.log("Server closed successfully");
        pool.end(() => {
          console.log("Database connections closed");
          process.exit(0);
        });
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();

module.exports = app;
