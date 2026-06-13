const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const { errorHandler } = require("./middleware/errorHandler");
const grokRoutes = require("./routes/grok");
const projectRoutes = require("./routes/project");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/grok", grokRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/upload", uploadRoutes);

app.use(express.static(path.join(__dirname, "../client/dist")));
app.use((req, res) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
