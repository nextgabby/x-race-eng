import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import grokRoutes from "./routes/grok.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Rate limit Grok API endpoints
const grokLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Too many requests. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/grok", grokLimiter, grokRoutes);

// Serve static frontend in production
const clientDist = join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get("*", (req, res) => {
  res.sendFile(join(clientDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Race Day server running on port ${PORT}`);
});
