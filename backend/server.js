import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import settingsRouter from "./routes/settingsRoute.js";
import { initTelegramBot } from "./services/telegramBot.js";
dotenv.config();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images
app.use("/images", express.static(path.join(__dirname, "uploads")));

// Database
connectDB().then(() => {
  // Initialize Telegram bot after DB is connected
  initTelegramBot();
});

// Mount API routers
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/settings", settingsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Serve Admin Panel (must come before frontend to avoid conflicts)
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.get("/admin/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin/index.html"));
});

// Serve Frontend (catch-all for SPA routing)
app.use(express.static(path.join(__dirname, "public/frontend")));
app.get("{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "public/frontend/index.html"));
});

app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
});
