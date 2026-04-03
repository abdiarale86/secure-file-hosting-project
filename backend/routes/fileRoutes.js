const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const File = require("../models/File");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

const uploadsFolder = path.join(__dirname, "..", "uploads");

// Remove unsafe characters from filenames
function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsFolder);
  },
  filename: function (req, file, cb) {
    const safeName = sanitizeFileName(file.originalname);
    cb(null, Date.now() + "-" + safeName);
  }
});

function fileFilter(req, file, cb) {
  const allowedExtensions = [".pdf", ".mp4"];
  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error("Only .pdf and .mp4 files are allowed."));
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter: fileFilter
});

// POST /api/upload
router.post("/upload", verifyToken, (req, res) => {
  upload.single("file")(req, res, async function (error) {
    try {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "File is too large. Maximum size is 20 MB." });
        }
        return res.status(400).json({ message: error.message });
      }

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Please choose a file to upload." });
      }

      const newFile = new File({
        filename: req.file.filename,
        original_filename: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        uploaded_by: req.user._id,
        owner_username: req.user.username,
        owner_email: req.user.email
      });

      await newFile.save();

      return res.status(201).json({ message: "File uploaded successfully." });
    } catch (saveError) {
      return res.status(500).json({ message: "Server error while uploading file." });
    }
  });
});

// GET /api/public-files
router.get("/public-files", verifyToken, async (req, res) => {
  try {
    const files = await File.find().sort({ uploaded_at: -1 });

    return res.json(files);
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching files." });
  }
});

// GET /api/my-files
router.get("/my-files", verifyToken, async (req, res) => {
  try {
    const files = await File.find({ uploaded_by: req.user._id }).sort({ uploaded_at: -1 });

    return res.json(files);
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching your files." });
  }
});

// GET /api/files/:id/download
router.get("/files/:id/download", verifyToken, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    return res.download(file.path, file.original_filename);
  } catch (error) {
    return res.status(500).json({ message: "Server error while downloading file." });
  }
});

// DELETE /api/files/:id
router.delete("/files/:id", verifyToken, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    if (String(file.uploaded_by) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden. You can only delete your own files." });
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await File.findByIdAndDelete(req.params.id);

    return res.json({ message: "File deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error while deleting file." });
  }
});

module.exports = router;