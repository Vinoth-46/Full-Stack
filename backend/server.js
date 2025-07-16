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
dotenv.config();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploads
app.use("/images", express.static(path.join(__dirname, "uploads")));

// Database
connectDB();

// Mount routers
app.use("/api/food",  foodRouter);
app.use("/api/user",  userRouter);
app.use("/api/cart",  cartRouter);
app.use("/api/order", orderRouter);  
// Health check
app.get("/", (req, res) => res.send("API Working"));

app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
});
