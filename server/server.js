import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import { loadRiveScript } from "./services/rivescriptService.js";
import ChatHistory from "./models/ChatHistory.js";
import { logError, logInfo } from "./utils/logger.js";
import cors from "cors";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Connect to DB and load RiveScript
await connectDB();
await loadRiveScript();


//testing
app.get("/", (req, res) => {
  res.send("Yes this is working");
});


// Import routes
import chatRoutes from "./routes/chatRoutes.js";

// Routes
app.use("/api", chatRoutes)

// Cleanup job - runs daily
setInterval(async () => {
  try {
    await ChatHistory.cleanup(30);
    logInfo("Completed chat history cleanup");
  } catch (error) {
    logError("Cleanup job failed:", error);
  }
}, 24 * 60 * 60 * 1000);

// Error handling
app.use((err, req, res, next) => {
  logError("Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => logInfo(`Server running on port ${PORT}`));