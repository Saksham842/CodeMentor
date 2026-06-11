const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)),
});

const upload = multer({
  storage, limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/zip" || file.originalname.endsWith(".zip")) cb(null, true);
    else cb(new Error("Only ZIP files allowed"));
  },
});

exports.uploadFile = (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (req.file) return res.json({ success: true, filename: req.file.filename, originalname: req.file.originalname });
    if (req.body.githubUrl) return res.json({ success: true, message: "GitHub URL received." });
    res.status(400).json({ error: "No file or URL provided." });
  });
};
