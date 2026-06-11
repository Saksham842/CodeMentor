const { Router } = require("express");
const { uploadFile } = require("../controllers/uploadController");

const router = Router();

router.post("/", uploadFile);

module.exports = router;
