const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { uploadImage } = require("../controllers/imageController");

const router = express.Router();

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create 'uploads' directory if it doesn't exist
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // File name format
  },
});

// Initialize multer
const upload = multer({ storage });

// Route for image upload
router.post("/upload", upload.single("file"), uploadImage); // Use multer middleware

module.exports = router;
