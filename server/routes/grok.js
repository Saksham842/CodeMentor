const { Router } = require("express");
const { chat, analyze, search, quiz, interview, resume, security, review } = require("../controllers/grokController");

const router = Router();

router.post("/chat", chat);
router.post("/analyze", analyze);
router.post("/search", search);
router.post("/quiz", quiz);
router.post("/interview", interview);
router.post("/resume", resume);
router.post("/security", security);
router.post("/review", review);

module.exports = router;
