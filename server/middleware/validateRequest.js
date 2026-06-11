function validateGrokRequest(req, res, next) {
  if (req.path === "/chat" && (!req.body.messages || !Array.isArray(req.body.messages))) {
    return res.status(400).json({ error: "Messages array is required" });
  }
  next();
}

module.exports = { validateGrokRequest };
