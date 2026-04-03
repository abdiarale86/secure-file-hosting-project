const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

// Create uploads folder automatically if it does not exist
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error.message));

// Frontend files
app.use(express.static(path.join(__dirname, "..", "frontend")));

// API routes
app.use("/api", authRoutes);
app.use("/api", fileRoutes);

// Simple route to show server is working
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

// Page routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "login.html"));
});

app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "upload.html"));
});

app.get("/downloads", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "downloads.html"));
});

app.get("/my-files", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "my-files.html"));
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});