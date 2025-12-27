const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadController = require("../controllers/uploadController");

// ✅ Use MEMORY storage (IMPORTANT)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit (optional but safe)
    },
});

// Route
router.post("/", upload.single("file"), uploadController.uploadPDF);

module.exports = router;
