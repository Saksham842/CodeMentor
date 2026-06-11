const { Router } = require("express");
const { getStatus, parseRepository } = require("../controllers/projectController");

const router = Router();

router.get("/status", getStatus);
router.post("/analyze", parseRepository);

module.exports = router;
