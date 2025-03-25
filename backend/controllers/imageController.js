const fs = require("fs");
const cloudinary = require("../config/cloudinary");

// Upload Image Controller
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "distress_calls", // Cloudinary folder
      resource_type: "auto", // Auto-detect file type
    });

    // Delete the file from the local uploads folder
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      }
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      url: result.secure_url, // The URL for the uploaded image
    });
  } catch (error) {
    console.error("Image Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
