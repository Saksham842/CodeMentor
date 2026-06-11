exports.getStatus = (req, res) => {
  res.json({ status: "idle", progress: 100, message: "Server is running" });
};

exports.parseRepository = (req, res) => {
  const { githubUrl } = req.body;
  if (!githubUrl) return res.status(400).json({ error: "Missing repository URL." });
  res.json({ success: true, message: "GitHub parsing initiated." });
};
